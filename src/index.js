const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const { createServer } = require("http");
const { Client, LocalAuth,MessageMedia  } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { connection } = require("./config");
const dbRoutes = require("./routes/db.routes");

const path = require('path');
const { default: axios } = require("axios");

// const authPath = path.join('/tmp', '.wwebjs_auth');
// if (!fs.existsSync(authPath)) {
//     fs.mkdirSync(authPath, { recursive: true }); // Create the directory if it doesn't exist
// }

const app = express();
app.use(express.json());

// HTTP & WebSocket setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors({ origin: "*" }));

// Attach io to req for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});
let client;

client = new Client({
    authStrategy: new LocalAuth({
        clientId: 6543382
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.3.html`
    }
})

client.initialize().catch(err => console.log(err))

  // Register WhatsApp client events
  client.on("qr", async (qr) => {
      
      const db = await connection();
      await db.collection("users").updateOne(
          { number: "01775564028" },
          { $set: { qr } }
      );
      qrcode.generate(qr, { small: true });
      console.log("QR RECEIVED", qr);
  });

  client.on("ready", () => {
      console.log("Client is ready!");
      io.emit("waready", { isready: true });
  });

  client.on("auth_failure", (msg) => {
      console.error("Authentication failed:", msg);
      io.emit("auth", { auth: "failed" });
  });

  client.on("disconnected", (reason) => {
      console.log("Client was logged out:", reason);
      io.emit("connection", { connection: "disconnected" });
  });




// API endpoints
app.post("/message", async (req, res) => {
    try {
        const { phoneNumber, message, mediaUrl } = req.body;
        const formattedNumber = phoneNumber.endsWith("@c.us") ? phoneNumber : `${phoneNumber}@c.us`;

        let media;
        if (mediaUrl) {
            const response = await axios.get(mediaUrl, { responseType: "arraybuffer" }); // ⬅️ Download media
            const mimeType = response.headers["content-type"]; // Get file type
            media = new MessageMedia(mimeType, Buffer.from(response.data).toString("base64"));
        }

        if (media) {
            await client.sendMessage(formattedNumber, media, { caption: message });
            console.log(`Media + Message sent to ${formattedNumber}`);
        } else {
            await client.sendMessage(formattedNumber, message);
            console.log(`Message sent to ${formattedNumber}`);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to send message:", error);
        res.status(500).json({ success: false, error: error.message });
    }
    // const { phoneNumber, message } = req.body;
    // const formattedNumber = phoneNumber.endsWith("@c.us")
    //     ? phoneNumber
    //     : `${phoneNumber}@c.us`;
    // console.log(formattedNumber);
    
    // client
    //     .sendMessage("8801303954432@c.us", message)
    //     .then(() => console.log(`Message sent to ${formattedNumber}`))
    //     .catch((err) => console.error("Failed to send message:", err));

    // res.send();
});

app.get("/", (req, res) => {
  res.send('qrcode')
  
})
app.get("/qr", (req, res) => {
  // Register WhatsApp client events
  let qrc=''
  client.on("qr", async (qr) => {
    console.log("QR RECEIVED", qr);
    const db = await connection();
    await db.collection("users").updateOne(
        { number: "01771973925" },
        { $set: { qr } }
    );
    // // qrcode.generate(qr, { small: true });
    qrc=qr
  });
  res.send({qrc})
})
app.use("/db", dbRoutes);

// Server setup
const PORT = process.env.PORT || 3028;
httpServer.listen(PORT, () => console.log(`Server is ready on port ${PORT}`));

// Export for Vercel or other serverless platforms
module.exports = app;

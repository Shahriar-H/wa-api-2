const express = require("express")
const messageRouter = require('./routers/messageRouter')
const whatsappclient = require('./services/WhatsappClient')
const { Server } = require("socket.io");
const cors = require("cors");
const { createServer } = require('http');
const dbRoutes = require("./routes/db.routes");
const { connection } = require("./config");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { default: puppeteer } = require("puppeteer");
const app = express()
app.use(express.json())


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: "*"
}));

// Share the io instance with the router
app.use((req, res, next) => {
    req.io = io; // Attach io instance to request object
    next();
});


const client = new Client({
    authStrategy: new LocalAuth({
        clientId: '766676554555'
    }),
    puppeteer: {
        headless: true,
        executablePath: puppeteer.executablePath()
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.0.html',
    },
});

client.on('qr', async (qr) => {
  console.log('QR RECEIVED', qr);
  const db = await connection();
  await db.collection("users").updateOne(
    { number:'01771973925' },        // Filter
    { $set: { qr:qr } }       // Update
  )
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
  io.emit("waready",{isready:true})
});

io.emit("waready",{isready:true})

client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
  io.emit("auth",{auth:'failed'})
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out:', reason);
  io.emit("connection",{connection:'disconnected'})
});

(async () => {
  try {
    await client.initialize();
  } catch (err) {
    console.error('Error during client initialization:', err.message);
  }
})();

function sendMessage1(phoneNumber, message) {
    if (!client) {
        console.error("Client is not initialized!");
        return;
    }

    // Ensure the phone number is in the correct format with the country code
    if (!phoneNumber.endsWith("@c.us")) {
        phoneNumber = `${phoneNumber}@c.us`;
    }

    client.sendMessage(phoneNumber, message)
        .then(() => {
            console.log(`Message sent to ${phoneNumber}: ${message}`);
        })
        .catch((err) => {
            console.error(`Failed to send message to ${phoneNumber}:`, err);
        });
}

app.post("/message", (req, res) => {
    // const file = req.file
    // const clientId = req.body.clientId;
    sendMessage1(req.body.phoneNumber, req.body.message);
    res.send();
})





// app.use(messageRouter)
app.use("/db",dbRoutes)

httpServer.listen(3021, () => console.log(`Server is ready on port 3000`));

module.exports={sendMessage1}

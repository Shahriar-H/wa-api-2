const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")

const {connection} = require("../config.js")


const clients = {}
const resultNode = {}


async function startClient(id,req, res) {
    
    try {
        const db = await connection();
    
        clients[id] = new Client({
            authStrategy: new LocalAuth({
                clientId: id
            }),
            webVersionCache: {
                type: 'remote',
                remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.3.html`
            },
            puppeteer:{
                headless:false
            }
            
        })

        console.log(clients[id]?.isReady);
        

        clients[id].initialize().catch(err => console.log(err))
        
        clients[id].on("qr", async (qr) => {
            console.log('qr',qr)
            // resultNode={...resultNode,qr:qr}
            await db.collection("users").updateOne(
                { instance_id:id },        // Filter
                { $set: { qr:qr } }       // Update
            )
            qrcode.generate(qr, { small: true })
        })
        clients[id].on("ready", () => {
            console.log("Client is ready!")
            req?.io.emit("waready",{isready:true})
        })
        clients[id].on("message", async (msg) => {
            try {
                if (process.env.PROCCESS_MESSAGE_FROM_CLIENT && msg.from != "status@broadcast") {
                    const contact = await msg.getContact()
                    console.log(contact, msg.from)
                }
            } catch (error) {
                console.error(error)
            }
        })
        console.log("resultNode",resultNode);
    } catch (error) {
        console.log(error);
        
    }
    
}

function sendMessage(phoneNumber, message, clientId, file) {
    console.log(phoneNumber, message, clientId, file);
    console.log(clients[clientId]?.isReady);
    if(file) {
        const messageFile = new MessageMedia(file.mimetype, file.buffer.toString('base64'))
        clients[Number(clientId)]?.sendMessage(phoneNumber, messageFile)
    } else {
        clients[clientId]?.sendMessage(phoneNumber, message);
    }
}

module.exports = { startClient, sendMessage }
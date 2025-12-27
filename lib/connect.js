const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const Pino = require("pino")
const config = require("../config")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    logger: Pino({ level: "silent" }),
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "open") {
      console.log("✅ MALIYA-MD Connected")

      const me = sock.user.id

      await sock.sendMessage(me, {
        image: { url: config.IMAGE_URL },
        caption: `✅ *${config.BOT_NAME} CONNECTED*

🤖 The bot has been successfully connected to WhatsApp.

⏰ Time: ${new Date().toLocaleString()}
`
      })
    }

    if (connection === "close") {
      if (
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut
      ) {
        startBot()
      }
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    console.log("📩 Message Received")
  })
}

module.exports = { startBot }

const { Low } = require("lowdb")
const { JSONFile } = require("lowdb/node")

const db = new Low(new JSONFile("./lib/db.json"))

async function initDB() {
  await db.read()
  db.data ||= { users: [] }
  await db.write()
}

initDB()

module.exports = db

const keys = require("./keys")

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
app.use(cors())
app.use(bodyParser.json())

// setup postgres
const { Pool } = require("pg")
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.port,
})

pgClient.connect()
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.log(err))
})

// setup redis client
const redis = require("redis")
const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    reconnectStrategy: () => 1000,
  },
})
redisClient.connect()
const redisPublisher = redisClient.duplicate()
redisPublisher.connect()

// express route handlers
app.get("/", (_req, res) => {
  res.send("Hii")
})
app.get("/values/all", async (_req, res) => {
  const values = await pgClient.query("SELECT * from values")
  res.send(values.rows)
})
app.get("/values/current", async (_req, res) => {
  const currentValues = await redisClient.hGetAll("values")
  res.send(currentValues)
})
app.post("/values", async (req, res) => {
  const { index } = req.body

  if (parseInt(index) > 40) return res.status(422).send("Index is too high!")

  await redisClient.hSet("values", index, "Nothing yet!")
  await redisPublisher.publish("insert", index)

  await pgClient.query("INSERT INTO values(number) VALUES($1)", [index])
  res.send({ working: true })
})

app.listen(5001, () => {
  console.log("server live on 5001")
})

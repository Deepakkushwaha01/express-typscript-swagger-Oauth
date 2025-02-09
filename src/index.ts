import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import Connection from './database/connection.ts'
import router from './router/routes.ts'

const app = express()

dotenv.config()
Connection()
app.use(express.json())
app.use(router)

app.use(
  cors({
    credentials: true,
  })
)

app.use(bodyParser.json())
app.use(cookieParser())

const server = http.createServer(app)

const port = process.env.PORT || 8000

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

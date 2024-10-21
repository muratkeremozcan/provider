import cors from 'cors'
import express, { json } from 'express'

// Initialize Express server
const server = express()
server.use(
  cors({
    origin: 'http://localhost:3000' // allow only your React app, you can add other urls here for deployments
  })
)
server.use(json())

server.get('/', (_, res) =>
  res.status(200).json({ message: 'Server is running' })
)

server.use('/auth/fake-token', (_, res) => {
  const token = `Bearer ${new Date().toISOString()}`
  return res.status(200).json({ token, status: 200 })
})

export { server }

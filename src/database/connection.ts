import mongoose from 'mongoose'

const Connection = async () => {
  try {
    const connectionUrl = `${process.env.MONGODB_URL as string}/${process.env.MONGODB_NAME as string}`

    if (!connectionUrl) {
      throw new Error('Invalid Mongodb connection string')
    }

    await mongoose.connect(connectionUrl)

    console.log('🚀 MongoDB Connected Successfully')

    mongoose.connection.on('error', error => {
      console.error('❌ MongoDB Connection Error:', error)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected')
    })
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error)
    process.exit(1)
  }
}

export default Connection

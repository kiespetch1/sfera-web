const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Successfully connected to database')
    
    // Test query
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)
    
    await prisma.$disconnect()
    console.log('✅ Disconnected from database')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
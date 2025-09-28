import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@sfera.com" } })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10)

    const admin = await prisma.user.create({
      data: {
        email: "admin@sfera.com",
        password: hashedPassword,
        name: "Admin",
        emailVerified: new Date(),
      },
    })

    console.log("✅ Admin user created:")
    console.log("   Email: admin@sfera.com")
    console.log("   Password: admin123")
    console.log("   User ID:", admin.id)
  } else {
    console.log("ℹ️ Admin user already exists")
  }

  const existingTestUser = await prisma.user.findUnique({ where: { email: "test@sfera.com" } })

  if (!existingTestUser) {
    const hashedTestPassword = await bcrypt.hash("test123", 10)

    const testUser = await prisma.user.create({
      data: {
        email: "test@sfera.com",
        password: hashedTestPassword,
        name: "Test User",
        emailVerified: new Date(),
      },
    })

    console.log("✅ Test user created:")
    console.log("   Email: test@sfera.com")
    console.log("   Password: test123")
    console.log("   User ID:", testUser.id)
  } else {
    console.log("ℹ️ Test user already exists")
  }

  console.log("Database seed completed!")
}

main()
  .catch(e => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Engine Oil - Castrol",
        description: "Premium quality engine oil for cars",
        price: 899,
        imageUrl: "/images/engine-oil.jpg",
        stock: 50,
        category: "Oil",
        brand: "Castrol",
      },
      {
        name: "Brake Pad - Hyundai",
        description: "Durable brake pad for Hyundai models",
        price: 1299,
        imageUrl: "/images/brake-pad.jpg",
        stock: 30,
        category: "Brakes",
        brand: "Hyundai",
      },
    ],
  })

  console.log("✅ Seeded products")
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())

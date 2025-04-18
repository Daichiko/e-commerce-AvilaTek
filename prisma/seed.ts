import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const rolesData = [
    { name: "admin", description: "Administrador del sistema" },
    { name: "dev", description: "Desarrollador con privilegios avanzados" },
    { name: "seller", description: "Vendedor de productos" },
    { name: "user", description: "Consumidor de productos" },
  ];

  const roles = await Promise.all(
    rolesData.map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      })
    )
  );

  const passwordHash = await bcrypt.hash("12345678", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@correo.com" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@correo.com",
      password: passwordHash,
    },
  });

  await Promise.all(
    roles.map((role) =>
      prisma.userRoles.upsert({
        where: {
          userId_roleId: {
            userId: adminUser.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: adminUser.id,
          roleId: role.id,
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error("Error al ejecutar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

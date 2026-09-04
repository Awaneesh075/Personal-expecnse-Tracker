import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@demo.com';
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingUser) {
    // Make sure they have admin role
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' }
    });
    console.log(`Admin user ${adminEmail} already exists. Updated role to ADMIN.`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'System Admin',
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log(`Successfully created Admin User: ${admin.email} (Password: admin123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

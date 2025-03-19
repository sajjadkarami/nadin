import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear all data - delete tasks
  // first due to foreign key constraint

  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('Password1234', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      userName: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'Admin',
        },
      },
    },
  });
  console.log('Created admin user');

  // Create 20 tasks for admin
  for (let i = 1; i <= 20; i++) {
    await prisma.task.create({
      data: {
        name: `Admin Task ${i}`,
        description: `This is an administrative task ${i}`,
        userId: admin.id,
      },
    });
  }
  console.log('Created 20 tasks for admin');

  // Create 20 users
  for (let i = 1; i <= 20; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        userName: `user${i}`,
        password: hashedPassword,
        role: Role.USER,
        profile: {
          create: {},
        },
      },
    });

    // Create random number of tasks (10-20) for each user
    const numTasks = Math.floor(Math.random() * 11) + 10; // Random number between 10 and 20
    for (let j = 1; j <= numTasks; j++) {
      await prisma.task.create({
        data: {
          name: `Task ${j} of User ${i}`,
          description: `This is task ${j} created by user ${i}`,
          userId: user.id,
        },
      });
    }

    console.log(`Created user ${i} with ${numTasks} tasks`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());

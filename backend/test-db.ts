import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('🧪 Testing database connection...');
  try {
    const accountCount = await prisma.account.count();
    console.log(`✅ Successfully connected to database! Found ${accountCount} accounts.`);
    
    const accounts = await prisma.account.findMany();
    console.log('Accounts:', accounts);
    
    const dids = await prisma.did.findMany({
      include: {
        trunk: true,
      },
    });
    console.log(`Found ${dids.length} DIDs:`, dids);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();

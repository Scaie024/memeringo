const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Start seeding...`);

  // Clean up existing data
  await prisma.callLog.deleteMany();
  await prisma.did.deleteMany();
  await prisma.sipTrunk.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();

  // Create test account
  const account = await prisma.account.create({
    data: {
      id: 'acc_default',
      name: 'VoiceWoot Test',
      email: 'test@voicewoot.com',
    },
  });
  console.log(`✓ Created account: ${account.name}`);

  // Create test user
  const user = await prisma.user.create({
    data: {
      id: 'user_admin',
      email: 'admin@voicewoot.com',
      password: 'hashed_password_here',
      name: 'Admin User',
      role: 'admin',
      accountId: account.id,
    },
  });
  console.log(`✓ Created user: ${user.name}`);

  // Create test SIP trunks
  const trunk1 = await prisma.sipTrunk.create({
    data: {
      id: 'trunk_1',
      name: 'Main Provider MX',
      host: 'sip.provider.mx',
      port: 5060,
      username: 'voicewoot',
      password: 'password123',
      status: 'REGISTERED',
      accountId: account.id,
    },
  });
  console.log(`✓ Created trunk: ${trunk1.name}`);

  const trunk2 = await prisma.sipTrunk.create({
    data: {
      id: 'trunk_2',
      name: 'Backup Provider',
      host: 'sip.backup.com',
      port: 5060,
      status: 'UNREGISTERED',
      accountId: account.id,
    },
  });
  console.log(`✓ Created trunk: ${trunk2.name}`);

  // Create test DIDs
  const didsData = [
    {
      id: 'did_1',
      phoneNumber: '+525585261234',
      country: 'MX',
      routeType: 'AGENT',
      routeTarget: 'agent_support',
      status: 'ACTIVE',
      trunkId: trunk1.id,
    },
    {
      id: 'did_2',
      phoneNumber: '+523341605678',
      country: 'MX',
      routeType: 'IVR',
      routeTarget: 'ivr_main',
      status: 'ACTIVE',
      trunkId: trunk1.id,
    },
    {
      id: 'did_3',
      phoneNumber: '+14155552671',
      country: 'US',
      routeType: 'QUEUE',
      routeTarget: 'q_sales',
      status: 'PROVISIONING',
      trunkId: null,
    },
    {
      id: 'did_4',
      phoneNumber: '+442079460000',
      country: 'GB',
      routeType: 'N8N_WEBHOOK',
      routeTarget: 'wh_promo',
      status: 'INACTIVE',
      trunkId: trunk2.id,
    },
    {
      id: 'did_5',
      phoneNumber: '+573101234567',
      country: 'CO',
      routeType: 'AGENT',
      routeTarget: 'agent_billing',
      status: 'ACTIVE',
      trunkId: trunk1.id,
    },
  ];

  for (const didData of didsData) {
    await prisma.did.create({
      data: {
        ...didData,
        accountId: account.id,
      },
    });
  }
  console.log(`✓ Created ${didsData.length} DIDs`);

  // Create test call logs
  const now = new Date();
  const callLog = await prisma.callLog.create({
    data: {
      id: 'call_1',
      didId: 'did_1',
      fromNumber: '+525585261234',
      toNumber: '+525512345678',
      duration: 300,
      status: 'COMPLETED',
      startTime: new Date(now.getTime() - 3600000),
      endTime: new Date(now.getTime() - 3300000),
      accountId: account.id,
    },
  });
  console.log(`✓ Created call log: ${callLog.id}`);

  console.log(`\n✅ Seeding finished successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

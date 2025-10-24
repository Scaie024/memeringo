import { PrismaClient, DidStatus, DidRouteType, TrunkStatus, CountryCode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // To make the seed idempotent, we clean up existing data first.
  // The order is important to respect foreign key constraints.
  await prisma.did.deleteMany();
  await prisma.sipTrunk.deleteMany();
  
  // Seed SipTrunks
  const trunk1 = await prisma.sipTrunk.create({
    data: {
      id: 'trunk_1',
      name: 'Proveedor Principal MX',
      host: 'sip.proveedor.mx',
      status: TrunkStatus.REGISTERED,
      accountId: 'acc_default'
    }
  });

  const trunk2 = await prisma.sipTrunk.create({
    data: {
      id: 'trunk_2',
      name: 'Proveedor Internacional',
      host: 'sip.provider.com',
      status: TrunkStatus.ERROR,
      accountId: 'acc_default'
    }
  });

  console.log(`Seeded ${await prisma.sipTrunk.count()} sip trunks.`);

  // Seed DIDs using the sample data structure
  const didsToCreate = [
    { id: 'did_1', phoneNumber: '+525585261234', country: 'MX' as CountryCode, status: DidStatus.ACTIVE, trunkId: trunk1.id, routeType: DidRouteType.AGENT, routeTarget: 'agent_support', accountId: 'acc_default' },
    { id: 'did_2', phoneNumber: '+523341605678', country: 'MX' as CountryCode, status: DidStatus.ACTIVE, trunkId: trunk1.id, routeType: DidRouteType.IVR, routeTarget: 'ivr_main', accountId: 'acc_default' },
    { id: 'did_3', phoneNumber: '+14155552671', country: 'US' as CountryCode, status: DidStatus.PROVISIONING, trunkId: null, routeType: DidRouteType.QUEUE, routeTarget: 'q_sales', accountId: 'acc_default' },
    { id: 'did_4', phoneNumber: '+442079460000', country: 'GB' as CountryCode, status: DidStatus.INACTIVE, trunkId: trunk2.id, routeType: DidRouteType.N8N_WEBHOOK, routeTarget: 'wh_promo', accountId: 'acc_default' },
    { id: 'did_5', phoneNumber: '+573101234567', country: 'CO' as CountryCode, status: DidStatus.ACTIVE, trunkId: trunk1.id, routeType: DidRouteType.AGENT, routeTarget: 'agent_billing', accountId: 'acc_default' },
    { id: 'did_6', phoneNumber: '+34919012345', country: 'ES' as CountryCode, status: DidStatus.ACTIVE, trunkId: trunk2.id, routeType: DidRouteType.IVR, routeTarget: 'ivr_main_es', accountId: 'acc_default' },
  ];

  for (const didData of didsToCreate) {
      await prisma.did.create({ data: didData });
  }

  console.log(`Seeded ${await prisma.did.count()} dids.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

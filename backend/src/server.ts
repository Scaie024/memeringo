import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import FreeSwitchService from './services/freeswitch.service';

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'FS_ESL_HOST', 'FS_ESL_PORT', 'FS_ESL_PASSWORD'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize
const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();
const freeSwitch = new FreeSwitchService();

// Register plugins
fastify.register(cors, {
  origin: '*', // Allow all origins for development
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// --- API Routes ---

// GET /api/freeswitch/status - Check ESL connection
fastify.get('/api/freeswitch/status', async () => {
  const status = freeSwitch.status;
  return {
    ...status,
    gateway: status.gateway,
  };
});

// POST /api/calls/originate - Trigger a call through FreeSWITCH
fastify.post<{ Body: { phoneNumber?: string; callerId?: string } }>('/api/calls/originate', async (request, reply) => {
  try {
    const { phoneNumber, callerId } = request.body;
    if (!phoneNumber) {
      return reply.status(400).send({ error: 'phoneNumber is required' });
    }

    const caller = callerId || process.env.FS_DEFAULT_CALLER_ID || phoneNumber;

    if (!freeSwitch.connected) {
      try {
        await freeSwitch.ensureConnected();
      } catch (error) {
        console.error('Failed to connect to FreeSWITCH for originate:', error);
        return reply.status(503).send({ error: 'FreeSWITCH ESL not connected' });
      }
    }

    const callId = await freeSwitch.originateCall(caller, phoneNumber);
    return reply.send({ callId });
  } catch (error: any) {
    console.error('Failed to originate call:', error);
    return reply.status(500).send({ error: error?.message || 'Failed to originate call' });
  }
});

// GET /api/dids - Fetch all DIDs
fastify.get('/api/dids', async (request, reply) => {
  try {
    const dids = await prisma.did.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        trunk: true,
      },
    });
    reply.send(dids);
  } catch (error) {
    console.error('Failed to fetch DIDs:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// POST /api/dids - Create a new DID
fastify.post<{ Body: { phoneNumber: string; country: string } }>('/api/dids', async (request, reply) => {
  try {
    const { phoneNumber, country } = request.body;
    if (!phoneNumber || !country) {
      return reply.status(400).send({ error: 'Phone number and country are required' });
    }
    
    const newDid = await prisma.did.create({
      data: {
        phoneNumber,
        country,
        routeType: 'AGENT',
        routeTarget: 'default',
        accountId: 'acc_default', // Hardcoded for now
      },
      include: {
        trunk: true,
      },
    });
    reply.status(201).send(newDid);
  } catch (error: any) {
    console.error('Failed to create DID:', error);
    if (error.code === 'P2002') {
      return reply.status(409).send({ error: 'This phone number already exists.' });
    }
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// PUT /api/dids/:id - Update a DID
fastify.put<{ Params: { id: string }; Body: { phoneNumber?: string; country?: string; routeType?: string; routeTarget?: string } }>('/api/dids/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const updates = request.body;
    
    if (!id) {
      return reply.status(400).send({ error: 'DID ID is required' });
    }
    
    const updated = await prisma.did.update({
      where: { id },
      data: updates,
      include: { trunk: true },
    });
    
    reply.send(updated);
  } catch (error: any) {
    console.error('Failed to update DID:', error);
    if (error.code === 'P2025') {
      return reply.status(404).send({ error: 'DID not found' });
    }
    reply.status(500).send({ error: 'Failed to update DID' });
  }
});

// DELETE /api/dids/:id - Delete a DID
fastify.delete<{ Params: { id: string } }>('/api/dids/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    
    if (!id) {
      return reply.status(400).send({ error: 'DID ID is required' });
    }
    
    await prisma.did.delete({
      where: { id },
    });
    
    reply.send({ message: 'DID deleted successfully', id });
  } catch (error: any) {
    console.error('Failed to delete DID:', error);
    if (error.code === 'P2025') {
      return reply.status(404).send({ error: 'DID not found' });
    }
    reply.status(500).send({ error: 'Failed to delete DID' });
  }
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.error(`Received ${signal}. Shutting down gracefully...`);
  await fastify.close();
  await prisma.$disconnect();
  freeSwitch.disconnect();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server
const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    try {
      await freeSwitch.connect();
      console.log('✅ Connected to FreeSWITCH ESL');
    } catch (error) {
      console.error('⚠️ Unable to connect to FreeSWITCH ESL during startup:', error);
    }

    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log(`✅ Backend server listening on http://0.0.0.0:3001`);
  } catch (err) {
    console.error('❌ Failed to start:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();


import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import FreeSwitchService from './services/freeswitch.service';
import { Did } from '../../types';

// Initialize
const fastify = Fastify({ logger: false }); // Logger is disabled to prevent stdout pollution
const prisma = new PrismaClient();
const freeSwitchService = new FreeSwitchService();

// Register plugins
fastify.register(cors, {
  origin: '*', // Allow all origins for simplicity in this development environment
});

// --- API Routes ---

// GET /api/dids - Fetch all DIDs
fastify.get('/api/dids', async (request, reply) => {
  try {
    const dids = await prisma.did.findMany({
      orderBy: { createdAt: 'desc' },
    });
    reply.send(dids);
  } catch (error) {
    console.error('Failed to fetch DIDs:', error);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

// POST /api/dids - Create a new DID
fastify.post<{ Body: { phoneNumber: string; country: Did['country'] } }>('/api/dids', async (request, reply) => {
  try {
    const { phoneNumber, country } = request.body;
    if (!phoneNumber || !country) {
      return reply.status(400).send({ error: 'Phone number and country are required' });
    }
    const newDid = await prisma.did.create({
      data: {
        phoneNumber,
        country,
        accountId: 'acc_default', // Hardcoded for now
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

// POST /api/calls/originate - Originate a new call
fastify.post<{ Body: { phoneNumber: string } }>('/api/calls/originate', async (request, reply) => {
    try {
        const { phoneNumber } = request.body;
        if (!phoneNumber) {
            return reply.status(400).send({ error: 'Phone number is required' });
        }
        // The destination for this test will be the same number, prefixed for international format
        // This simulates calling a number on the PSTN.
        const destination = `+${phoneNumber.replace(/\D/g, '')}`; 
        const callId = await freeSwitchService.originateCall(phoneNumber, destination);
        reply.send({ message: 'Call initiated!', callId });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error initiating call:', errorMessage);
        reply.status(500).send({ error: `Failed to initiate call: ${errorMessage}` });
    }
});


// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.error(`Received ${signal}. Shutting down gracefully...`);
  await fastify.close();
  await prisma.$disconnect();
  freeSwitchService.disconnect();
  // FIX: Bypass incorrect global 'Process' type which lacks the 'exit' property.
  // @ts-ignore
  process.exit(0);
};

// FIX: Bypass incorrect global 'Process' type which lacks the 'on' property.
// @ts-ignore
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// @ts-ignore
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));


// Start server
const start = async () => {
  try {
    await freeSwitchService.connect();
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.error(`Backend server listening on http://0.0.0.0:3001`);
  } catch (err) {
    console.error(err);
    // FIX: Bypass incorrect global 'Process' type which lacks the 'exit' property.
    // @ts-ignore
    process.exit(1);
  }
};

start();
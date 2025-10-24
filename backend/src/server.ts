import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { FreeSwitchService } from './services/freeswitch.service';

const app = express();
const prisma = new PrismaClient();
const freeSwitchService = new FreeSwitchService();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- DIDs API ---

// GET /api/dids - Fetch all DIDs
app.get('/api/dids', async (req, res) => {
  try {
    const dids = await prisma.did.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(dids);
  } catch (error) {
    console.error('Error fetching DIDs:', error);
    res.status(500).json({ error: 'Failed to fetch DIDs' });
  }
});

// POST /api/dids - Add a new DID
app.post('/api/dids', async (req, res) => {
  try {
    const { phoneNumber, country } = req.body;
    if (!phoneNumber || !country) {
      return res.status(400).json({ error: 'Phone number and country are required' });
    }

    // Basic validation for E.164 format
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format. Expected E.164 format.' });
    }

    const newDid = await prisma.did.create({
      data: {
        phoneNumber,
        country,
        // Set sensible defaults for a newly provisioned number
        status: 'PROVISIONING',
        routeType: 'AGENT', // Default route
        routeTarget: 'unassigned_agent',
        accountId: 'acc_default', // Assuming a single-tenant or default account
      },
    });
    res.status(201).json(newDid);
  } catch (error) {
    console.error('Error adding DID:', error);
    // Handle potential unique constraint violation
    if ((error as any).code === 'P2002') {
        return res.status(409).json({ error: 'This phone number is already registered.'});
    }
    res.status(500).json({ error: 'Failed to add DID' });
  }
});

// --- Calls API ---

// POST /api/calls/originate - Originate a call from a DID
app.post('/api/calls/originate', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        
        // Use the FreeSwitch service to place the call
        const callResult = await freeSwitchService.originateCall(phoneNumber);

        if (callResult.success) {
            res.status(200).json({ message: 'Call initiated successfully', callId: callResult.callId });
        } else {
            res.status(500).json({ error: 'Failed to initiate call', details: callResult.error });
        }
    } catch (error) {
        console.error('Error originating call:', error);
        res.status(500).json({ error: 'An unexpected error occurred while initiating the call' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

#!/bin/bash
# Load environment from .env.local and start backend
cd backend
export $(cat ../.env.local | grep -v '#' | xargs)
npm run dev

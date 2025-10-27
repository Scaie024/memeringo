#!/bin/bash
# Load environment variables from .env.local
export $(cat .env.local | grep -v '#' | xargs)

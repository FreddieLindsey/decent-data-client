#!/bin/bash

SCRIPT_DIR="$(pwd -P)/$(dirname $0)"

echo "Making cache available"
mkdir -p .cache/ipfs
chmod -R a+rwx .cache/ipfs
echo "Cache available"

echo "Starting Docker..."
docker-compose up -d
echo "Docker initialised..."

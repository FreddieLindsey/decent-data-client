#!/bin/bash

if [ -d "$HOME/.ipfs" ]; then
  mv "$HOME/.ipfs" "$HOME/.ipfs.$(date +%Y-%m-%d:%H:%M:%S)"
fi

(
  ipfs init
  ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
  ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
  ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
  ipfs daemon
)

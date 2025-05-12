#!/bin/bash

# Prep (Download jq)
cd ./cloudcitransfer
wget -O jq https://github.com/stedolan/jq/releases/download/jq-1.7/jq-linux64
chmod +x ./jq
ls -lisa
PATH=$PATH:$(pwd)

# Tenant Upgrade
./tenant_update_registry.sh
exit_code_upgrade=$?

# Integration Test
./cicd_integration_test.sh
exit_code_test=$?

# Test Result
if [[ $exit_code_upgrade != 0 || $exit_code_test != 0 ]]; then
  exit 1
fi

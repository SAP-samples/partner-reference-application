#!/bin/bash

echo "Integration test (action + read using service broker)"
echo " Parameter lengths:" UAA URL: ${#service_broker_auth_server}, ClientId: ${#service_broker_client_id}, ClientSecret ${#service_broker_client_secret}, SaaS URL: ${#service_broker_endpoint}

# Step 1: Get access token
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo " Fetch OAuth token"
token_response=$(curl $service_broker_auth_server'/oauth/token?grant_type=client_credentials&response_type=token' -u "$service_broker_client_id:$service_broker_client_secret" --silent)
access_token=$(echo $token_response | jq -r ".access_token")
echo "  Token length:" ${#access_token}

# Step 2: Generate test data
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo " Action: create test data"
action_response=$(curl -X POST $service_broker_endpoint/odata/v4/poetryslamservice/createTestData -H "Authorization: Bearer $access_token" --silent)
#echo $action_response | jq

# Step 3: Read and check test data
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo " Read: poetry slam 1"
read_response=$(curl $service_broker_endpoint'/odata/v4/poetryslamservice/PoetrySlams?$filter=number%20eq%20'"'1'"'&$select=number,ID' -H "Authorization: Bearer $access_token" --silent)
#echo $read_response | jq
read_id=$(echo $read_response | jq -r ".value[0].ID")

# Check the expected id
if [[ $(echo $read_id) != "79ceab87-300d-4b66-8cc3-f82c679b77a1" ]]; then
  echo " Unexpected read result: $read_id"
  exit 1
fi

echo " Test data checked successfully"
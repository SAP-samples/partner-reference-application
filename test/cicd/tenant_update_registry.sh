#!/bin/bash

# See https://saas-manager.cfapps.eu10.hana.ondemand.com/api#/
#   esp. https://saas-manager.cfapps.eu10.hana.ondemand.com/api#/a_ApplicationController%20API/batchUpdateApplicationAndTenantSubscriptionAsync
#   and  https://saas-manager.cfapps.eu10.hana.ondemand.com/api#/n_Job%20Management/getJobRelatedToSaasApplicationById
# ================================================================================================================================================

# Step 1: Set required credentials
#  Taken from poetry-slams-registry-key (key for SaaS Provisioning Service)
# ------------------------------------------------------------------------------------------------------------------------------------------------
clientid=$registry_clientid
clientsecret=$registry_clientsecret
url=$registry_uaa_url
saas_registry_url=$registry_saasreg_url

echo Updating Subscriptions
echo " Parameter lengths:" UAA URL: ${#url}, ClientId: ${#clientid}, ClientSecret ${#clientsecret}, SaaS URL: ${#saas_registry_url}

# Step 2: Get access token
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo Retrieving token
command=$(echo curl "'"$url"/oauth/token?grant_type=client_credentials&response_type=token""'" -u "'"$clientid:$clientsecret"'" --silent)
resp_token=$(eval "$command") 
token=$(echo $resp_token | jq -r ".access_token")
#token=$(echo $resp_token | grep -o '"access_token": *"[^"]*"' | sed 's/"access_token": *"\([^"]*\)"/\1/')
echo " Token length:" ${#token}

# Step 3: Trigger update
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo Triggering update
command=$(echo curl --request PATCH \"$saas_registry_url"/saas-manager/v1/application/subscriptions/batch"\" -H \"Authorization: Bearer $token\" -H \"Accept: application/json\" -H \"Content-Type: application/json\" -d "'"{\"tenantIds\":[\"*\"]}"'" -sS -D - -o /dev/null --silent)
resp_upgrade=$(eval "$command" | grep "location")
location=$(echo ${resp_upgrade:10:-1})
echo " Update job log location:" $location

# Step 4: Pull status of update job
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo Pulling Status of Update Job "("$saas_registry_url$location")"
command=$(echo curl \"$saas_registry_url$location\" -H \"Authorization: Bearer $token\" --silent)

count10s=0
while true; do

  resp_status=$(eval "$command")
  state=$(echo $resp_status | jq -r ".state")
  #state=$(echo $resp_status | grep -o '"state": *"[^"]*",' | sed 's/"state": *"\([^"]*\)",/\1/')
  echo " State ("$count10s"0s)": $state

  echo $resp_status | jq -r '.stateDetails.batchOperationDetails.subscriptionUpdates | .[] | "   \(.tenantId) \(.state)"'
  #tenant_list=$(echo $resp_status | grep -o '"tenantId": *"[^"]*"' | sed 's/"tenantId": *"\([^"]*\)"/\1/')
  #for tenant in $tenant_list; do
  #  prefix='"tenantId":"'$tenant'","state":'
  #  command_grep=$(echo grep -o "'"$prefix'"[^"]*"'"'")
  #  command_sed=$(echo sed "'s/"$prefix'"\([^"]*\)"/\1/'"'")
  #  tenant_state=$(echo $resp_status | eval $command_grep | eval $command_sed)
  #  echo "  $tenant $tenant_state"
  #done

  if [[ $state == "SUCCEEDED" ]]; then
    echo Upgrade job succeeded
    exit 0
  fi

  if [[ $state == "FAILED" ]]; then
    echo Upgrade job failed
    exit 1
  fi

  if [[ $count10s == 25 ]]; then
    echo Upgrade job not finished within time limit
    exit 1
  fi

  count10s=$((count10s+1))
  sleep 10
done
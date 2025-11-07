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
resp_token=$(curl "$url/oauth/token?grant_type=client_credentials&response_type=token" -u "$clientid:$clientsecret" --silent)
token=$(echo $resp_token | jq -r ".access_token")
echo " Token length:" ${#token}

# Step 3: Get Tenant IDs
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo Retrieving Tenant IDs
response=$(curl "$saas_registry_url/saas-manager/v1/application/subscriptions" -H "Authorization: Bearer $token" -H "Accept: application/json" --silent)
tenant_ids=$(echo $response | jq -r '.subscriptions[].consumerTenantId')

# Step 4: Update Tenant Subscriptions
# ------------------------------------------------------------------------------------------------------------------------------------------------
echo Updating Tenant Subscriptions

update_not_successful_in_time=()
for tenant in $tenant_ids; do
    echo " Update Tenant: $tenant"
    update_response=$(curl -i --silent -X PATCH "$saas_registry_url/saas-manager/v1/application/tenants/$tenant/subscriptions" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json")
    job_location=$(echo "$update_response" | grep 'location: ' | awk '{print $2}' | tr -d '\r\n')

    # Try for 60 seconds to get a successful job status
    counter=0
    while : ; do
    job_response=$(curl "$saas_registry_url$job_location" -H "Authorization: Bearer $token" -H "Accept: application/json" --silent)
    job_status=$(echo $job_response | jq -r ".state")

    echo "  Job Status: $job_status"

    if [ "$job_status" == "SUCCEEDED" ]; then
        echo "  Tenant $tenant update succeeded."
        break
    else
        if [ "$job_status" == "FAILED" ]; then
            echo "  Tenant $tenant update failed."
            update_not_successful_in_time+=("$tenant")
            break
        fi
        if [ $counter -eq 5 ]; then
            echo "  Tenant $tenant update did not succeed within expected time."
            echo "  Last Job Response: $job_response"
            update_not_successful_in_time+=("$tenant")
            break
        fi
        sleep 10
        ((counter++))
        echo "  Fetch Job Status - Retry: $counter/5"
    fi
    done
done

if [ ${#update_not_successful_in_time[@]} -ne 0 ]; then
    echo "The following tenants did not complete the update in time: ${update_not_successful_in_time[*]}"
    exit 1
else
    echo "All tenant updates completed successfully."
    exit 0
fi

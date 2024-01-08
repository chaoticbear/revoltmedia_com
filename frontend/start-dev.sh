#!/bin/bash

set -m

# Check response code from endpoint
echo "${NEXT_PUBLIC_WORDPRESS_URL}"/index.php?graphql

function check_endpoint {    
    if [[ $(curl -s --write-out '%{http_code}\n' -X POST -H 'content-type: application/json' --data '{ "query": "{ allSettings { generalSettingsTitle } }" }' --output /dev/null "${NEXT_PUBLIC_WORDPRESS_URL}"/index.php?graphql
) = '200' ]]; 
    then
    
        yarn predev
        yarn dev

    fi
}

# Wait for up to 15 seconds for the service to be ready.
for attempt in $(seq 1 15); do
    sleep 1

    check_endpoint

    if [[ attempt -eq 15 ]]; then
        echo "Error accessing endpoint."
        exit
    fi
done

yarn predev;
yarn dev;
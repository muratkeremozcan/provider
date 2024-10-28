#!/bin/bash

# Note:
# Ensure that your target provider GitHub repository has a .yml workflow file in .github/workflows/ 
# configured to respond to repository_dispatch events with an event type like "contract_requiring_verification_published".
# Example: https://github.com/muratkeremozcan/pact-js-example-provider/blob/main/.github/workflows/webhook.yml

# Set the Pact Broker and GitHub tokens and URLs as environment variables
PACT_BROKER_BASE_URL="Your_PactFlow_Org_URL"
PACT_BROKER_TOKEN="Your_Pact_Token"
GITHUB_AUTH_TOKEN="Your_GitHub_Personal_Access_Token"

# Set customizable parameters
DESCRIPTION="Webhook for MoviesAPI provider"                # Description for the webhook
CONSUMER_NAME="WebConsumer"                                 # Consumer name in Pact
PROVIDER_NAME="MoviesAPI"                                   # Provider name in Pact
GITHUB_REPO_OWNER="muratkeremozcan"                         # GitHub username or org
GITHUB_REPO_NAME="provider"                                 # GitHub repository name

# GitHub dispatch endpoint for the repository and workflow file
REPO_DISPATCHES="https://api.github.com/repos/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME/dispatches"

# Run the pact-broker command
pact-broker create-webhook "$REPO_DISPATCHES" \
    --request=POST \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/vnd.github.everest-preview+json' \
    --header "Authorization: Bearer $GITHUB_AUTH_TOKEN" \
    --data '{
        "event_type": "contract_requiring_verification_published",
        "client_payload": {
            "pact_url": "${pactbroker.pactUrl}",
            "sha": "${pactbroker.providerVersionNumber}",
            "branch": "${pactbroker.providerVersionBranch}",
            "message": "Verify changed pact for ${pactbroker.consumerName} version ${pactbroker.consumerVersionNumber} branch ${pactbroker.consumerVersionBranch} by ${pactbroker.providerVersionNumber} (${pactbroker.providerVersionDescriptions})"
        }
    }' \
    --broker-base-url="$PACT_BROKER_BASE_URL" \
    --broker-token="$PACT_BROKER_TOKEN" \
    --consumer="$CONSUMER_NAME" \
    --provider="$PROVIDER_NAME" \
    --description="$DESCRIPTION" \
    --contract-requiring-verification-published

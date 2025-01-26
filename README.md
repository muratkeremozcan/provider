# Provider

[![API Documentation](https://img.shields.io/badge/API-DOCUMENTATION-blue?style=flat-square)](https://muratkeremozcan.github.io/provider/api-docs.html)

## Setup

```bash
npm i
```

Use the sample `.env.example` file to create a `.env` file of your own. These values will also have to exist in your CI secrets.

```bash
PORT=3001
```

### Scripts

```bash
npm run lint
npm run typecheck
npm run fix:format
npm run validate # all the above in parallel

npm run test # unit tests
npm run test:watch # watch mode

npm run mock:server # starts the mock backend/provider server

npm run cy:open-local # open mode
npm run cy:run-local  # run mode
npm run cy:run-local-fast  # no video or screen shots

# PW scripts
npm run pw:open-local       # open mode (local config)
npm run pw:open-local-debug # open with debug (local config)

npm run pw:run-local        # run mode (local config)
npm run pw:run-local-debug  # run with debug (local config)

npm run pw:trace            # inspect a trace.zip file
npm run pw:clear            # remove all temporary PW files
```

<!-- yo -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Git2Gus is a GitHub App that syncs GitHub issues and pull requests with Salesforce's Agile Accelerator (GUS - Global User Services). It's built with Sails.js (Node.js MVC framework) and processes GitHub webhook events to create and update work items in Salesforce.

## Development Commands

### Running the Application
- `yarn` - Install dependencies
- `yarn dev` - Start development server (NODE_ENV=development, port 1337)
- `yarn start` - Start production server (NODE_ENV=production)

### Testing and Quality
- `yarn test` - Run Jest tests with verbose output
- `yarn lint` - Run ESLint with zero warnings allowed
- `yarn prettier` - Check code formatting
- `yarn prettier:fix` - Auto-fix formatting issues
- `yarn typecheck` - Run TypeScript type checking

### Local Development with Webhooks
```bash
# In separate terminal - forward GitHub webhooks to localhost:1337
smee -u <your smee address> --path /webhook --port 1337
```

### Running Tests in VS Code
- Use "Run Tests" debug configuration in `.vscode/launch.json`
- Runs individual test files via Jest

### Local Database
Development uses sails-disk (JSON files in `.tmp/localDiskDb/`). To seed the dev database, add build entries to `.tmp/localDiskDb/adm_build__c.db` matching your `.git2gus/config.json` configuration.

## Architecture

### Request Flow
1. GitHub sends webhook event → POST /webhook endpoint
2. GithubController receives request, validates via policies
3. Event emitted via GithubEvents module (config/ghEvents.js)
4. Appropriate action(s) triggered based on event type
5. Actions enqueue work via hooks (issues-hook, changelists-hook, labels-hook)
6. Hooks process queue asynchronously using async/queue
7. Services interact with GitHub API and Salesforce/GUS

### Directory Structure

**api/actions/** - Business logic handlers triggered by GitHub webhook events. Each action exports `eventName` and `fn`. Examples:
- createWorkItem.js - Creates GUS work items from GitHub issues
- createChangelist.js - Creates changelists from PRs
- linkToWorkItem.js - Links GitHub issues to existing GUS work items

**api/services/** - Organized by domain:
- `Github/` - GitHub API interactions (getConfig, createComment, addLabels, etc.)
- `Gus/` - Salesforce operations (createWorkItemInGus, closeWorkItem, getById, etc.)
- `Git2Gus/` - Application logic (deleteLinkedComment, isWorkItemClosed, etc.)
- `Issues/`, `Builds/`, `Changelists/` - Domain-specific services
- `Logs/` - Logging configuration

**api/hooks/** - Custom Sails hooks with async queues:
- `issues-hook/` - Processes work item operations (CREATE_WORK_ITEM, UPDATE_WORK_ITEM_PRIORITY, LINK_TO_WORK_ITEM, etc.)
- `changelists-hook/` - Handles changelist creation
- `labels-hook/` - Manages label synchronization

**api/policies/** - Request validation middleware:
- isGithubReq.js - Validates GitHub webhook signature
- isFromApprovedOrg.js - Checks organization is approved
- hasConfig.js - Verifies repo has `.git2gus/config.json`
- isGithubAuth.js - Validates GitHub authentication

**api/models/** - Sails/Waterline data models:
- Issues.js - GitHub issue to GUS work item mappings
- Changelists.js - PR to changelist mappings  
- Builds.js - GUS build/sprint information

**config/** - Configuration files:
- `ghEvents.js` - Maps GitHub events to action handlers
- `github.js` - GitHub App settings (appId, webhook secret, approved orgs)
- `salesforce.js` - Salesforce/GUS configuration (record type IDs, user ID)
- `env/development.js` - Development-specific routes and settings
- `routes.js` - Main route definitions

### Key Concepts

**Event-Driven Architecture**: The GithubEvents module (api/modules/GithubEvents.js) acts as an event emitter. Actions register handlers for specific GitHub webhook events (issues.opened, pull_request.closed, etc.).

**Queue-Based Processing**: Hooks use async queues to serialize and process work items, preventing race conditions when multiple webhook events arrive simultaneously.

**GitHub App Authentication**: Uses @octokit/auth-app with private key (PRIVATE_KEY env var or private-key.pem file). For SSO-enabled orgs, can use personal access token (PERSONAL_ACCESS_TOKEN).

**Salesforce Integration**: 
- Production uses Heroku Connect to sync Postgres database with Salesforce
- Tables: ADM_Work__c (work items), ADM_Build__c (builds), ADM_Change_List__c (changelists)
- Authentication via GUS_USER, GUS_USERNAME, GUS_PASSWORD environment variables

**Repository Configuration**: Each repo must have `.git2gus/config.json` with:
- `productTag` - Salesforce product tag ID
- `defaultBuild` - Default build/sprint name
- `hideWorkItemUrl` - Whether to hide work item URL in comments
- `statusWhenClosed` - Status to set when issue is closed (e.g., "FIXED")

## Environment Setup

### Required Environment Variables
See README.md "Contributing" section for complete list. Key variables:
- `GITHUB_APP_ID`, `GITHUB_WEBHOOK_SECRET` - GitHub App credentials
- `GITHUB_APPROVED_ORGS` - Comma-separated list of allowed organizations
- `GITHUB_TEST_ORG` - Test organization for development
- `USER_STORY_RECORD_TYPE_ID`, `BUG_RECORD_TYPE_ID`, `INVESTIGATION_RECORD_TYPE_ID` - Salesforce record type IDs
- `GUS_USER`, `GUS_USERNAME`, `GUS_PASSWORD` - Salesforce credentials
- `WORK_ITEM_BASE_URL` - Salesforce Lightning URL base
- `SALESFORCE_PREFIX` - Database schema prefix (e.g., "salesforce.")
- `NAMESPACE_PREFIX` - Agile Accelerator namespace (typically "agf")

### GitHub App Permissions
- Read & Write: Issues, Pull Requests, Commit Statuses
- Read: Single file at path `.git2gus/config.json`
- Webhook events: Issue comment, Issues, Label

## Common Patterns

### Adding a New GitHub Event Handler
1. Create action in `api/actions/` exporting `eventName` and `fn`
2. Action automatically registered in `config/ghEvents.js` 
3. Use services from `api/services/` for GitHub/Salesforce operations
4. For async work, enqueue task in appropriate hook

### Working with GUS Work Items
- Use `Gus.getByRelatedUrl()` to find existing work item by GitHub URL
- Record types determined by GitHub labels (BUG, INVESTIGATION) or default to USER STORY
- Priority extracted from P0-P4 labels via `Github.getPriority()`

### Testing
Tests are co-located with source files in `__test__` directories. Example:
- `api/actions/__test__/createWorkItem.spec.js`
- `api/policies/__test__/isGithubReq.spec.js`

Mock external dependencies (GitHub API, Salesforce) in tests.

## Debugging

Use VS Code "Debug Node" launch configuration to debug the application. Breakpoints work in actions, services, and hooks.

For webhook debugging, check:
1. smee is running and forwarding to correct port
2. GitHub App is installed on test repository  
3. `.git2gus/config.json` exists in test repo
4. Build specified in config exists in local database (for dev)
5. Check logs for policy failures (isFromApprovedOrg, hasConfig)

## Production Deployment

Deployed to Heroku with:
- Postgres add-on (database)
- Heroku Connect add-on (syncs Postgres ↔ Salesforce)
- Optional: LogDNA add-on for logging (set LOGDNA_INGESTION_KEY)

Heroku Connect mapping defined in `heroku/herokuconnect.json`.

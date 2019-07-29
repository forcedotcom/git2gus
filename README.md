# Git2Gus Application

a Github application to keep in sync issues with GUS work items.

[![CircleCI](https://circleci.com/gh/salesforce/git2gus.svg?style=svg&circle-token=702c52c9b89dfb5a3df392245cea76d05c0905db)](https://circleci.com/gh/salesforce/git2gus)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Run Locally

First, make sure your dev environment is setup by reading the [contributing section](#contributing).

```bash
yarn
yarn dev
```

In another terminal launch [smee](https://smee.io) to forward your github test app web hook events to your local dev machine.

```bash
smee -u <your smee address here> --path /webhook --port 1337
```

Now go and create issues in a test repo that has your test github app installed. Your GH app will forward web hook events to smee which will forward to your local node process. Since we can't connect to real GUS the best we can do is inspect the local database changes. Under development the database is a set of json files under `<repo root>/.tmp/localDiskDb`.

## Contributing

An overall flow of the local development strategy:

```
+--------------------------+            +----------------------------+
|                          |            |                            |
|  Test Repo               |            |  Mock Github App           |
|                          |            |                            |
|                          |            |                            |
|  Create Issue            +----------->+  Detects issue created     |
|                          |            |                            |
|                          |            |                            |
|                          |            |                            |
+--------------------------+            +--------------+-------------+
                                                       |
                                           POSTs webhook via smee
                                                       |
                                                       v
+--------------------------+            +--------------+-------------+
|                          |            |                            |
|  local db file           |            |  Local git2gus node server |
|                          |            |                            |
|                          +<-----------+                            |
|  Manually verify         |            |  Creates GUS work entry    |
|  DB change               |            |  in local db file          |
|                          |            |                            |
+--------------------------+            +----------------------------+

```

git2gus a Github App, to contribute you'll need to follow Github's [guide to set up your developement environment](https://developer.github.com/apps/quickstart-guides/setting-up-your-development-environment/).

The high level steps include:

- Create SMEE hook forwarder
  ```bash
  smee -u <your smee address here> --path /webhook --port 1337
  ```
- Create a mock github app
- Create a test repo and install mock github app to that repo
- Download github app PEM file
- Create .env file with github variables
  - NOTE: Some variable names are slightly different than the github guide, see example below.
  - NOTE: it's easier to just copy your github app's PEM file to the repo root named `private-key.pem`. If you want to set an env variable instead of copying the .pem file then you must use the name `PRIVATE_KEY` (instead of `GITHUB_PRIVATE_KEY` as the github instructions say) and you have to manually insert `\n` line characters between each line.
- Add variables specific to your Salesforce instance
  - To use with GUS, Salesforce's internal instance, use the User Story Recort Type ID `0129000000006gDAAQ`, the Bug Record Type ID `012T00000004MUHIA2`, the Investigation Record Type ID `0129000000006lWAAQ`, and the Work Item Base URL `https://gus.lightning.force.com/lightning/r/ADM_Work__c/`
  - To develop outside of GUS, get your Record Type IDs from the Object Manager and copy the base URL from your Agile Accelerator, it should resemble the one included in the example.
- Add a link to your GitHub app (ex: the GitHub app for Salesforce's internal GUS instance is https://github.com/apps/git2gus)
  - This will show up on the app's homepage

You're .env should look something like:

```
GITHUB_APP_ID=28467
GITHUB_WEBHOOK_SECRET=qqqq1111
GITHUB_TEST_ORG=wes566
USER_STORY_RECORD_TYPE_ID=ABCDEFGHIJKLM
BUG_RECORD_TYPE_ID=NOPQRSTUVWXYZ
INVESTIGATION_RECORD_TYPE_ID=123456789012
WORK_ITEM_BASE_URL=https://myproject.lightning.force.com/lightning/r/ADM_Work__c/
GITHUB_APP_URL= https://github.com/apps/yourapplication

```

The GITHUB_TEST_ORG is the org where you have a repo with your test GH app installed to.

Make sure your test app has Read & Write access to Issues, Pull Requests, and Commit Statuses. Also make sure it has read access to "A single file" and the path should be `.git2gus/config.json`. You will also need to subscribe to events: Issue comment, Issues, and Label.

### Seeding your dev db

Sails has a built-in development db, called sails-disk, which is just a set of json files under `<repo root>/.tmp/localDiskDb`. The git2gus app will validate that the "build" you specified in the config is in the database so you'll need to make sure you've got an entry for that "build" in the `adm_build__c.db` file. For example, add a line like `{"name":"218","sfid":"218","_id":1}` to that file if your config is set to build "218".

### Using

To deploy to your Salesforce instance, deploy to a Heroku App with Postgres and Heroku Connect add-ons. Run smee with the URL of your GitHub app. The Postgres database will act as the app's database, and can then set up Heroku Connect between the Postgres database and your Salesforce instance.

To use, install your GitHub app on desired repositories. Your app's homepage will have set up and usage instructions for the actual syncing process between your GitHub repositories and your Salesforce instance.

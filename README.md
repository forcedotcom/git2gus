# Git2Gus Application

A GitHub application to keep issues in sync with Salesforce's Agile Accelerator.

This is an experimental project that is not yet supported, so while we appreciate feedback and welcome new issues, we can't guarantee response times and aren't ready to accept contributions. Thank you for understanding!

[![CircleCI](https://circleci.com/gh/forcedotcom/git2gus.svg?style=svg&circle-token=702c52c9b89dfb5a3df392245cea76d05c0905db)](https://circleci.com/gh/forcedotcom/git2gus)

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

Steps to set up development:

1. Create SMEE hook forwarder

```bash
smee -u <your smee address here> --path /webhook --port 1337
```

2. Create a mock github app

   - The app needs Read & Write access to Issues, Pull Requests, and Commit Statuses. It also needs read access to "A single file" with the path `.git2gus/config.json`. You will also need to subscribe to events: Issue comment, Issues, and Label.

3. Create a test repo and install mock github app to that repo

4. Download github app PEM file, rename to `private-key.pem`, and place it in the project's root folder

   - If you want to set an env variable instead of copying the .pem file then you must use the name `PRIVATE_KEY` (instead of `GITHUB_PRIVATE_KEY` as the github instructions say) and you have to manually insert `\n` line characters between each line.

5. Create .env file with github variables

   - NOTE: Some variable names are slightly different than the github guide, see example below.
   - You will need to specify a test organization/user to develop with as well as approved organizaitons your app will work with, see example below.

6. Add variables specific to your Salesforce instance

   - Get your Record Type IDs from the Object Manager and copy the base URL from your Agile Accelerator, it should resemble the one included in the example.

   - When you later set up Heroku Connect, your database table and fields related to Agile Accelerator may be in a specific Postgres schema, which you will set as the `SALESFORCE_PREFIX`. If you use the defaults in Heroku Connect, this will be `salesforce.`

7. Add a link to your GitHub app (ex: the GitHub app for Salesforce's instance is https://github.com/apps/git2gus)

    - This will show up on the app's homepage

- For SSO-enabled organizations, you must authenticate with a personal access token with full repo access. Using a personal access token is not required for non-SSO-enabled orgs. To use, in `.env`, set `PERSONAL_ACCESS_TOKEN` to your personal access token and `TOKEN_ORGS` to a comma-seperated list of organizations to use your personal access token with.

You're .env should look something like:

```
GITHUB_APP_ID=28467
GITHUB_WEBHOOK_SECRET=qqqq1111
GITHUB_APPROVED_ORGS=salesforce,sfdc,forcedotcom,salesforce-ux,SalesforceLabs,SalesforceFoundation
GITHUB_TEST_ORG=wes566
USER_STORY_RECORD_TYPE_ID=ABCDEFGHIJKLM
BUG_RECORD_TYPE_ID=NOPQRSTUVWXYZ
INVESTIGATION_RECORD_TYPE_ID=123456789012
WORK_ITEM_BASE_URL=https://myproject.lightning.force.com/lightning/r/ADM_Work__c/
GITHUB_APP_URL= https://github.com/apps/yourapplication
SALESFORCE_PREFIX=salesforce.
NAMESPACE_PREFIX=agf
```

For use with SSO-enabled organizations, you would also have additional lines:

```
PERSONAL_ACCESS_TOKEN=abcdefghijklmnopqrstuvwxyz
TOKEN_ORGS=asdf
```

The GITHUB_TEST_ORG is the org where you have a repo with your test GH app installed to.

Set the user credentials for your Salesforce org with these environment variables. Other forms of authentication with Salesforce are not yet supported.

```
GUS_USER=005xxxxxxxxxxxxAAA
GUS_USERNAME=username@example.com
GUS_PASSWORD=example_password
```

Make sure your test app has Read & Write access to Issues, Pull Requests, and Commit Statuses. Also make sure it has read access to "A single file" and the path should be `.git2gus/config.json`. You will also need to subscribe to events: Issue comment, Issues, and Label.

### Seeding your dev db

Sails has a built-in development db, called sails-disk, which is just a set of json files under `<repo root>/.tmp/localDiskDb`. The git2gus app will validate that the "build" you specified in the config is in the database so you'll need to make sure you've got an entry for that "build" in the `adm_build__c.db` file. For example, add a line like `{"name":"218","sfid":"218","_id":1}` to that file if your config is set to build "218".

## Using

To use git2gus, you will need to set it up locally as described in the Contributing section and deploy it to a Heroku App with Postgres and Heroku Connect add-ons. The Postgres database will act as the app's database, and can then set up Heroku Connect between the Postgres database and your Salesforce instance.

To set your environment variables on Heroku, go to your apps settings tab and modify your config vars to reflect your `.env` file. Instead of uploading your `private-key.pem`, file, you can just copy its contents to a `PRIVATE_KEY` config var on your Heroku app's settings page.

To use, install your GitHub app on desired repositories. Your app's homepage will have set up and usage instructions for the actual syncing process between your GitHub repositories and your Salesforce instance.

### Heroku Setup

To set up on your own Lightning Experience, host this app on Heroku and change the webhook URL of your GitHub app to point to [YOUR HEROKU APP URL]/webhook instead of smee.

To set up Heroku Connect, you may view the steps [here](https://devcenter.heroku.com/articles/getting-started-with-heroku-and-connect-without-local-dev). 

In Heroku Connect, you will sync the `ADM_Build_c`, `ADM_Change_List__c` and `ADM_Work__c` tables. The fields are defined in [herokuconnect.json](./heroku/herokuconnect.json). You can deploy that mapping with the [Heroku Connect CLI plugin](https://devcenter.heroku.com/articles/quick-start-heroku-connect-cli#import-mapping-configuration), but you'll have to change the connection settings before deploying.

As a reminder, if you see a prefix before the field name, set the `SALESFORCE_PREFIX` environment variable to that prefix.

It is recommended that you create a testing team. As a reminder, to create product tags, visit the app launcher and search "product tags". From here, you can create a product tag for your team, create assignment rules for bugs, user stories, and investigations, and then copy the product tag (you can generate a work URL for any assignment and copy the tag from the URL).

For a better logging experience, you may use the [LogDNA](https://elements.heroku.com/addons/logdna) add-on on Heroku. In your Heroku config vars, add your LogDNA API key as `LOGDNA_INGESTION_KEY`.

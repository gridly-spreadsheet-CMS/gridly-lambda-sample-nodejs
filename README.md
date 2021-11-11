# gridly-lambda-sample-nodejs

Gridly is the #1 spreadsheet for multi-language content that helps manage your game’s or app's data as a single source of truth and roll out continuous updates with full localization support & version control.

See more details about [Gridly](https://www.gridly.com/).

This is a sample project in NodeJS, showing how to implement a Lambda function used for Trigger functionality in Gridly.

## Prerequisities

* `npm`
* This sample uses [Google Cloud API](https://cloud.google.com/apis) for the text translation, so check this [Creating a service account](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) for how to create your own Google service account JSON file.

## How to build project into a Zip package

In the project directory, do:

1. `npm install` to install library packages
2. Edit `.env` file to replace your Gridly API key and your Google service account key file path.
3. Select all files and compress them into a zip file
    * Make sure the hidden file `.env` is shown by `Command + Shift + .`
    * Select all files by `Cammand + A`
    * Right click + `Compress...`

## How to upload built Zip package to Gridly Trigger

Below illustration shows how to use this sample in Gridly Trigger to traslate text into a sound file:

<img src="https://www.gridly.com/upload-data/how_to_add_trigger.png" width="300" />

<img src="https://www.gridly.com/upload-data/how_to_add_lambda_function.png" width="300" />



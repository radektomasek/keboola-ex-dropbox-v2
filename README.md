# Dropbox extractor for Keboola Connect (API v2)

Implementation focused on CSV extraction from Dropbox (https://www.dropbox.com/developers/core/docs#metadata). Written in Node.js.

## Required params

* CSV files from Dropbox (files) - an array of CSV files selected in Keboola Connection GUI.
* KBC Bucket (bucket) - an input bucket from KBC.

## Implementation details

The main purpose of this extractor is to provide a very convenient way how to extract data from Dropbox and upload them to Keboola Connection Storage.
It utilizes the [Chooser](https://www.dropbox.com/developers/chooser) component which provides a very easy-to-use way how to authorize and select files from your Dropbox.


Link itself is stored in encrypted form.


After files are selected, the configuration contains secured links which help to download the data.
Chooser component is set to only consider CSV files for the selection.

## Configuration

    {
      "parameters": {
        "config": {
          "dropboxFiles": [
            {
              "#link": "KBC::Encrypted==ENCODEDSTRING==",
              "name": "file1.csv",
              "bucket": "in.c-test",
              "output": "file1"
            },
            {
              "#link": "KBC::Encrypted==ENCODEDSTRING==",
              "name": "file2.csv",
              "bucket": "in.c-test",
              "output": "file2"
            }
          ]
        }
      }
    }

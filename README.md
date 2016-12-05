# Dropbox extractor for Keboola Connect (API v2)

Implementation focused on CSV extraction from Dropbox (https://www.dropbox.com/developers/core/docs#metadata). Written in Node.js.

## Required params

* OAuth 2 access token (credentials) - generated via OAuth handler in KBC.
* KBC Bucket (bucket) - an input bucket from KBC.
* CSV files from Dropbox (files) - an array of CSV files selected in Keboola Connection GUI.

## Implemented API endpoints

The main purpose of this extractor is to download CSV files from Dropbox.

* POST /search - Retrieves files based on defined param (query=csv). Output is handled automatically based on the file name and its manifest. If any file is stored in any Dropbox subdirectory then underscore is applied as the part of the name.

## Configuration

    {
      "parameters": {
        "config": {
          "files": ["/fileName1.csv", "/Subdirectory/fileName3.csv", "/fileName2.csv"],
          "bucket": "bucket name for storing the files",
          "credentials": "oauth secured token"
        }
      }
    }

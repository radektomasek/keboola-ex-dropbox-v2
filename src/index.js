var _ = require('lodash')
var Q = require('q')
var Dropbox = require('dropbox')
var path = require('path')

var DropboxHelper = require('./lib/dropboxHelper')

DropboxHelper.userAuthenticate()
  .then(DropboxHelper.listCsvFiles)
  .then(DropboxHelper.buildPromises)
  .then(DropboxHelper.processArrayOfPromises)
  .then(function(object) {
    console.log(object.length + ' file(s) uploaded successfully!')
    process.exit(0)
  })
  .catch(function(error){
    console.error(error)
    process.exit(1)
  })
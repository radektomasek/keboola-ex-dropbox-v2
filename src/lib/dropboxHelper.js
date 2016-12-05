var _ = require('lodash')
var Q = require('q')
var fs = require('fs')
var path = require('path')
var csv = require('fast-csv')
var Dropbox = require('dropbox')

var DropboxHelper = {}

var command = require('./commandHelper')
var dataDir = path.join(command.data)
var config = require('./configHelper')(dataDir)

var client = new Dropbox.Client({
  token: config.get('parameters:config:#credentials')
})

DropboxHelper.userAuthenticate = function() {
  var deferred = Q.defer()

  client.authenticate(function(error, user) {
    if (error) {
      deferred.reject(error)
    } else {
      deferred.resolve(user)
    }
  })

  return deferred.promise
}

DropboxHelper.listCsvFiles = function() {
  var deferred = Q.defer()
  var selectedFiles = config.get('parameters:config:dropboxFiles')
  var resultObject = []

  client.findByName('/', 'csv', {}, function(error, listOfCsvFiles){
    if (error) {
      deferred.reject(error)
    } else {
      _.forEach(listOfCsvFiles, function(dropboxCsvFile){
        _.forEach(selectedFiles, function(selectedFile) {
          if (selectedFile.file === dropboxCsvFile.path.toString()) {
            resultObject.push({ dropboxFileName: dropboxCsvFile.path, bucket: selectedFile.bucket, output: selectedFile.output })
          }
        })
      })

      deferred.resolve(resultObject)
    }
  })

  return deferred.promise
}

DropboxHelper.buildPromises = function(listOfFiles) {
  var promises = []

  _.forEach(listOfFiles, function(csvFile) {
    promises.push(
      (function(csv){
        return function() {
          var deferred = Q.defer()

          client.readFile(csv.dropboxFileName, function(error, data){
            if (error) {
              deferred.reject(error)
            } else {
              var csvFileName = csv.output.toString().split('.')
              var csvFile = path.join(dataDir, 'out', 'tables', csvFileName[csvFileName.length - 2] + '.' +csvFileName[csvFileName.length - 1] + '.csv')
              var csvManifest = csvFile + '.manifest'
              var manifestString = JSON.stringify({ destination: csv.output})

              fs.writeFile(csvFile, data, function(error) {
                if (error) {
                  deferred.reject(error)
                }

                fs.writeFile(csvManifest, manifestString, function(error) {
                  if (error) {
                    deferred.reject(error)
                  }

                  deferred.resolve({csv: csv})
                })
              })

            }
          })

          return deferred.promise
        }
      })(csvFile)
    )
  })

  return promises
}

DropboxHelper.processArrayOfPromises = function(arrayOfPromises) {
  var promises = arrayOfPromises
  var results = []

  results = promises.map(function(promise){
    return promise()
  })

  return Q.all(results)
}

module.exports = DropboxHelper
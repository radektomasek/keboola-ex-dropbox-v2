import fs from 'fs'
import path from 'path'
import request from 'request'
import jsonfile from 'jsonfile'
import promiseStreams from 'promise-streams'

/**
 * This function reads the array of the files and iterates over them.
 * During an iteration it passes the file link to the function which download it.
 */
export const downloadFiles = (dropboxObjects = [], downloadDir) => {
  return dropboxObjects.map(dropboxObject => {
    return downloadFile(dropboxObject, downloadDir)
  })
}

/**
 * This function makes the actual download of the passed file link.
 * The result is stored into downloadDir.
 */
const downloadFile = (dropboxObject, downloadDir) => {
  return promiseStreams.wait(
    request
      .get(dropboxObject['#link'].replace('dl=0', 'dl=1'))
      .pipe(fs.createWriteStream(path.join(downloadDir, `${dropboxObject.output}.csv`)))
  )
}

/**
 * This function write manifest for specified array of files.
 */
export const writeDataToManifests = (dropboxObjects, downloadDir) => {
  return dropboxObjects.map(dropboxObject => {
    return createManifestFile(`${path.join(downloadDir, `${dropboxObject.output}.csv`)}.manifest`, { incremental: false })
  })
}

/**
 * This function simply create a manifest file related to the output data.
 */
const createManifestFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(fileName, data, {}, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve('Manifest created!')
      }
    })
  })
}
import _ from 'lodash'
import path from 'path'
import nconf from 'nconf'
import isThere from 'is-there'

/**
 * This function reads the specified configuration file.
 * If no file is specified, the program terminates.
 */
export const getConfig = (configPath) => {
  const config = nconf.env()

  if (isThere(configPath)) {
    config.file(configPath)
    return config
  } else {
    console.error('No configuration specified!')
    process.exit(1)
  }
}

/**
 * This function checks the input configuration specified in KBC.
 * Checks whether the required fields are provided.
 * Prepares simple outpit that is going to be used in later phases.
 */
export const parseConfiguration = (configObject, dataDirectory) => {
  return new Promise((resolve, reject) => {
    const inputFiles = configObject.get('parameters:config:dropboxFiles')

    if (_.isUndefined(inputFiles) || _.isEmpty(inputFiles)) {
      reject('No Dropbox file selected!')
    }

    const extractDirectory = path.join(dataDirectory, 'out', 'tables')
    resolve({ inputFiles, extractDirectory })
  })
}
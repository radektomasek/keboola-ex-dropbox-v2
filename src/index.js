import path from 'path'
import command from './lib/helpers/cliHelper'
import * as constants from './lib/constants'
import * as keboolaHelper from './lib/helpers/keboolaHelper'
import * as downloadHelper from './lib/helpers/downloadHelper'

/**
 * This is the main part of the program.
 */
(async() => {
  try {
    // Read the input configuration.
    const dataDir = command.data
    const { inputFiles, extractDirectory } = await keboolaHelper
      .parseConfiguration(keboolaHelper.getConfig(path.join(dataDir, constants.CONFIG_FILE)), dataDir)

    // This is going to download all files from the Dropbox
    await Promise.all(downloadHelper.downloadFiles(inputFiles, extractDirectory))
    // This is going to create manifests.
    await Promise.all(downloadHelper.writeDataToManifests(inputFiles, extractDirectory))

    console.log(`Success: ${inputFiles.length} files from Dropbox extracted and uploaded into KBC storage!`)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
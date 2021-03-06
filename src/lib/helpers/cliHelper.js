import program from 'commander'
import * as constants from '../constants'

program
  .version('2.0.0')
  .option('-d, --data <path>', `set path to the config directory, defaults to ${constants.DEFAULT_DATA_DIR}`, constants.DEFAULT_DATA_DIR)
  .parse(process.argv)

export default program
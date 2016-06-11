import fetch from 'node-fetch'
import request from 'request'
import semver from 'semver'
import fs from 'fs'

const packageJson = require('./package');
const currentVersion = packageJson.version

function maybeUpdate(json) {
  if (semver.gt(json.tag_name, currentVersion)) {
    console.log("needs to update")

    packageJson.version = json.tag_name
    const executableUrl = json.assets.find((elem) => {
      return elem.browser_download_url.endsWith('tmc')
    }).browser_download_url

    request(executableUrl).pipe(fs.createWriteStream('bin/tmc'))

    console.log('New binary downloaded, updating to version ', json.tag_name)
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
  }
}

fetch('https://api.github.com/repos/tmc-cli/tmc-cli/releases/latest')
  .then((response) => {
    return response.json()
  })
  .then(maybeUpdate)



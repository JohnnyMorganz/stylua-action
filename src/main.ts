import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as tc from '@actions/tool-cache'
import stylua from './stylua'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const version = core.getInput('version')

    // See if we already have the tool installed
    core.debug(`Looking for cached version of binary with version ${version}`)
    const styluaDirectory = tc.find('stylua', version)
    if (styluaDirectory) {
      core.debug(`Found cached version of stylua: ${styluaDirectory}`)
      core.addPath(styluaDirectory)
    } else {
      core.debug('No cached version found, downloading new release')
      const releases = await stylua.getReleases(token)

      core.debug(
        `Retrieving matching release for user input: ${version ?? 'LATEST'}`
      )
      const release = stylua.chooseRelease(version, releases)

      if (!release) {
        throw new Error(`Could not find release for version ${version}`)
      }

      core.debug(`Chose release ${release.tag_name}`)
      const asset = stylua.chooseAsset(release)

      if (!asset) {
        throw new Error(
          `Could not find asset for ${release.tag_name} on platform ${process.platform}`
        )
      }

      core.debug(`Chose asset ${asset.browser_download_url}`)

      const downloadedPath = await tc.downloadTool(asset.browser_download_url)
      const extractedPath = await tc.extractZip(downloadedPath)
      await tc.cacheDir(extractedPath, 'stylua', release.tag_name)
      core.addPath(extractedPath)

      if (process.platform === 'darwin' || process.platform === 'linux') {
        await exec(`chmod +x ${extractedPath}/stylua`)
      }
    }

    const args = core.getInput('args')
    core.debug(`Running stylua with arguments: ${args}`)

    await exec(`stylua ${args}`)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()

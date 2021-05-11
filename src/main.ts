import * as core from '@actions/core'
import {exec} from '@actions/exec'
import {downloadTool, extractZip} from '@actions/tool-cache'
import stylua from './stylua'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const version = core.getInput('version')

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

    const downloadedPath = await downloadTool(asset.browser_download_url)
    const extractedPath = await extractZip(downloadedPath)
    core.addPath(extractedPath)

    const args = core.getInput('args')
    core.debug(`Running stylua with arguments: ${args}`)

    await exec(`stylua ${args}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

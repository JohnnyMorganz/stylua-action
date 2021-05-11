import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
import semver from 'semver'

interface GitHubAsset {
  name: string
  browser_download_url: string
}

interface GitHubRelease {
  tag_name: string
  assets: GitHubAsset[]
}

async function getReleases(token: string) {
  const octokit = getOctokit(token)
  const {data: releases} = await octokit.repos.listReleases({
    owner: 'JohnnyMorganz',
    repo: 'stylua'
  })

  // Sort by latest release first
  releases.sort((a, b) => -semver.compare(a.tag_name, b.tag_name))
  return releases
}

function chooseRelease(
  versionReq: string,
  releases: GitHubRelease[]
): GitHubRelease | null {
  for (const release of releases) {
    if (semver.satisfies(release.tag_name, versionReq)) {
      return release
    }
  }

  return null
}

function chooseAsset(release: GitHubRelease): GitHubAsset | null {
  let platformMatcher: (name: string) => boolean

  if (process.platform === 'win32') {
    platformMatcher = name =>
      name.includes('windows') ||
      name.includes('win64') ||
      name.includes('win32')
  } else if (process.platform === 'darwin') {
    platformMatcher = name => name.includes('macos')
  } else if (process.platform === 'linux') {
    platformMatcher = name => name.includes('linux')
  } else {
    throw new Error(`Unsupported platform "${process.platform}"`)
  }

  for (const asset of release.assets) {
    if (platformMatcher(asset.name)) {
      return asset
    }
  }

  return null
}

export default {
  getReleases,
  chooseRelease,
  chooseAsset
}

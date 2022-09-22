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

async function getReleases(token: string): Promise<GitHubRelease[]> {
  const octokit = getOctokit(token)
  const {data: releases} = await octokit.repos.listReleases({
    owner: 'JohnnyMorganz',
    repo: 'stylua'
  })

  // Sort by latest release first
  releases.sort((a, b) => semver.rcompare(a.tag_name, b.tag_name))
  return releases
}

function getLatestVersion(releases: GitHubRelease[]): string | null {
  return semver.clean(releases[0].tag_name)
}

function chooseRelease(
  version: string,
  releases: GitHubRelease[]
): GitHubRelease | undefined {
  return releases.find(release => semver.satisfies(release.tag_name, version))
}

export type Matcher = (name: string) => boolean

export const getAssetFilenamePatternForPlatform = (
  platform: NodeJS.Platform,
  machine: string
): RegExp => {
  let platformPattern

  switch (platform) {
    case 'win32':
      platformPattern = '(windows|win64)'
      break
    case 'linux':
      platformPattern = 'linux'
      break
    case 'darwin':
      platformPattern = 'macos'
      break
    default:
      throw new Error('platform not supported')
  }

  let archPattern
  switch (machine) {
    case 'arm64':
      archPattern = 'aarch64'
      break
    case 'x64':
      archPattern = 'x86_64'
      break
    default:
      archPattern = ''
  }

  return new RegExp(
    `stylua(-[\\dw\\-\\.]+)?-${platformPattern}(-${archPattern})?.zip`
  )
}

export const getFilenameMatcher = (
  platform: NodeJS.Platform,
  arch: string
): Matcher => {
  const pattern = getAssetFilenamePatternForPlatform(platform, arch)
  return name => pattern.test(name)
}

function chooseAsset(release: GitHubRelease): GitHubAsset | undefined {
  const matcher = getFilenameMatcher(process.platform, process.arch)
  return release.assets.find(asset => matcher(asset.name))
}

export default {
  getReleases,
  getLatestVersion,
  chooseRelease,
  chooseAsset
}

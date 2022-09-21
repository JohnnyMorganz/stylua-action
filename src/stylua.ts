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

const getPlatformMatcher = (platform: NodeJS.Platform): Matcher => {
  switch (platform) {
    case 'win32':
      return name => name.includes('win64') || name.includes('windows')
    case 'linux':
      return name => name.includes('linux')
    case 'darwin':
      return name => name.includes('macos')
    default:
      throw new Error('Platform not supported')
  }
}

const getArchMatcher = (arch: string): Matcher => {
  switch (arch) {
    case 'x64':
      return name => name.includes('x86_64')
    case 'arm64':
      return name => name.includes('aarch64')
    default:
      throw new Error('Arch not supported')
  }
}

export const getFilenameMatcher = (
  platform: NodeJS.Platform,
  arch: string
): Matcher => {
  const matchPlatform = getPlatformMatcher(platform)
  const matchArch = getArchMatcher(arch)
  return name => matchPlatform(name) && matchArch(name)
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

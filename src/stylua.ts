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

type Matcher = (name: string) => boolean

const getFilenameMatcher: () => Matcher = () => {
  switch (process.platform) {
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

function chooseAsset(release: GitHubRelease): GitHubAsset | undefined {
  const matcher = getFilenameMatcher()
  return release.assets.find(asset => matcher(asset.name))
}

export default {
  getReleases,
  getLatestVersion,
  chooseRelease,
  chooseAsset
}

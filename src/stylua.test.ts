import {getFilenameMatcher} from './stylua'

const ARTIFACT_NAMES = [
  'stylua-linux-aarch64.zip',
  'stylua-linux-x86_64.zip',
  'stylua-macos-aarch64.zip',
  'stylua-macos-x86_64.zip',
  'stylua-windows-x86_64.zip'
]

// Handle for releases < 0.15.0
const LEGACY_ARTIFACT_NAMES = [
  'stylua-linux.zip',
  'stylua-macos-aarch64.zip',
  'stylua-macos.zip',
  'stylua-win64.zip'
]

const selectArtifact = (
  artifacts: string[],
  platform: NodeJS.Platform,
  arch: string
): string | undefined => {
  const matcher = getFilenameMatcher(platform, arch)
  return artifacts.find(name => matcher(name))
}

test('matches windows x64 platform', () => {
  expect(selectArtifact(ARTIFACT_NAMES, 'win32', 'x64')).toBe(
    'stylua-windows-x86_64.zip'
  )
})

test('matches macos x64 platform', () => {
  expect(selectArtifact(ARTIFACT_NAMES, 'darwin', 'x64')).toBe(
    'stylua-macos-x86_64.zip'
  )
})

test('matches macos aarch64 platform', () => {
  expect(selectArtifact(ARTIFACT_NAMES, 'darwin', 'arm64')).toBe(
    'stylua-macos-aarch64.zip'
  )
})

test('matches linux x64 platform', () => {
  expect(selectArtifact(ARTIFACT_NAMES, 'linux', 'x64')).toBe(
    'stylua-linux-x86_64.zip'
  )
})

test('matches linux aarch64 platform', () => {
  expect(selectArtifact(ARTIFACT_NAMES, 'linux', 'arm64')).toBe(
    'stylua-linux-aarch64.zip'
  )
})

test('matches legacy windows x64 platform', () => {
  expect(selectArtifact(LEGACY_ARTIFACT_NAMES, 'win32', 'x64')).toBe(
    'stylua-win64.zip'
  )
})

test('matches legacy macos x64 platform', () => {
  expect(selectArtifact(LEGACY_ARTIFACT_NAMES, 'darwin', 'x64')).toBe(
    'stylua-macos.zip'
  )
})

test('matches legacy linux x64 platform', () => {
  expect(selectArtifact(LEGACY_ARTIFACT_NAMES, 'linux', 'x64')).toBe(
    'stylua-linux.zip'
  )
})

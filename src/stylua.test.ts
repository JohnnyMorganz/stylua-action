import {getFilenameMatcher} from './stylua'

const ARTIFACT_NAMES = [
  'stylua-linux-aarch64.zip',
  'stylua-linux-x86_64.zip',
  'stylua-linux.zip',
  'stylua-macos-aarch64.zip',
  'stylua-macos-x86_64.zip',
  'stylua-macos.zip',
  'stylua-win64.zip',
  'stylua-windows-x86_64.zip'
]

const selectArtifact = (
  platform: NodeJS.Platform,
  arch: string
): string | undefined => {
  const matcher = getFilenameMatcher(platform, arch)
  return ARTIFACT_NAMES.find(name => matcher(name))
}

test('matches windows x64 platform', () => {
  expect(selectArtifact('win32', 'x64')).toBe('stylua-windows-x86_64.zip')
})

test('matches macos x64 platform', () => {
  expect(selectArtifact('darwin', 'x64')).toBe('stylua-macos-x86_64.zip')
})

test('matches macos aarch64 platform', () => {
  expect(selectArtifact('darwin', 'arm64')).toBe('stylua-macos-aarch64.zip')
})

test('matches linux x64 platform', () => {
  expect(selectArtifact('linux', 'x64')).toBe('stylua-linux-x86_64.zip')
})

test('matches linux aarch64 platform', () => {
  expect(selectArtifact('linux', 'arm64')).toBe('stylua-linux-aarch64.zip')
})

# StyLua GitHub Action <a href="https://github.com/JohnnyMorganz/stylua-action/actions"><img alt="stylua-action status" src="https://github.com/JohnnyMorganz/stylua-action/workflows/build-test/badge.svg"></a>

GitHub Action to run [StyLua](https://github.com/JohnnyMorganz/StyLua), a Lua code formatter.

Installs the StyLua binary (from GitHub releases), and caches it. Any StyLua command can then be run.

## Usage

```yaml
- uses: actions/checkout@v2
- uses: JohnnyMorganz/stylua-action@1.0.0
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    # CLI arguments
    args: --check .
    # Specify `version` to pin a specific version, otherwise action will always use latest version/automatically update
```

### Parameters

#### `token` (Required)

GitHub token. Required since the binary is downloaded from GitHub releases (to speed download)

#### `args` (Required)

The arguments to pass to the StyLua binary

#### `version` (Optional)

The version of StyLua to use. Follows semver syntax.
If not specified, installs the latest release.
**It is recommended to pin your version so that updates to StyLua don't lead to unwanted changes in the action without explicitly updating.**

Based off https://github.com/Roblox/setup-foreman, licensed under [MIT](https://github.com/Roblox/setup-foreman/blob/master/LICENSE.txt)

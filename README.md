# StyLua GitHub Action <a href="https://github.com/JohnnyMorganz/stylua-action/actions"><img alt="stylua-action status" src="https://github.com/JohnnyMorganz/stylua-action/workflows/build-test/badge.svg"></a>

GitHub Action to run [StyLua](https://github.com/JohnnyMorganz/StyLua), a Lua code formatter.

Installs the StyLua binary (from GitHub releases), and caches it. Any StyLua command can then be run.

> **NOTE:** We recommend using a toolchain manager such as [aftman](https://github.com/LPGhatguy/aftman) to manage StyLua, as it allows you to define the version used throughout your project - both on the command line, and in GitHub actions.

## Usage

```yaml
- uses: actions/checkout@v4
- uses: JohnnyMorganz/stylua-action@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    version: latest # NOTE: we recommend pinning to a specific version in case of formatting changes
    # CLI arguments
    args: --check .
```

### Advanced Usage - Skip Running StyLua
This action can be summarized as 2 main steps

1. Get An Installation Of [StyLua](https://github.com/JohnnyMorganz/StyLua)
    1a. From the cache
    1b. If no cache, install + cache it
2. Run `stylua` with the user-provided `args`

If you would like to keep step 1 but skip step 2 because you want more manual
control, use `args: false`.

```yaml
- uses: actions/checkout@v4
- uses: JohnnyMorganz/stylua-action@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    version: latest # NOTE: we recommend pinning to a specific version in case of formatting changes
    # This disables running `stylua`
    args: false
```

### Parameters

#### `token` (Required)

GitHub token. Required since the binary is downloaded from GitHub releases (to speed download)

#### `args` (Required)

The arguments to pass to the StyLua binary

#### `version` (Required)

The version of StyLua to use. Follows semver syntax.
Alternatively, supply `latest` to use the latest available release.

**NOTE: using `latest` may cause the action to fail if StyLua updates and the formatting changes!**

Based off https://github.com/Roblox/setup-foreman, licensed under [MIT](https://github.com/Roblox/setup-foreman/blob/master/LICENSE.txt)

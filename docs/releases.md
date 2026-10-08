# Releases

## Release files

`fabricare release` packs the build results with 7-Zip into `release/`:

| File | Content | When |
|------|---------|------|
| `<prefix>.v<version>.<platform>.bin.zip` | `output/bin` | `releaseBin` (default true), `output/bin` not empty |
| `<prefix>.v<version>.<platform>.dev.zip` | all of `output/` (`bin`, `include`, `lib`) | `releaseDev` (default true) |
| `<prefix>.v<version>.<platform>.zip` | all of `output/` | `releaseOutput` (then no `.bin.zip` / `.dev.zip`) |
| `<prefix>.v<version>.sha512.json` | `{ "file name": "SHA-512", ... }` for every file above, all platforms | always |

- `<prefix>` is `<namespace>.<name>`, or `<namespace>.<releaseName>`.
- `<version>` is the solution version (`version.json`, or `Solution.version`).
- `.<platform>` is left out with `"releaseNoPlatform": true`.

For example `xyo.fabricare.v8.0.0.win64-msvc-2026.bin.zip`. An existing
release file is not replaced: bump the version, or `release-remove` first.
`"hasRelease": false` turns all the release actions off.

## Release actions

| Action | Effect |
|--------|--------|
| `release` | make the release files of the current version and platform |
| `release-version` | print `{ "version": ..., "release": [file names] }`; with `--release-path=dir --release-name=n` write it to `dir/n.<namespace>.<name>.json` |
| `release-exists` | print `{ "exists": true/false, "release": [files found] }`; `--for-platform=name` checks another platform (`wsl-`, `msys2-` prefixes removed, as those builds are named after the system they run in) |
| `release-extract` | extract the current version's release into `output/` (`.dev.zip` or `.zip` into `output/`, else `.bin.zip` into `output/bin`) |
| `install-from-release` | `release-extract`, then `install` |
| `release-install` | copy the release files and the checksum file to `~/.fabricare/release` (`FABRICARE_PATH_RELEASE`) |
| `release-remove` | delete this platform's release files of the current version and their checksum entries; the checksum file is deleted when empty |

## Publishing

### GitHub

Requires [`github-release`](https://github.com/github-release/github-release)
on `PATH` and its credentials (`GITHUB_TOKEN`, `GITHUB_USER`). The repository
is `Solution.githubRepository`, default the solution name.

```
fabricare release
fabricare github-release
```

`github-release` pulls the tags, creates the tag `v<version>` and the release
if they do not exist, and uploads `release/*.v<version>*` (`.zip`, `.exe`,
`.json`). If the release exists it stops, unless `--replace` is given: then it
uploads again, replacing the assets. Building for several platforms and
running `github-release` after each adds each platform's files to the same
release.

Other actions: `github-release-download` (assets of the current version into
`release/`), `github-release-check`, `github-release-keep-last-3`,
`github-release-remove-all`. The last two **delete releases and tags** on
GitHub.

### Gitea

Requires [`tea`](https://gitea.com/gitea/tea), logged in to the server. The
repository is `Solution.giteaRepository`, default the solution name.

`gitea-release` creates the tag and the release with the files of
`release/*.v<version>*` and the source archives `archive/*.v<version>*.zip`
(whose checksums are added to the `.sha512.json` file). It does nothing if the
release exists.

`gitea-release-download` downloads the current version's assets into
`release/` (source archives into `archive/`); set `GITEA_TOKEN` for private
repositories. `gitea-release-remove-all` **deletes all releases and tags**.

## A complete cycle

```
fabricare version-minor
fabricare clean
fabricare make
fabricare test
fabricare install
fabricare release
fabricare release-install
git commit -am "v1.3.0"
fabricare github-release
```

`fabricare sdk-make` does `make`, `install`, `release` and `release-install`
in one step.

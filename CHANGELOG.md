# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.4.0] - 2024-12-04

### Added

- platform msys2-ucrt64
- platform ucrt64

### Changed

- renamed platform name from sys-mingw32 to msys2-mingw32
- renamed platform name from sys-mingw64 to msys2-mingw64

## [7.0.0] - 2024-08-20

### Removed

- lib-and-dll

### Added

- dll-or-lib
- crt type on project

## [5.4.0] - 2024-02-13

### Added

- Debian support

## [5.3.0] - 2024-01-30

### Added

- Solution.releaseNoPlatform - flag, don't add platform to release name

## [5.0.1] - 2023-09-10

### Added

- help action/flag

## [5.0.0] - 2023-07-04

### Changed

- default repository folder is now .xyo-sdk/[platform]
- separate config and solution file, created workspace

### Added

- gitea-download - to download release from gitea repository

## [3.0.4] - 2023-02-23

### Fixed

- Fixed release-extract, wrong folder if releaseOutput was set to true

## [3.0.2] - 2023-02-13

### Added

- debug flag

## [3.0.0] - 2023-02-09

### Changed

- removed testSource

### Added

- project category, there are now two main category "make" and "test", default project category is "make"
- Project.name can be an array, this will be expanded to a list of projects

## [2.2.0] - 2023-02-05

### Added

- release-extract - Extract current version release if exists to output directory
- install-from-release - Allow install from release folder to repository, current version, if exists
- make.done.js - Run commands after successfully make
- github-download - If current release is not found, download from github, if exists.

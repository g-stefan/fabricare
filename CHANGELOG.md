# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

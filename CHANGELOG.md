# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.10] - 2020-11-16
### Added
- Option to disable admin auto-backup

## [0.3.9] - 2020-11-16
### Fixed
- Crash if image does not exists

## [0.3.8] - 2020-11-11
### Fixed
- Default admin sidebar post in config file

## [0.3.7] - 2020-11-11
### Fixed
- Default admin sidebar post in config file

## [0.3.6] - 2020-11-11
### Added
- Default admin sidebar post in config file

### Fixed
- Tiny fixes in lib components

## [0.3.5] - 2020-09-30
### Added
- Validated file extensions in config file
- Empty button for Datetime input
- Override PaginationServer axios options

### Fixed
- Tiny fixes in lib components

## [0.3.4] - 2020-09-17
### Added
- External "post" in landing GET request

## [0.3.3] - 2020-09-17
### Fixed
- TextareaInputBaseComponentLib autoExpand if placeholder more than one line
- New attempt to fix Wysiwyg update (again)

### Added
- `renderImage` and `renderPdf` in UploadInputBaseComponentLib
- `--skip-migrations` in `php artisan cms:migrate`
- external "post" in landing GET request

## [0.3.2] - 2020-09-09
### Fixed
- Fixed migrations order
- Missing Input File proptypes

### Added
- `M_D_YY_th` and `M_D_YY_tlh` date formats in trans

## [0.3.1] - 2020-09-08
### Fixed
- Fixed config call if empty "path" input
- Fixed Auth HOC from samples

## [0.3.0] - 2020-09-03
### Fixed
- File translatable in admin
- Input label empty
- New attempt to fix Wysiwyg update
- DateFns setDefaultLocale not working

### Updated
- Migrations are not automatic anymore, you must run artisan command to create migrations manually after changes (usualy before commiting to git)
- All post types but only post who belongs to a post type with a key are exported into migrations
- Config request response body
- Laravel relations improvement
- Some optimizations

### Added
- Post types in config file
- PhpDoc in sources

## [0.2.1] - 2020-08-25
### Fixed
- Artisan command to create default posts
- Create new post type
- Post value not checked
- Uploaded files path
- Missing .editorconfig in assets publish
- Attempt to fix Wysiwyg update

### Updated
- Moved out sample assets from `assets/src/web` to `assets/sample-*`
- Webpack now detects folders under `assets/src` and create bundles for each `assets/src/*/css/index.scss` and `assets/src/*/js/index.js` entrypoints

### Added
- Option in cms-file config to disable the image thumbs

## [0.2.0] - 2020-08-19
### Added
- Auto migrations for cms posts into `storage/cms/migrations`
- Artisan command to create default posts
- Artisan command to create country posts
- Artisan command to create migrations
- Artisan command to migrate
- Webpack now checks case-sensitive imports

### Updated
- Moved `storage/app/upload` folder into `storage/cms/upload`

### Removed
- Default posts migration
- Countries table migration

## [0.1.0] - 2020-08-18
### Fixed
- Missing import in SelectCustomInputBaseComponentLib

### Updated
- Config files are now separated into multiple config files

### Added
- Prettier JS+PHP
- Escaped route patterns in config

## [0.0.14] - 2020-07-23
### Fixed
- Fixed Wysiwyg target (maybe)

## [0.0.13] - 2020-06-16
### Fixed
- Fixed Wysiwyg refresh initialValue

### Added
- Added post query multiple (global and/or)

## [0.0.12] - 2020-05-29
### Fixed
- Fixed LibPaginationServer component showing "no-result" before first fetch fix

## [0.0.11] - 2020-05-29
### Fixed
- Fixed LibPaginationServer component showing "no-result" before first fetch
- Fixed LibAnchor component missing children props declaration
- Fixed Anchor component animation hoc import name
- Fixed post item search in values
- Fixed admin post types default order label

## [0.0.10] - 2020-05-29
### Fixed
- Fixed Post list items count

## [0.0.9] - 2020-04-28
### Fixed
- Fixed Select multiple initial value fix

## [0.0.8] - 2020-03-26
### Fixed
- DateFns locale

### Updated
- User emails are localized based on the user lang id

### Added
- Lang id field in user
- Admin user can manually add users
- Add user data on signin
- Update user data

## [0.0.7] - 2020-03-24
### Updated
- Payload of file

  - `exists` attribute
  - `size` attribute (in bytes)

## [0.0.6] - 2020-03-06
### Fixed
- Fixed router switch subpages

## [0.0.5] - 2020-03-02
### Fixed
- Fixed Select multiple initial value fix

### Updated
- Admin assets

## [0.0.4] - 2020-03-02
### Fixed
- DateFns import names

### Updated
- Admin assets

## [0.0.3] - 2020-02-28
### Fixed
- Admin upload image checks
- Select multiple initial value

## [0.0.2] - 2020-02-24
### Updated
- Initial release

## [0.0.1] - 2020-02-24
### Added
- Initial release

[Unreleased]: https://bitbucket.org/tbntswiss/cms/src/master/CHANGELOG.md
[0.3.10]: https://bitbucket.org/tbntswiss/cms/src/0.3.10/CHANGELOG.md
[0.3.9]: https://bitbucket.org/tbntswiss/cms/src/0.3.9/CHANGELOG.md
[0.3.8]: https://bitbucket.org/tbntswiss/cms/src/0.3.8/CHANGELOG.md
[0.3.7]: https://bitbucket.org/tbntswiss/cms/src/0.3.7/CHANGELOG.md
[0.3.6]: https://bitbucket.org/tbntswiss/cms/src/0.3.6/CHANGELOG.md
[0.3.5]: https://bitbucket.org/tbntswiss/cms/src/0.3.5/CHANGELOG.md
[0.3.4]: https://bitbucket.org/tbntswiss/cms/src/0.3.4/CHANGELOG.md
[0.3.3]: https://bitbucket.org/tbntswiss/cms/src/0.3.3/CHANGELOG.md
[0.3.2]: https://bitbucket.org/tbntswiss/cms/src/0.3.2/CHANGELOG.md
[0.3.1]: https://bitbucket.org/tbntswiss/cms/src/0.3.1/CHANGELOG.md
[0.3.0]: https://bitbucket.org/tbntswiss/cms/src/0.3.0/CHANGELOG.md
[0.2.1]: https://bitbucket.org/tbntswiss/cms/src/0.2.1/CHANGELOG.md
[0.2.0]: https://bitbucket.org/tbntswiss/cms/src/0.2.0/CHANGELOG.md
[0.1.0]: https://bitbucket.org/tbntswiss/cms/src/0.1.0/CHANGELOG.md
[0.0.14]: https://bitbucket.org/tbntswiss/cms/src/0.0.14/CHANGELOG.md
[0.0.13]: https://bitbucket.org/tbntswiss/cms/src/0.0.13/CHANGELOG.md
[0.0.12]: https://bitbucket.org/tbntswiss/cms/src/0.0.12/CHANGELOG.md
[0.0.11]: https://bitbucket.org/tbntswiss/cms/src/0.0.11/CHANGELOG.md
[0.0.10]: https://bitbucket.org/tbntswiss/cms/src/0.0.10/CHANGELOG.md
[0.0.9]: https://bitbucket.org/tbntswiss/cms/src/0.0.9/CHANGELOG.md
[0.0.8]: https://bitbucket.org/tbntswiss/cms/src/0.0.8/CHANGELOG.md
[0.0.7]: https://bitbucket.org/tbntswiss/cms/src/0.0.7/CHANGELOG.md
[0.0.6]: https://bitbucket.org/tbntswiss/cms/src/0.0.6/CHANGELOG.md
[0.0.5]: https://bitbucket.org/tbntswiss/cms/src/0.0.5/CHANGELOG.md
[0.0.4]: https://bitbucket.org/tbntswiss/cms/src/0.0.4/CHANGELOG.md
[0.0.3]: https://bitbucket.org/tbntswiss/cms/src/0.0.3/CHANGELOG.md
[0.0.2]: https://bitbucket.org/tbntswiss/cms/src/0.0.2/CHANGELOG.md
[0.0.1]: https://bitbucket.org/tbntswiss/cms/src/0.0.1/CHANGELOG.md

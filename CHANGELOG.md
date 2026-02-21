# Changelog

## [0.2.20] - 2026-02-21

### Added
- JS callback support in config via `callback:functionName` prefix — enables plugins like Mention to use JS functions in `CKEDITOR_5_CONFIGS` ([#320](https://github.com/hvlads/django-ckeditor-5/pull/320), closes [#298](https://github.com/hvlads/django-ckeditor-5/issues/298))
- Read-only mode for disabled textareas — CKEditor now respects the `disabled` attribute ([#322](https://github.com/hvlads/django-ckeditor-5/pull/322), closes [#192](https://github.com/hvlads/django-ckeditor-5/issues/192))
- `CKEDITOR_5_IMAGE_CLEANUP` setting — automatic image cleanup on update/delete is now opt-in, default `False` ([#321](https://github.com/hvlads/django-ckeditor-5/pull/321))

### Fixed
- Eliminated unnecessary SQL query on object create in `pre_save` signal; consolidated multiple SELECTs into one for models with several `CKEditor5Field`s ([#321](https://github.com/hvlads/django-ckeditor-5/pull/321), closes [#289](https://github.com/hvlads/django-ckeditor-5/issues/289))
- CSRF_COOKIE_HTTPONLY=True breaks file upload ([#319](https://github.com/hvlads/django-ckeditor-5/pull/319), closes [#310](https://github.com/hvlads/django-ckeditor-5/issues/310))
- Clean empty HTML content for optional CKEditor5 fields ([#309](https://github.com/hvlads/django-ckeditor-5/pull/309), closes [#271](https://github.com/hvlads/django-ckeditor-5/issues/271))
- Handle STORAGES default OPTIONS for Django 4.2 compatibility ([#317](https://github.com/hvlads/django-ckeditor-5/pull/317))

### Upgraded
- CKEditor 5 from 47.3.0 to 47.5.0 ([#318](https://github.com/hvlads/django-ckeditor-5/pull/318))


## [0.2.19] - 2025-01-10

### Upgraded
- CKEditor 5 from 44.1.0 to 47.3.0

### CI
- Added tox for multi-version Django/Python testing
- Added Release Drafter for automated changelog generation


## [0.2.18] - 2024-11-01

### Fixed
- Fixed signals storage class instantiation
- Refined regex to better handle `<img>` tags with varied attribute orders

### Upgraded
- CKEditor 5 dependencies to version 45.x


## [0.2.16] - 2024-10-01

### Added
- Automatic cleanup of unused CKEditor images on update and delete ([#275](https://github.com/hvlads/django-ckeditor-5/pull/275))

### Upgraded
- CKEditor 5 from 43.2.0 to 44.1.0


## [0.2.14] - 2024-08-01

### Added
- FullScreen plugin
- File size limit for image and file uploads (`CKEDITOR_5_MAX_FILE_SIZE`)
- Permissions check for file upload (`CKEDITOR_5_FILE_UPLOAD_PERMISSION`)

### Fixed
- Sync CKEditor content with textarea for form validation ([#251](https://github.com/hvlads/django-ckeditor-5/pull/251))
- Use arrow notation to call `createEditors()` on `formset:added` event

### Upgraded
- CKEditor 5 from 41.3.1 to 43.2.0


## [0.2.13] - 2024-05-01

### Added
- Custom upload URL support (`CK_EDITOR_5_UPLOAD_FILE_VIEW_NAME`) ([#218](https://github.com/hvlads/django-ckeditor-5/pull/218))
- Editor instance callback via `window.ckeditorRegisterCallback` / `window.ckeditorUnregisterCallback`
- Plugins: ShowBlocks, SelectAll, FindAndReplace
- Full page HTML support
- Special characters support ([#193](https://github.com/hvlads/django-ckeditor-5/issues/193))
- File upload as links support
- Return 400 response code with error message on upload failure

### Upgraded
- CKEditor 5 from 41.1.0 to 41.3.1


## [0.2.12] - 2024-03-01

### Added
- Django user language support (`CKEDITOR_5_USER_LANGUAGE`)
- Support for dynamically loaded editors (MutationObserver)
- Regex string to RegExp conversion in JSON config reviver

### Fixed
- Rendering complete form
- CKEditor5-html-embed plugin
- Restore compatibility with django-nested-admin

### Upgraded
- CKEditor 5 from 40.2.0 to 41.1.0


## [0.2.11] - 2023-12-01

### Added
- Type annotations
- Improved error handling

### Upgraded
- CKEditor 5 to 40.2.0


## [0.2.10] - 2023-10-01

### Fixed
- CKEditor layout with flexbox in Django 4.2.x ([#162](https://github.com/hvlads/django-ckeditor-5/issues/162))
- `json_script` filter argument ([#164](https://github.com/hvlads/django-ckeditor-5/issues/164))

### Upgraded
- CKEditor 5 dependencies to version 39.0.2


## [0.2.9] - 2023-08-01

### Added
- HorizontalLine and LinkImage plugins
- Support for django-nested-admin

### Fixed
- Label element floating issue for CKEditor5Field ([#152](https://github.com/hvlads/django-ckeditor-5/issues/152))
- Issue with initialising empty forms

### Upgraded
- CKEditor 5 to 38.1.1


## [0.2.8] - 2023-06-01

### Added
- Style plugin ([#139](https://github.com/hvlads/django-ckeditor-5/issues/139))
- pytest for example project

### Fixed
- WordCount plugin removal TypeError in app.js ([#140](https://github.com/hvlads/django-ckeditor-5/issues/140))
- Refactored DEFAULT_FILE_STORAGE to STORAGES["default"] ([#138](https://github.com/hvlads/django-ckeditor-5/issues/138))


## [0.2.7] - 2023-05-01

### Added
- Markdown plugin ([#131](https://github.com/hvlads/django-ckeditor-5/issues/131))
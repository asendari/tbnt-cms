# Upgrade Guide

## General

### Assets

- If you published the **web** assets, you must execute the following commands:

    - `php artisan vendor:publish --tag=cms.assets.install`
    - `php artisan vendor:publish --tag=cms.assets.update --force`

- If you published the **web and admin** assets, you must execute the following commands:

    - `php artisan vendor:publish --tag=cms.assets.admin.install`
    - `php artisan vendor:publish --tag=cms.assets.admin.update --force`

- If you published the **admin** bundles, you must execute the following command:

    - `php artisan vendor:publish --tag=cms.assets.admin.only --force`

## From 0.3.5 to 0.3.8

### Assets

[cf. General > Assets](#assets)

## From 0.3.4 to 0.3.5

### Assets

[cf. General > Assets](#assets)

## From 0.3.2 to 0.3.3

### Assets

[cf. General > Assets](#assets)

## From 0.3.x to 0.3.2

### Migrations

- `php artisan migrate`

## From 0.2.2 to 0.3.x

### Migrations

- `php artisan migrate`

### Assets

[cf. General > Assets](#assets)

Values from "translation" posts come from `Lang.get('cms.xxx')` instead of `Lang.get('api.xxx')`.

## From 0.2.1 to 0.2.2

### Migrations

- `php artisan cms:migrations`

## From 0.2.0 to 0.2.1

### Assets

[cf. General > Assets](#assets)

## From 0.1.x to 0.2.0

### Migrations

- `php artisan migrate`
- `php artisan cms:migrations`

## From 0.0.x to 0.1.0

### Assets

If you previously published the `package.json` from the cms, and if you want to use Prettier with JS+PHP, you must install the following NPM packages:

- `npm i -D prettier`
- `npm i -D @prettier/plugin-php`

### Config

If you previously published the cms config file, you have to rebublish the corresponding config files:

If you changed something in `config('cms.project.xxx')`:

_Warning: this command will override your previously published config file. Make sure to rename `config/cms.php` to something like `config/cmsold.php` before loosing your changes._

- `php artisan vendor:publish --tag=cms.config --force`

If you changed something in `config('cms.file.xxx')`:

- `php artisan vendor:publish --tag=cmsfile.config`

If you changed something in `config('cms.lang.xxx')`:

- `php artisan vendor:publish --tag=cmslang.config`

If you changed something in `config('cms.oauth.xxx')`:

- `php artisan vendor:publish --tag=cmsoauth.config`

If you changed something in `config('cms.templates.xxx')`:

- `php artisan vendor:publish --tag=cmstemplates.config`

## From 0.0.x to 0.0.8

### Migrations

- `php artisan migrate`

### Assets

If you used the `sample-auth.js` in your web assets, you must update your index:

```javascript
/* assets/src/web/index.js */

Auth.setLoginData(Auth.getToken()); // <- add this line
Auth.fetchUser(() => {
	// ...
});
```

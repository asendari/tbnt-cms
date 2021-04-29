# TBMT CMS

## Prologue

### Release Notes

#### Versioning Scheme

TBNT CMS and its other first-party packages **will** follow [Semantic Versioning](https://semver.org/) **when stable (v1.x)**. In the meantime, major **and minor** versions can introduce **breaking changes**, patch versions will follow the conventional backwards compatible bug fixes without any breaking changes.

When referencing the TBNT CMS from your application or package, you should always use a version constraint such as `~0.0.1` as it will cover `>=0.0.1 <0.1.0`, since both of major and minor releases of TBNT CMS do include breaking changes.



#### TBNT CMS v0.3.x

See [CHANGELOG.md].



### Upgrade Guide

See [UPGRADE.md].



### Contribution Guide

#### Bug Reports

To encourage active collaboration, TBNT CMS accepts pull requests and bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

If you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible and a code sample that demonstrates the issue. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem.



#### Support Questions

TBNT CMS GitHub issue trackers are not intended to provide TBNT CMS help or support. Instead, please contact us through our Slack channel or you can write to us at [cms@tbnt.digital](cms@tbnt.digital).



#### Core Development Discussion

You may propose new features or improvements of existing TBNT CMS behavior in the TBNT CMS Ideas issue board. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.



#### Which Branch

**All** bug fixes should be sent to the latest stable branch. Bug fixes should **never** be sent to the `master` branch unless they fix features that exist only in the upcoming release.

**Minor** features that are **fully backwards compatible** with the current release may be sent to the latest stable branch.

**Major** new features or **minor** features that introduces breaking changes should always be sent to the `master` branch, which contains the upcoming release.



#### Compiled Assets

**Never** commit compiled files. Due to their large size, they cannot realistically be reviewed by a maintainer. This could be exploited as a way to inject malicious code into TBNT CMS.



#### Security Vulnerabilities

If you discover a security vulnerability within TBNT CMS, please send an email at [cms@tbnt.digital](cms@tbnt.digital). All security vulnerabilities will be promptly addressed.



#### Code of Conduct

The TBNT CMS code of conduct is derived from the [Laravel code of conduct](https://laravel.com/docs/6.x/contributions#code-of-conduct). Any violations of the code of conduct may be reported at [cms@tbnt.digital](cms@tbnt.digital):

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behavior which can be reasonably considered harassment will not be tolerated.



## Getting Started

### Installation

#### Server Requirements

The TBNT CMS inherits the [Laravel 6.x system requirements](https://laravel.com/docs/6.x/installation#server-requirements).



##### PHP

###### Composer

Because a `php` alias that reference an installation that is not in `/usr/bin` (like MAMP or something else), the exectued PHP version by `composer` may vary from your `php` normal behaviour.



###### Requirements

The **minimal** PHP version must be **7.2** at least.

*The PHP version 7.3 has not yet been fully tested, but is espected to work.*

*There are known issues with PHP 7.4 that should be fixed soon.*



**Automatically**

You can easily switch between `php` versions (as well for `composer`) accross projects by giving [p](https://github.com/drpiou/p) a try.



**Manually**

To check which PHP version `composer` is using, just execute this command (in OS X):

`composer -vvv about 2>&1 | grep "PHP"`



If the PHP version is **lower** than 7.3, you can add an alias in your `~/.bash_profile`:

`alias composer73="/<path_to_php_folder>/bin/php /usr/local/bin/composer"`

You can then replace any further `composer` commands with `composer73`.



#### Installing TBNT CMS

##### Laravel

This package requires Laravel **6.x**.

`composer create-project --prefer-dist laravel/laravel=^6.0 <project-name>`

Then, you can navigate into your project folder.

`cd <project-name>`



##### Composer

Because this repository is **private**, you need to add an entry into the `composer.json`:

```php
/* composer.json */

"repositories": [
  // ...
  {
    "type": "vcs",
    "url": "git@bitbucket.org:tbntswiss/cms.git"
  }
  // ...
]
```



You also need to make sure that you have a **valid** ssh Bitbucket connexion:

https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html



Then, you can require the package as usually:

`composer require tbntswiss/cms:"~0.3.10"`



##### Config Files

The package has its own `.htaccess` and `.env` template you can publish:

`php artisan vendor:publish --tag=cms.htaccess`

`php artisan vendor:publish --tag=cms.env`

*The published file will be suffixed with **.sample** to prevent any current file override.*



##### Database

Because this package needs a working database, you must ensure that you have one created and configured in `.env` file.



##### Migrations

First, ensure to **delete** the default Laravel migrations in `database/migrations`.

Then you must run the package migrations:

`php artisan migrate`



##### First Initialization

After running the migrations, you must run the "deploy" script:

`php artisan cms:deploy-cms`



You will be driven through an installation process that will cover:

- Set app key
    - set .env/_example "APP_KEY"

- Set app name
    - set .env/\_example "APP_NAME"
    - set package.json "name"

- Create user (the admin user)
    - select `y` at `Is the user "active"?`
    - select `0` at `What is the user "type"?`
    - select `y` at `Should I make the user a "superadmin"?`

- Set laravel passport
    - generate keys
    - set .env/\_example "PERSONAL_CLIENT_ID"
    - set .env/\_example "PERSONAL_CLIENT_SECRET"
    - set .env/\_example "PASSWORD_CLIENT_ID"
    - set .env/\_example "PASSWORD_CLIENT_SECRET"
    - set storage/oauth-xxx.key files (forced)
    - update `oauth_clients` table



You can create as many users as you want:

`php artisan cms:create-user`

*Is the user "active"?*

  - *Selecting `yes` makes the user active, it can login, ...*
  - *Selecting `no` makes the user inactive, it cannot login, ...*

*What is the user "type"?*

  - *Selecting `0` makes the user an `admin` user.*
  - *Selecting `1` makes the user a `cron` user.*
  - *Selecting `2` makes the user a `web` user.*

*Should I make the user a "superadmin"?*

  - *Selecting `yes` makes the user a `superadmin` user, it can edit CMS structure.*
  - *Selecting `no` makes the user an `admin` user, it can edit CMS posts.*



After running the "deploy" script, you should run the "default-posts" script:

`php artisan cms:create-default-posts`



If you are interested about "countries" posts, you can run the following script:

`php artisan cms:create-countries-posts`



##### Assets

###### Frontend assets

*You can delete the default files `package.json` and `webpack.mix.js` at the root the project.*

Files will be published in these locations:

- `/assets/src` source assets (your frontend and eventually the admin)
- `/public/assets` bundled assets
- `/public/images/admin` package default admin images
- `/public/images/logo.png` package default logo
- `/.babelrc` Babel configurations
- `/.editorconfig` Editor configurations
- `/.prettierignore` Prettier ignore configurations
- `/.prettierrc` Prettier configurations
- `/package.json` NPM packages
- `/postcss.config.js` PostCSS configurations
- `/webpack.config.js` Webpack configurations

**Web assets only**

You probably want to publish this (if you don't know).

`php artisan vendor:publish --tag=cms.assets.install --force`

- This will publish the assets and override existing files that may exists and conflict with the published files.

**Web and admin assets**

Or, you can choose to publish the web and admin assets if you need to modify the React part of the admin.

`php artisan vendor:publish --tag=cms.assets.admin.install --force`

- This will publish the assets and override existing files that may exists and conflict with the published files.

**Admin bundles only**

Finally, if you want to only publish the pre-bundled admin assets (because they are needed for the main purpose of this package) and keep your current project untouched, you can choose to only publish the admin bundles.

`php artisan vendor:publish --tag=cms.assets.admin.only --force`



##### NPM

This package temporarily needs `npx` to deal with react depricated warnings from some dependencies:

`npm i -D npx`

*Hope to remove this soon 🙄*



Then you must install the npm packages:

`npm i`



**Laravel Configuration**

To login into the admin panel using Laravel Passport included with this package as a depedency, you must update the `config/auth.php` file:

```php
/* config/auth.php */

<?php

return [
  // ...

  'providers' => [
    // ...

    'users' => [
      'driver' => 'eloquent',
      'model' => Tbnt\Cms\Model\User::class, // <- use the package User Model
    ],

    // ...
  ],

  // ...
];
```



To have unified error response, the package ships with an `ExceptionHandler`:

```php
/* app/Exceptions/Handler.php */

<?php

namespace App\Exceptions;

use Exception;
use Tbnt\Cms\Exceptions\Handler as ExceptionHandler; // <- use the package Handler

class Handler extends ExceptionHandler
{
  // ...
}
```



This package has been developed with `ConvertEmptyStringsToNull` inactive, therefore it is suggested to comment the following until further tests has been applied:

```php
/* app/Http/Kernel.php */

<?php

class Kernel extends HttpKernel
{
  // ...

  protected $middleware = [
    \App\Http\Middleware\TrustProxies::class,
    \App\Http\Middleware\CheckForMaintenanceMode::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    \App\Http\Middleware\TrimStrings::class,
    // \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
  ];

  // ...
}
```



If you choosed to publish the web assets (`--tag=cms.assets.install` or `--tag=cms.assets.update`), remove or comment the default Laravel route:

```php
/* routes/web.php */

<?php

// ...

// Route::get('/', function () {
//     return view('welcome');
// });

```



**Update .gitignore**

Last thing to do for git convenience, is to update the `.gitignore` file at the root of the project by adding the following:

- `/public/assets` (the compiled assets)

- `.DS_Store` (because, who wants that)



**Done**

If you choosed to only publish the admin assets (`--tag=cms.assets.admin`), then you are now good to go.

Otherwise, run one of the `npm run dev`, `npm run watch` or `npm run prod`.

The admin panel is available at `http(s)://your.project/admin` if you have set up a host or `http(s)://your.project.path/public/admin`.



### Configuration

#### Apache

The package has its own `.htaccess` template, that you can publish:

`php artisan vendor:publish --tag=cms.htaccess`

*The published file will be suffixed with **.sample** to prevent any current file override.*

If you want to set up a host, don't forget to point the project to the `public` folder:

eg: `/www/your.project/public`



#### Laravel

The package has its own `.env` variables/template, that you can publish:

`php artisan vendor:publish --tag=cms.env`

*The published file will be suffixed with **.sample** to prevent any current file override.*



| Variable                     | Config                                         | Default           | Description                                                  |
| ---------------------------- | ---------------------------------------------- | ----------------- | ------------------------------------------------------------ |
| APP_URL                      | app.url (Laravel)                              | #                 | This value is not used within the package. We use `app_url()` instead because of the sake of not keeping this value updated for every environment. |
| SESSION_PATH_COOKIE          | session.path (Laravel)                         | base_url()        | This value is initialized based on `base_url()` instead of `/`. |
| SESSION_HTTP_ONLY_COOKIE     | session.http_only (Laravel)                    | true              |                                                              |
| SESSION_SAME_SITE_COOKIE     | session.same_site (Laravel)                    | null              |                                                              |
| MAIL_REPLY_TO_ADDRESS        | mail.reply_to.address                          | reply@example.com | The default email address to reply to from emails.           |
| MAIL_REPLY_TO_NAME           | mail.reply_to.name                             | Reply             | The default name to reply to from emails.                    |
| MAIL_DEFAULT_TO_ADDRESS      | mail.default_to.address                        | to@example.com    | The default email address to send emails from.               |
| MAIL_DEFAULT_TO_NAME         | mail.default_to.name                           | To                | The default name to send emails from.                        |
| OAUTH_TOKEN_TTL              | cmsoauth.token_ttl                             | 10                | Duration in minutes of the Laravel Passport token.           |
| OAUTH_REFRESH_TOKEN_TTL      | cmsoauth.refresh_token_ttl                     | 60                | Duration in minutes of the Laravel Passport refresh token.   |
| OAUTH_GRACE_PERIOD_TTL       | cmsoauth.grace_period_ttl                      | 2                 | Duration in minutes of the Laravel Passport refresh token grace period. |
| PROJECT_PUBLIC               | cms.public                                     | '/'               | This value is the base folder of the public content relative to the index.php file. |
| PROJECT_ADMIN_BASE           | cms.admin_base                                 | '/admin'          | This value is the slug route of the admin panel.             |
| GOOGLE_API_KEY               | services.google.api.key                        | null              | This value is the Google API Key, if used.                   |
| GOOGLE_API_SIGNING           | services.google.api.signing                    | null              | This value is the Google API Signing Key, if used.           |
| GOOGLE_API_SECRET            | services.google.api.secret                     | null              | This value is the Google API Secret Key, if used.            |
| GOOGLE_RECAPTCHA_KEY         | services.google.recaptcha.key                  | null              | This value is the Google API ReCaptcha Key, if used.         |
| GOOGLE_RECAPTCHA_SECRET      | services.google.recaptcha.secret               | null              | This value is the Google API ReCaptcha secret, if used.      |
| GOOGLE_ANALYTICS_ID          | services.google.analytics.id                   | null              | This value is the Google Analytics ID, if used.              |
| GOOGLE_TAG_MANAGER_ID        | services.google.tag_manager.id                 | null              | This value is the Google Tag Manager ID, if used.            |
| GOOGLE_SERVICE_ACCOUNT_KEY   | services.google.service_accounts.key           | null              | This value is the Google API Service Account Key, if used.   |
| GOOGLE_SERVICE_READONLY      | services.google.service_accounts.read_only     | null              | This value is the Google API Service Read Only, if used.     |
| GOOGLE_SERVICE_ASSERTED_USER | services.google.service_accounts.asserted_user | null              | This value is the Google API Service Asserted User Id, if used. |
| FACEBOOK_PIXEL_ID            | services.facebook.pixel.id                     | null              | This value is the Facebook Pixel ID, if used.                |



#### Package

The package has its own `cms.php` configuration files, that you can individually publish:

- `php artisan vendor:publish --tag=cms.config-project`
- `php artisan vendor:publish --tag=cms.config-countries`
- `php artisan vendor:publish --tag=cms.config-file`
- `php artisan vendor:publish --tag=cms.config-lang`
- `php artisan vendor:publish --tag=cms.config-oauth`
- `php artisan vendor:publish --tag=cms.config-templates`

*The published files will be located to the `config` folder of laravel.*



| Config                              | Default                  | Type     | Description                                                  |
| ----------------------------------- | ------------------------ | -------- | ------------------------------------------------------------ |
| cms.meta_title_suffix               | ' | <app_name>'          | string   | This value is the suffix of the website meta title.          |
| cms.public                          | '/'                      | string   | This value is the base folder of the public content relative to the `index.php` file. |
| cms.admin_base                      | '/admin'                 | string   | This value is the slug route of the admin panel.             |
| cms.auto_backup                     | true                     | boolean  | This value is the auto backup status. If "true", a backup will implicitely be done at different frequencies while using the admin. |
| cms.sidebar_default                 | null                     | string   | This value is the sidebar default post of the admin panel.   |
| cms.escape_patterns                 | []                       | string[] | This value is the slug route of the admin panel.             |
| cms.logo                            | '/images/logo.png'       | string   | This value is the location of the website logo relative to the `cms.public`. |
| cms.timezone                        | 'Europe/Zurich'          | string   | This value is the default timezone for your project, which will be used to format dates. Instead of `app.timezone`, this value is used with `to_xxx_tz_string` functions which uses `set_timezone` internaly that will default to this value. This is intended for having `set_timezone` as the default timezone in the database, while displaying them using `cms.timezone`. |
| cms.password_reset_duration         | 24                       | integer  | This value is the time in hours of the password reset token validity. |
| cms.contact                         | true                     | boolean  | Is this value is set to true, the default contact form will be active. |
| cms.user                            | false                    | boolean  | Is this value is set to true, the `auth` routes and functions will be active. |
| cms.cron                            | false                    | boolean  | Is this value is set to true, the `cron` routes and functions will be active. |
| cms.test                            | false                    | boolean  | Is this value is set to true, the `test` routes and functions will be active. |
| cms.migrations                      | 'migrations'             | string   | This value is the migrations storage folder under 'storage/app'. |
| cmscountries.list                   | array                    | array    | This is the countries list used in migrations.               |
| cmscountries.list.code              | string                   | string   | This is the country code.                                    |
| cmscountries.list.name              | string                   | string   | This is the country name.                                    |
| cmsfile.folder                      | 'uploads'                | string   | This is the file storage folder under 'storage/app'.         |
| cmsfile.uuid                        | true                     | boolean  | Generate UUID instead of original filename.                  |
| cmsfile.thumbs                      | true                     | boolean  | Generate thumbs.                                             |
| cmsfile.max_size                    | 12 * 1024                | integer  | This value is the file max size in kb.                       |
| cmsfile.image_max_size              | 2 * 1024                 | integer  | This value is the image max size in kb.                      |
| cmsfile.image_max_width             | 2400                     | integer  | This value is the image max width/height in px.              |
| cmsfile.thumb_max_width             | 800                      | integer  | This value is the image thumb max width/height in px.        |
| cmsfile.image_quality               | 70                       | integer  | This value is the image quality.                             |
| cmslang.default                     | 'fr'                     | string   | This is the default `cmslang.langs.x.code`.                  |
| cmslang.can_be_empty                | true                     | boolean  | This tells if the url of the `cmslang.default` lang code can be empty or must appear. Examples: `true: https://domain/slug` `false: https://domain/fr/slug` |
| cmslang.hidden                      | []                       | array    | This hides the `cmslang.langs.x.code` in the frontend, but still shows them in the admin for data fill purpose. |
| cmslang.langs                       | ['en' => [], 'fr' => []] | array    | This list the available langs. The items should be named with lang code to prevent `mergeConfig` to merge arrays as indexed arrays from your `config/cms.php` with the package `cms.php` default config. |
| cmslang.langs.x.id                  | ```<incrementalId>```    | integer  | This is the id of the language. It should start from `1`, and should be incremented each by `1`. Examples: `en:id=1` `fr:id=2` |
| cmslang.langs.x.code                | ```<langCode>```         | string   | This is the code of the language. It should be a string of 2 chars. Examples: `en:code=en` `fr:code=fr` |
| cmslang.langs.x.name                | ```<langName>```         | string   | This is the display name of the language. Examples: `en:name=English` `fr:name=Français` |
| cmslang.langs.x.locale              | ```<langLocale>```       | string   | This is the code of the language. It should be a string of 4 chars separated by a hyphen. Examples: `en:locale=en_US` `fr:locale=fr_FR` |
| cmslang.langs.x.emoji               | ```<langEmoji>```        | string   | This is the emoji of the language. Examples: `en:emoji=🇬🇧` `fr:emoji=🇫🇷` |
| cmslang.langs.x.img                 | ```<langImg>```          | string   | This is the url of the icon of the language. Examples: `en:img=public/icons/en.png` `fr:img=public/icons/fr.png` |
| cmsoauth.token_ttl                  | 10                       | integer  | This value is the duration in minutes of the token.          |
| cmsoauth.refresh_token_ttl          | 60                       | integer  | This value is the duration in minutes of the refresh token.  |
| cmsoauth.grace_period_ttl           | 2                        | integer  | This value is the duration in minutes of the refresh token grace period. |
| cmstemplates.signin                 | 'signin'                 | string   | This value is the key of the Signin page.                    |
| cmstemplates.signup                 | 'signup'                 | string   | This value is the key of the Signup page.                    |
| cmstemplates.recover_password       | 'recover-password'       | string   | This value is the key of the Recover Password page.          |
| cmstemplates.account_activated      | 'account-activated'      | string   | This value is the key of the Account Activated page.         |
| cmstypes.page                       | 'page'                   | string   | This value is the key of the post type "page".               |
| cmstypes.translation                | 'translation'            | string   | This value is the key of the post type "translation".        |



#### NPM + Webpack + Babel + Assets

The package has its own `.babelrc`, `package.json`, `postcss.config.js` and `webpack.config.js` files, that you can publish:

- `/assets/src` source assets (your frontend and eventually the admin)
- `/public/assets` bundled assets
- `/public/images/admin` package default admin images
- `/public/images/logo.png` package default logo
- `/.babelrc` Babel configurations
- `/.editorconfig` Editor configurations
- `/.prettierignore` Prettier ignore configurations
- `/.prettierrc` Prettier configurations
- `/package.json` NPM packages
- `/postcss.config.js` PostCSS configurations
- `/webpack.config.js` Webpack configurations

**Web assets only**

You probably want to publish this (if you don't know).

`php artisan vendor:publish --tag=cms.assets.install --force`

- This will publish and override the library, samples, boot and configurations assets.

`php artisan vendor:publish --tag=cms.assets.update --force`

- This will only publish and override the library and samples assets.

**Web and admin assets**

Or, you can choose to publish the web and admin assets if you need to modify the React part of the admin.

`php artisan vendor:publish --tag=cms.assets.admin.install --force`

- This will publish and override the library, samples, boot and configurations assets.

`php artisan vendor:publish --tag=cms.assets.admin.update --force`

- This will only publish and override the library and samples assets.

**Admin bundles only**

Finally, if you want to only publish the pre-bundled admin assets (because they are needed for the main purpose of this package) and keep your current project untouched, you can choose to only publish the admin bundles.

`php artisan vendor:publish --tag=cms.assets.admin.only --force`

**Published assets locations**

The published assets will be located in:

- admin: `assets/src/admin` <- boot for the admin
- sample-admin: `assets/src/sample-admin` <- sample assets for the admin
- sample-react: `assets/src/sample-react` <- sample React assets for web
- sample-tbnt: `assets/src/sample-tbnt` <- sample TBNT assets for web
- sample-vanilla: `assets/src/sample-vanilla` <- sample VanillaJS assets for the admin
- web: `assets/src/web` <- boot for the web

**Bundles locations**

The bundled assets will be located in:

- web: `public/assets/web/bundle.css|js`
- admin: `public/assets/admin/bundle.css|js`

**NPM commands available**

The available npm commands are:

- `npm run dev`
- `npm run watch`
- `npm run prod`



#### API Documentation

The package has an API documentation available at:

`http(s)://your.project/cms/web/api-docs`

*This route will only be available with `APP_ENV=local` to prevent any access in production.*



#### Translations

The package has several files available that you can publish to override the translations:

`php artisan vendor:publish --tag=cms.translations.xxx`

Overridable translations are:

- `app` <- default app values
- `dates` <- date formats (used by PHP)
- `errors` <- platform error messages
- `emails` <- all the emails translations
- `emails.defaults` <- default email translations
- `emails.contact` <- all the emails contact translations
- `emails.contact.contact` <- contact translations send to platform
- `emails.contact.copy` <- contact translations send to user
- `emails.forgot-password` <- forgot password translations
- `modules` <- all the modules translations
- `modules.dates` <- date formats (used by JS)
- `modules.errors` <- logical error messages
- `modules.inputs` <- input translations
- `modules.pagination` <- pagination translations
- `modules.price` <- price translations
- `modules.splash` <- splashcreen translations
- `modules.words` <- words translations
- `pages` <- all the pages translations
- `pages.example` <- example
- `trans` <- all the custom translations
- `trans.example` <- example



#### Views

The package has several files available that you can publish to override the views:

`php artisan vendor:publish --tag=cms.views.xxx`

Overridable views are:

- `web` <- all the web views
- `web.services` <- web services (google analytics/tag manager, facebook pixel)
- `web.includes` <- all the web includes views
- `web.includes.head` <- head part of the html tag (title, description, favicon, ...)
- `web.includes.splash` <- splashcreen/loder or the app
- `compatibility` <- all the compatibilities views
- `compatibility.browsehappy` <- compatibility replacement (lte=ie10)
- `compatibility.nojs` <- compatibility replacement (js disabled)
- `emails` <- all the emails views
- `emails.app` <- all the emails template views
- `emails.app.html` <- default template (html)
- `emails.app.plain` <- default template (plain)
- `emails.contact` <- all the emails contacts views
- `emails.contact.contact` <- all the emails contacts views send to platform
- `emails.contact.contact.html` <- contacts send to platform (html)
- `emails.contact.contact.plain` <- contacts send to platform (plain)
- `emails.contact.copy` <- all the emails contacts views send to user
- `emails.contact.copy.html` <- contacts send to user (html)
- `emails.contact.copy.plain` <- contacts send to user (plain)
- `emails.forgot-password` <- all the emails forgot password views
- `emails.forgot-password.html` <- forgot password (html)
- `emails.forgot-password.plain` <- forgot password (plain)
- `errors` <- all the errors views
- `errors.exception` <- view exceptions/errors response
- `xml` <- all the xml views
- `xml.sitemap` <- the sitemap



#### Commands

The package has several commands available that you can use:

- `php artisan cms:backup-database` <- Create a backup of the database
- `php artisan cms:create-countries-posts` <- Create "country" posts
- `php artisan cms:create-countries-table` <- Create "countries" database
- `php artisan cms:create-default-posts` <- Create default posts
- `php artisan cms:create-user` <- Create user
- `php artisan cms:deploy-cms` <- Deploy CMS (see installation instructions for more information)
- `php artisan cms:migrate` <- Migrate cms posts (usualy used after merging with a branch in git)
- `php artisan cms:migrations` <- Rebuild migrations
- `php artisan cms:mysql-dump` <- Create a backup of the database using mysqldump (may export your db without emoji issues)
- `php artisan cms:set-app-key` <- Set "APP_KEY" in .env/_example
- `php artisan cms:set-app-name` <- Set "APP_NAME" in .env/_example and "name" in package.json
- `php artisan cms:set-laravel-passport` <- Set laravel passport (generate keys, update .env/_example and database)
- `php artisan cms:string-decode` <- Decode string
- `php artisan cms:string-decrypt` <- Decrypt string
- `php artisan cms:string-encode` <- Encode string
- `php artisan cms:string-encrypt` <- Encrypt string
- `php artisan cms:string-hash` <- Hash string
- `php artisan cms:string-table` <- Pluralize string as table name
- `php artisan cms:truncate-posts` <- Truncate all posts tables



## Examples

### Edit `<head>` (favicon, sharing, ...)

To add a favicon in the `<head>`, you must publish the following template:

- `php artisan vendor:publish --tag=cms.views.web.includes.head`

After that, you can edit the default blade template used by the cms.



### Add Web Contact

**1. Add a route**

```php
/* routes/api.php */

<?php

Route::prefix('web')->middleware(['cms.group.api.web'])->group(function () {
    Route::post('/contact', 'ContactController@send');
});
```

**2. Add the contact controller**

```php
/* app/Http/Controllers/ContactController.php */

<?php

namespace App\Http\Controllers;

use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Controllers\Api\Web\ContactController as Contact;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContactController extends BaseController
{
    /**
     * Contact form
     *
     * @param Request $request
     * @return Response
     */
    public function send(Request $request)
    {
        $request->validate([
            'field_1_to_save' => 'required|string',
            'field_2_to_save' => 'required|numeric',
            'field_x_to_save' => 'string',
        ]);

        return app(Contact::class)->send($request, [
            'field_1_to_save',
            'field_2_to_save',
            'field_x_to_save',
        ]);
    }
}
```

**3. Activate config**

*Activated by default, you should have nothing to do, especially if you didn't published the config file.*

Set `cms.contact` to `true` in the `config/cms.php`.



[CHANGELOG.md]: https://bitbucket.org/tbntswiss/cms/src/master/CHANGELOG.md
[UPGRADE.md]: https://bitbucket.org/tbntswiss/cms/src/master/UPGRADE.md

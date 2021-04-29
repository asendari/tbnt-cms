<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Public base folder
    |--------------------------------------------------------------------------
    |
    | This value is the base folder of the public content relative to the
    | index.php file.
    |
    | Default: /
    |
    */

    'public' => env('PROJECT_PUBLIC', '/'),

    /*
    |--------------------------------------------------------------------------
    | Admin base folder
    |--------------------------------------------------------------------------
    |
    | This value is the slug route of the admin panel.
    |
    | Default: /admin
    |
    */

    'admin_base' => env('PROJECT_ADMIN_BASE', '/admin'),

    /*
    |--------------------------------------------------------------------------
    | Auto backup
    |--------------------------------------------------------------------------
    |
    | This value is the auto backup status. If "true", a backup will
    | implicitely be done at different frequencies while using the admin.
    |
    | Default: true
    |
    */

    'auto_backup' => true,

    /*
    |--------------------------------------------------------------------------
    | Sidebar default post
    |--------------------------------------------------------------------------
    |
    | This value is the sidebar default post of the admin panel.
    |
    | Default: null
    |
    */

    'sidebar_default' => null,

    /*
    |--------------------------------------------------------------------------
    | Escaped patterns in routes
    |--------------------------------------------------------------------------
    |
    | This value is the escaped patterns in routes.
    |
    | Default: []
    |
    */

    'escape_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Extra slugs
    |--------------------------------------------------------------------------
    |
    | This value is the extra slugs that should return 200 when quering for an
    | inexisting sub-post-page.
    |
    | Default: []
    |
    */

    'extra_slugs' => [],

    /*
    |--------------------------------------------------------------------------
    | Extra canonicals
    |--------------------------------------------------------------------------
    |
    | This value is the extra canoncials to be added into sitemap.xml.
    |
    | Default: null
    |
    */

    'extra_canonicals' => null,

    /*
    |--------------------------------------------------------------------------
    | Logo location
    |--------------------------------------------------------------------------
    |
    | This value is the location of the website logo relative
    | to 'cms.project.public'.
    |
    | Default: /images/logo.png
    |
    */

    'logo' => '/images/logo.png',

    /*
    |--------------------------------------------------------------------------
    | Meta title suffix
    |--------------------------------------------------------------------------
    |
    | This value is the suffix of the website meta title
    |
    | Default: ' | <app_name>'
    |
    */

    'meta_title_suffix' => ' | ' . app_name(),

    /*
    |--------------------------------------------------------------------------
    | Project Timezone
    |--------------------------------------------------------------------------
    |
    | This value is the default timezone for your project, which
    | will be used to format dates. Instead of 'app.timezone', this value
    | is used with 'to_xxx_tz_string' functions which uses 'set_timezone'
    | internaly that will default to this value.
    |
    | Default: Europe/Zurich
    |
    */

    'timezone' => 'Europe/Zurich',

    /*
    |--------------------------------------------------------------------------
    | Password reset duration
    |--------------------------------------------------------------------------
    |
    | This value is the time in hours of the password reset token validity.
    |
    | Default: 24
    |
    */

    'password_reset_duration' => 24,

    /*
    |--------------------------------------------------------------------------
    | Contact is active
    |--------------------------------------------------------------------------
    |
    | Is this value is set to true, the default contact form will be active.
    |
    | Default: true
    |
    */

    'contact' => true,

    /*
    |--------------------------------------------------------------------------
    | User is active
    |--------------------------------------------------------------------------
    |
    | Is this value is set to true, the 'user' routes and functions will be active.
    |
    | Default: false
    |
    */

    'user' => false,

    /*
    |--------------------------------------------------------------------------
    | Cron is active
    |--------------------------------------------------------------------------
    |
    | Is this value is set to true, the 'cron' routes and functions will be active.
    |
    | Default: false
    |
    */

    'cron' => false,

    /*
    |--------------------------------------------------------------------------
    | Test is active
    |--------------------------------------------------------------------------
    |
    | Is this value is set to true, the 'test' routes and functions will be active.
    |
    | Default: false
    |
    */

    'test' => false,

    /*
    |--------------------------------------------------------------------------
    | Migrations folder
    |--------------------------------------------------------------------------
    |
    | This value is the migrations storage folder under 'storage/app'.
    |
    | Default: migrations
    |
    */

    'migrations' => 'migrations',
];

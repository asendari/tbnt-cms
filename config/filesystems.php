<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    | Supported Drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [
        'migrations' => [
            'driver' => 'local',
            'root' => storage_path('cms/' . config('cms.migrations')),
            'url' => app_url('migrations'),
            'visibility' => 'private',
        ],

        'uploads' => [
            'driver' => 'local',
            'root' => storage_path('cms/' . config('cmsfile.folder')),
            'url' => app_url('uploads'),
            'visibility' => 'private',
        ],

        'google' => [
            'driver' => 'local',
            'root' => storage_path('cms/google'),
            'visibility' => 'private',
        ],
    ],
];

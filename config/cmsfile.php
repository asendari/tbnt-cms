<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Storage folder
    |--------------------------------------------------------------------------
    |
    | This value is the file storage folder under 'storage/app'.
    |
    | Default: uploads
    |
    */

    'folder' => 'uploads',

    /*
    |--------------------------------------------------------------------------
    | Generate UUID instead of original filename
    |--------------------------------------------------------------------------
    |
    | Default: true
    |
    */

    'uuid' => true,

    /*
    |--------------------------------------------------------------------------
    | Generate thumbs
    |--------------------------------------------------------------------------
    |
    | Default: true
    |
    */

    'thumbs' => true,

    /*
    |--------------------------------------------------------------------------
    | File max size
    |--------------------------------------------------------------------------
    |
    | This value is the file max size in kb.
    |
    | Default: 12 * 1024
    |
    */

    'max_size' => 12 * 1024,

    /*
    |--------------------------------------------------------------------------
    | Image max width/height
    |--------------------------------------------------------------------------
    |
    | This value is the image max size in kb.
    |
    | Default: 2 * 1024
    |
    */

    'image_max_size' => 2 * 1024,

    /*
    |--------------------------------------------------------------------------
    | Image max width/height
    |--------------------------------------------------------------------------
    |
    | This value is the image max width/height in px.
    |
    | Default: 2400
    |
    */

    'image_max_width' => 2400,

    /*
    |--------------------------------------------------------------------------
    | Image thumb max width/height
    |--------------------------------------------------------------------------
    |
    | This value is the image thumb max width/height in px.
    |
    | Default: 800
    |
    */

    'thumb_max_width' => 800,

    /*
    |--------------------------------------------------------------------------
    | Image quality
    |--------------------------------------------------------------------------
    |
    | This value is the image quality.
    |
    | Default: 70
    |
    */

    'image_quality' => 70,

    /*
    |--------------------------------------------------------------------------
    | Valid extensions
    |--------------------------------------------------------------------------
    |
    | This value is the valid extensions that pass the middleware validation.
    |
    | Default: json,pdf,ppt,pptx,doc,docx,xls,xlsx,webm,webp,avi,mov,wmv,mp4,mp3,wav,ico,jpg,jpeg,png,gif,svg,woff,woff2,eot,otf,ttf
    |
    */

    'valid_extensions' =>
        'json,pdf,ppt,pptx,doc,docx,xls,xlsx,webm,webp,avi,mov,wmv,mp4,mp3,wav,ico,jpg,jpeg,png,gif,svg,woff,woff2,eot,otf,ttf',
];

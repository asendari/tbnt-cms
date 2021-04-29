<?php

namespace Tbnt\Cms\Model;

use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid as UuidTrait;

/**
 * Tbnt\Cms\Model\BaseAuthenticableUuid
 */
class BaseAuthenticableUuid extends BaseAuthenticable
{
    use UuidTrait;

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];
}

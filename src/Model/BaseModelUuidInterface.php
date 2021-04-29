<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;

interface BaseModelUuidInterface
{
    /**
     * Scope "migratable"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeMigratable($query);

    /**
     * Return the migration status.
     *
     * @return bool
     */
    public function isMigratable();
}

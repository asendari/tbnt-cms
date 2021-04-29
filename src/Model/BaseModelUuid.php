<?php

namespace Tbnt\Cms\Model;

use Exception;
use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid as UuidTrait;
use Illuminate\Database\Eloquent\Builder;
use Tbnt\Cms\Model\Vendor\QueryBuilderUnsafe;

/**
 * Tbnt\Cms\Model\BaseModelUuid
 *
 * @property string $id
 * @property int $batch
 * @method static Builder|BaseModelUuid migratable()
 */
class BaseModelUuid extends BaseModel implements BaseModelUuidInterface
{
    use UuidTrait {
        generateUuid as protected generateUuidTrait;
    }

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

    /**
     * Is the post query builder unsafe.
     *
     * @var bool
     */
    protected static $unsafe = false;

    /**
     * @return string
     * @throws Exception
     */
    protected function generateUuid()
    {
        return $this->generateUuidTrait();
    }

    /**
     * DANGEROUS:
     * Set this to true to skip bindings of any 'id' or 'post_xxx_id' columns.
     *
     * @param bool $unsafe
     * @return void
     */
    public static function setUnsafe($unsafe = true)
    {
        // Empty request inputs because of the unsafe state
        request()->merge(
            array_map(function () {
                return null;
            }, request()->all())
        );

        // Set unsafe
        static::$unsafe = $unsafe;
    }

    /**
     * Get a new query builder instance for the connection.
     *
     * @return \Illuminate\Database\Query\Builder|QueryBuilderUnsafe
     */
    protected function newBaseQueryBuilder()
    {
        if (!static::$unsafe) {
            return parent::newBaseQueryBuilder();
        }

        $connection = $this->getConnection();

        return new QueryBuilderUnsafe($connection, $connection->getQueryGrammar(), $connection->getPostProcessor());
    }

    /**
     * Scope "migratable"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeMigratable($query)
    {
        return $query->where('id', '');
    }

    /**
     * Return the migration status.
     *
     * @return bool
     */
    public function isMigratable()
    {
        return false;
    }

    /**
     * Update batch.
     *
     * @return void
     */
    public function updateBatch()
    {
        if (!$this->batch) {
            $this->update(['batch' => static::max('batch') + 1]);
            $this->refresh();
        }
    }
}

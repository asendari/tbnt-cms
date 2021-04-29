<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;

/**
 * Tbnt\Cms\Model\Country
 *
 * @method static Builder|Country isActive($is_active = true)
 * @method static Builder|Country isOrdered($order)
 */
class Country extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'countries';

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast to native types
     *
     * Possible values:
     * integer, real, float, double, string, boolean, object, array, collection, date, datetime, timestamp
     *
     * @var array
     */
    protected $casts = [
        'tva' => 'float',
        'is_active' => 'boolean',
    ];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "isActive"
     *
     * @param Builder|static $query
     * @param bool $is_active Is active
     * @return Builder|static
     */
    public function scopeIsActive($query, $is_active = true)
    {
        return $query->where($this->tableCol('is_active'), intval($is_active));
    }

    /**
     * Scope "isOrdered"
     *
     * @param Builder|static $query
     * @param string $order Order
     * @return Builder|static
     */
    public function scopeIsOrdered($query, string $order)
    {
        if (!$order) {
            return $query;
        }

        $order_type = explode('-', $order)[0];
        $order_direction = intval(explode('-', $order)[1] ?? 0) === 0 ? 'ASC' : 'DESC';

        return $query->orderBy($this->tableCol($order_type), $order_direction);
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Update is active
     *
     * @param int|bool $is_active Is active
     * @return void
     */
    public function setActive($is_active)
    {
        $this->updateEntry('is_active', intval($is_active));
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, ['tva']);
    }
}

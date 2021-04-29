<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\HasLangTrait;

/**
 * Tbnt\Cms\Model\PostType
 *
 * @property string $id
 * @property string $type
 * @property string $label
 * @property \Illuminate\Support\Collection|null $data
 * @property int $mode
 * @property bool $has_key
 * @property bool $is_page
 * @property bool $is_loaded
 * @property bool $is_lazy
 * @property bool $is_active
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read PostTypeLang $default_lang
 * @property-read PostTypeLang $display_lang
 * @property-read PostTypeLang $lang
 * @property-read Collection|PostTypeItem[] $post_type_items
 * @property-read int|null $post_type_items_count
 * @property-read Collection|PostType[] $post_type_plugins
 * @property-read int|null $post_type_plugins_count
 * @property-read Collection|Post[] $posts
 * @property-read int|null $posts_count
 * @property-read Collection|PostTypeLang[] $trans
 * @property-read int|null $trans_count
 * @method static Builder|PostType hasKey($key)
 * @method static Builder|PostType hasTrans($key, $value)
 * @method static Builder|PostType isActive($is_active = true)
 * @method static Builder|PostType isKey($has_key = true)
 * @method static Builder|PostType isLazy($is_lazy = true)
 * @method static Builder|PostType isLoaded($is_loaded = true)
 * @method static Builder|PostType isMode($mode)
 * @method static Builder|PostType isOrdered($order)
 * @method static Builder|PostType isPage($is_page = true)
 * @method static Builder|PostType isType($type)
 * @method static Builder|PostType isValid()
 * @method static Builder|PostType searchTrans($fields, $searches, $multiple = true)
 * @method static Builder|PostType whereBatch($value)
 * @method static Builder|PostType whereCreatedAt($value)
 * @method static Builder|PostType whereData($value)
 * @method static Builder|PostType whereDeletedAt($value)
 * @method static Builder|PostType whereHasKey($value)
 * @method static Builder|PostType whereId($value)
 * @method static Builder|PostType whereIsActive($value)
 * @method static Builder|PostType whereIsLazy($value)
 * @method static Builder|PostType whereIsLoaded($value)
 * @method static Builder|PostType whereIsPage($value)
 * @method static Builder|PostType whereLabel($value)
 * @method static Builder|PostType whereMode($value)
 * @method static Builder|PostType whereType($value)
 * @method static Builder|PostType whereUpdatedAt($value)
 */
class PostType extends BaseModelPost
{
    use HasLangTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_types';

    /**
     * The attributes that should be cast to native types
     *
     * Possible values:
     * integer, real, float, double, string, boolean, object, array, collection, date, datetime, timestamp
     *
     * @var array
     */
    protected $casts = [
        'data' => 'collection',
        'has_key' => 'boolean',
        'is_page' => 'boolean',
        'is_loaded' => 'boolean',
        'is_lazy' => 'boolean',
        'is_active' => 'boolean',
    ];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "migratable"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeMigratable($query)
    {
        return $query;
    }

    /**
     * Scope "isType"
     *
     * @param Builder|static $query
     * @param int|string|array $type Type
     * @return Builder|static
     */
    public function scopeIsType($query, $type)
    {
        return $query->keyId($type, 'type', 'id');
    }

    /**
     * Scope "isMode"
     *
     * @param Builder|static $query
     * @param int|array $mode Mode
     * @return Builder|static
     */
    public function scopeIsMode($query, $mode)
    {
        return $query->within($mode, 'mode');
    }

    /**
     * Scope "isKey"
     *
     * @param Builder|static $query
     * @param bool $has_key Has key
     * @return Builder|static
     */
    public function scopeIsKey($query, $has_key = true)
    {
        return $query->where($this->tableCol('has_key'), intval($has_key));
    }

    /**
     * Scope "isPage"
     *
     * @param Builder|static $query
     * @param bool $is_page Is page
     * @return Builder|static
     */
    public function scopeIsPage($query, $is_page = true)
    {
        return $query->where($this->tableCol('is_page'), intval($is_page));
    }

    /**
     * Scope "isLoaded"
     *
     * @param Builder|static $query
     * @param bool $is_loaded Is loaded
     * @return Builder|static
     */
    public function scopeIsLoaded($query, $is_loaded = true)
    {
        return $query->where($this->tableCol('is_loaded'), intval($is_loaded));
    }

    /**
     * Scope "isLazy"
     *
     * @param Builder|static $query
     * @param bool $is_lazy Is lazy
     * @return Builder|static
     */
    public function scopeIsLazy($query, $is_lazy = true)
    {
        return $query->where($this->tableCol('is_lazy'), intval($is_lazy));
    }

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

    /**
     * Scope "hasKey"
     *
     * @param Builder|static $query
     * @param string|array $key Key
     * @return Builder|static
     */
    public function scopeHasKey($query, $key)
    {
        return $query->whereHas('post_type_items', function ($query) use ($key) {
            return $query->isKey($key);
        });
    }

    /**
     * Scope "isValid"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsValid($query)
    {
        return $query->isActive();
    }

    /****************************************************************
     * Accessors
     ***************************************************************/

    /**
     * Access "label" attribute
     *
     * @param string $value Value
     * @return string
     */
    public function getLabelAttribute(string $value)
    {
        return ucfirst(str_replace('-', ' ', str()->kebab(trim($value ?: $this->attributes['type']))));
    }

    /****************************************************************
     * Mutators
     ***************************************************************/

    /**
     * Set "type" attribute
     *
     * @param string $value
     * @return void
     */
    public function setTypeAttribute(string $value)
    {
        $this->attributes['type'] = str()->slug($value);
    }

    /**
     * Set "data" attribute
     *
     * @param mixed $value
     * @return void
     */
    public function setDataAttribute($value)
    {
        $this->attributes['data'] = $value ? json_encode($value) : null;
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Posts relations
     *
     * @return HasMany|Collection|Post[]
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'post_type_id', 'id');
    }

    /**
     * Post type items relations
     *
     * @return HasMany|Collection|PostTypeItem[]
     */
    public function post_type_items()
    {
        return $this->hasMany(PostTypeItem::class, 'post_type_id', 'id');
    }

    /**
     * Post type items relations (recursive)
     *
     * @return HasMany|Collection|PostTypeItem[]
     */
    public function post_type_items_recursive()
    {
        return $this->post_type_items()
            ->whereNull('post_type_item_id')
            ->with([
                'post_type_item_conditions.post_type_item_value',
                'post_type_item_restrictions',
                'post_type_items_recursive',
            ]);
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Return the migration status.
     *
     * @return bool
     */
    public function isMigratable()
    {
        return true;
    }

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
        $this->updateEntries($data, ['label', 'type', 'mode', 'has_key', 'is_page', 'is_loaded']);

        if (isset($data['config']) === true && is_array($data['config']) === true) {
            $this->updateConfig($data['config']);
        }
        if (isset($data['items']) === true && is_array($data['items']) === true) {
            $this->updateItems($data['items']);
        }
    }

    /**
     * Update data config
     *
     * @param array $data Data
     * @return void
     */
    public function updateConfig(array $data)
    {
        if (isset($data['modes']) === true && count($data['modes']) === 0) {
            unset($data['modes']);
        }
        if (isset($data['required']) === true && count($data['required']) === 0) {
            unset($data['required']);
        }
        if (isset($data['override']) === true && count($data['override']) === 0) {
            unset($data['override']);
        }

        $this->updateEntry('data', $data);

        if (isset($data['override']) === true && count($data['override']) !== 0) {
            array_map(function ($lang_code) {
                return $this->posts->each(function ($p) use ($lang_code) {
                    $p->updateData(['lang_code' => $lang_code]);
                });
            }, lang()->allCodes());
        }
    }

    /**
     * Update items
     *
     * @param array $data Items
     * @return void
     */
    public function updateItems(array $data)
    {
        $post_items_ids = [];

        $process_ids = function ($data) use (&$post_items_ids, &$process_ids) {
            foreach ($data as $item) {
                array_push($post_items_ids, $item['id']);
                $process_ids($item['items']);
            }
        };

        $process_ids($data);

        if (count($post_items_ids) !== 0) {
            $this->post_type_items()
                ->whereNotIn('id', $post_items_ids)
                ->get()
                ->each(function ($p) {
                    $p->delete();
                });
        }

        foreach ($data as $position => $item) {
            $this->updateItem($item, $position);
        }
    }

    /**
     * Update item
     *
     * @param array $item Item
     * @param int $position Item position
     * @param static|null $parent Item parent
     * @return void
     */
    private function updateItem(array $item, int $position, $parent = null)
    {
        $post_item = $this->post_type_items()->find(arr()->get($item, 'id'));

        if ($post_item === null) {
            $post_item = $this->post_type_items()->create();
        }

        $post_item->updateData(
            array_merge(arr()->except($item, ['id']), [
                'position' => $position,
                'post_type_item_id' => optional($parent)->id,
            ])
        );

        foreach (arr()->get($item, 'items') as $sub_position => $sub_item) {
            $this->updateItem($sub_item, $sub_position, $post_item);
        }
    }
}

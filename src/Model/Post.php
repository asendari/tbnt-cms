<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\HasLangTrait;

/**
 * Tbnt\Cms\Model\Post
 *
 * @property string $id
 * @property string|null $post_id
 * @property string|null $post_type_id
 * @property string|null $key
 * @property string|null $reference
 * @property \Illuminate\Support\Collection|null $data
 * @property int $position
 * @property bool $is_indexable
 * @property bool $is_visible
 * @property bool $is_active
 * @property Carbon|null $visible_at
 * @property Carbon|null $hidden_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read array $canonical
 * @property-read \Illuminate\Support\Collection $combined_data
 * @property-read PostLang $default_lang
 * @property-read PostLang $display_lang
 * @property-read array $formatted_items
 * @property-read PostLang $lang
 * @property-read array $published_at
 * @property-read Post|null $post
 * @property-read Post|null $post_recursive
 * @property-read Collection|PostItem[] $post_items
 * @property-read Collection|PostItem[] $post_items_recursive
 * @property-read int|null $post_items_count
 * @property-read Collection|PostType[] $post_plugins
 * @property-read int|null $post_plugins_count
 * @property-read PostType|null $post_type
 * @property-read Collection|PostTypeItemRestriction[] $post_type_item_restrictions
 * @property-read int|null $post_type_item_restrictions_count
 * @property-read Collection|Post[] $posts
 * @property-read int|null $posts_count
 * @property-read Collection|PostLang[] $trans
 * @property-read int|null $trans_count
 * @method static Builder|Post findByPath($path)
 * @method static Builder|Post hasKeyValue($key, $value)
 * @method static Builder|Post hasTrans($key, $value)
 * @method static Builder|Post isActive($is_active = true)
 * @method static Builder|Post isIndexable($is_indexable = true)
 * @method static Builder|Post isKey($key)
 * @method static Builder|Post isLazy($is_lazy = true)
 * @method static Builder|Post isLoaded($is_loaded = true)
 * @method static Builder|Post isOrdered($order)
 * @method static Builder|Post isPage($is_page = true)
 * @method static Builder|Post isPostId($post_id)
 * @method static Builder|Post isPostTypeId($post_type_id)
 * @method static Builder|Post isPostTypeValid()
 * @method static Builder|Post isType($type)
 * @method static Builder|Post isValid()
 * @method static Builder|Post isValidPage()
 * @method static Builder|Post isValidPageIndexable()
 * @method static Builder|Post isValidPageVisible()
 * @method static Builder|Post isVisible($is_visible = true)
 * @method static Builder|Post isVisibleAt($visible_at = null, $before = true)
 * @method static Builder|Post searchKeyValues($key, $searches, $multiple = true)
 * @method static Builder|Post searchKeysValues($keys, $searches, $multiple = true)
 * @method static Builder|Post searchTrans($fields, $searches, $multiple = true)
 * @method static Builder|Post whereBatch($value)
 * @method static Builder|Post whereCreatedAt($value)
 * @method static Builder|Post whereData($value)
 * @method static Builder|Post whereDeletedAt($value)
 * @method static Builder|Post whereHiddenAt($value)
 * @method static Builder|Post whereId($value)
 * @method static Builder|Post whereIsActive($value)
 * @method static Builder|Post whereIsIndexable($value)
 * @method static Builder|Post whereIsVisible($value)
 * @method static Builder|Post whereKey($value)
 * @method static Builder|Post wherePosition($value)
 * @method static Builder|Post wherePostId($value)
 * @method static Builder|Post wherePostTypeId($value)
 * @method static Builder|Post whereReference($value)
 * @method static Builder|Post whereUpdatedAt($value)
 * @method static Builder|Post whereVisibleAt($value)
 * @method static Builder|Post with($relations)
 */
class Post extends BaseModelPost
{
    use HasLangTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'posts';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['visible_at', 'hidden_at'];

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
        'is_indexable' => 'boolean',
        'is_visible' => 'boolean',
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
        return $query->whereHas('post_type', function ($query) {
            return $query->isKey(true);
        });
    }

    /**
     * Scope "isPostId"
     *
     * @param Builder|static $query
     * @param string|null $post_id Post id (parent)
     * @return Builder|static
     */
    public function scopeIsPostId($query, $post_id = null)
    {
        return $query->where($this->tableCol('post_id'), $post_id);
    }

    /**
     * Scope "isPostTypeId"
     *
     * @param Builder|static $query
     * @param string $post_type_id Post type id
     * @return Builder|static
     */
    public function scopeIsPostTypeId($query, string $post_type_id)
    {
        return $query->where($this->tableCol('post_type_id'), $post_type_id);
    }

    /**
     * Scope "isKey"
     *
     * @param Builder|static $query
     * @param string|array $key Key
     * @return Builder|static
     */
    public function scopeIsKey($query, $key)
    {
        return $query->withinKey($key, 'key');
    }

    /**
     * Scope "isIndexable"
     *
     * @param Builder|static $query
     * @param bool $is_indexable Is indexable
     * @return Builder|static
     */
    public function scopeIsIndexable($query, $is_indexable = true)
    {
        return $query->where($this->tableCol('is_indexable'), intval($is_indexable));
    }

    /**
     * Scope "isVisible"
     *
     * @param Builder|static $query
     * @param bool $is_visible Is visible
     * @return Builder|static
     */
    public function scopeIsVisible($query, $is_visible = true)
    {
        return $query->where($this->tableCol('is_visible'), intval($is_visible));
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
     * Scope "isVisibleAt"
     *
     * @param Builder|static $query
     * @param string|null $visible_at Visible at
     * @param bool $before Visible before
     * @return Builder|static
     */
    public function scopeIsVisibleAt($query, $visible_at = null, $before = true)
    {
        $table_name = $this->getTable();

        return $query->whereRaw(
            '(CASE WHEN ISNULL(`' .
                $table_name .
                '`.`visible_at`) THEN `' .
                $table_name .
                '`.`created_at` ELSE `' .
                $table_name .
                '`.`visible_at` END ' .
                ($before === true ? '<=' : '>') .
                ' "' .
                to_datetime_utc_string($visible_at ?: now()) .
                '")
			AND (`' .
                $table_name .
                '`.`hidden_at` IS NULL OR `' .
                $table_name .
                '`.`hidden_at` > "' .
                to_datetime_utc_string($visible_at ?: now()) .
                '")'
        );
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

        if ($order_type === 'visible_at') {
            $table_name = $this->getTable();

            return $query->orderByRaw(
                'CASE WHEN ISNULL(`' .
                    $table_name .
                    '`.`visible_at`) THEN `' .
                    $table_name .
                    '`.`created_at` ELSE `' .
                    $table_name .
                    '`.`visible_at` END ' .
                    $order_direction
            );
        } elseif ($order_type === 'name') {
            return $query
                ->join('post_langs AS order_post_langs', function ($join) {
                    $join->on('posts.id', '=', 'order_post_langs.post_id')->where(function ($query) {
                        $query->where('order_post_langs.lang_id', '=', lang()->getDefaultId());
                    });
                })
                ->orderBy('order_post_langs.title', $order_direction)
                ->select($this->tableCol('*'));
        }

        return $query->orderBy($this->tableCol($order_type), $order_direction);
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
        return $query->whereHas('post_type', function ($query) use ($is_page) {
            return $query->isPage($is_page);
        });
    }

    /**
     * Scope "isLoaded"
     *
     * @param Builder|static $query
     * @param bool $is_loaded Is loaded
     * @return void
     */
    public function scopeIsLoaded($query, $is_loaded = true)
    {
        $query->whereHas('post_type', function ($query) use ($is_loaded) {
            return $query->isLoaded($is_loaded);
        });
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
        return $query->whereHas('post_type', function ($query) use ($is_lazy) {
            return $query->isLazy($is_lazy);
        });
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
        return $query->whereHas('post_type', function ($query) use ($type) {
            return $query->isType($type);
        });
    }

    /**
     * Scope "isPostTypeValid"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsPostTypeValid($query)
    {
        return $query->whereHas('post_type', function ($query) {
            return $query->isValid();
        });
    }

    /**
     * Scope "hasKeyValue"
     *
     * @param Builder|static $query
     * @param string|array $key Key
     * @param string $value Value
     * @return Builder|static
     */
    public function scopeHasKeyValue($query, $key, string $value)
    {
        return $query->whereHas('post_items', function ($query) use ($key, $value) {
            return $query->hasKeyValue($key, $value);
        });
    }

    /**
     * Scope "searchKeyValues"
     *
     * @param Builder|static $query
     * @param string|array $key Key
     * @param string|array $searches Searches
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearchKeyValues($query, $key, $searches, $multiple = true)
    {
        return $query->whereHas('post_items', function ($query) use ($key, $searches, $multiple) {
            return $query->searchKeyValues($key, $searches, $multiple);
        });
    }

    /**
     * Scope "searchKeysValues"
     *
     * @param Builder|static $query
     * @param string|array $keys Keys
     * @param string|array $searches Searches
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearchKeysValues($query, $keys, $searches, $multiple = true)
    {
        return $query->whereHas('post_items', function ($query) use ($keys, $searches, $multiple) {
            return $query->searchKeysValues($keys, $searches, $multiple);
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
        return $query
            ->isPostTypeValid()
            ->isActive()
            ->isVisibleAt();
    }

    /**
     * Scope "isValidPage"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsValidPage($query)
    {
        return $query->isValid()->isPage();
    }

    /**
     * Scope "isValidPageVisible"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsValidPageVisible($query)
    {
        return $query->isValidPage()->isVisible();
    }

    /**
     * Scope "isValidPageIndexable"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsValidPageIndexable($query)
    {
        return $query->isValidPage()->isIndexable();
    }

    /**
     * Scope "findByPath"
     *
     * @param Builder|static $query
     * @param string $path Path
     * @return Builder|static
     */
    public function scopeFindByPath($query, string $path)
    {
        $path_parts = ($path ?: '/') === '/' ? ['/'] : collect(explode('/', trim($path, '/')));

        $query_post = null;
        $found_post = null;

        foreach ($path_parts as $part) {
            $query_post = (clone $query)
                ->isPage()
                ->isPostId($found_post ? $found_post->id : null)
                ->hasTrans('url', $part);

            $post = $query_post->first();

            if (($found_post = $post) === null) {
                return $query->where('id', null);
            }
        }

        return $query_post;
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Get "published_at" attribute
     *
     * @return string
     */
    public function getPublishedAtAttribute()
    {
        return $this->visible_at ?: $this->created_at;
    }

    /**
     * Get "combined_data" attribute
     *
     * @return \Illuminate\Support\Collection
     */
    public function getCombinedDataAttribute()
    {
        return $this->post_type->data->merge($this->data);
    }

    /**
     * Get "canonical" attribute
     *
     * @return array
     */
    public function getCanonicalAttribute()
    {
        $urls = [];

        $lang_default_id = lang()->getDefaultId();
        $lang_current_id = lang()->getCurrentId();
        $lang_can_be_empty = lang()->canBeEmpty();

        $post_canonical = optional($this->post_recursive)->canonical;
        $trans = $this->trans;

        foreach (lang()->all() as $lang) {
            $lang_id = $lang->id;
            $lang_code = $lang->code;

            $can_be_empty = $lang_can_be_empty === true && $lang_id === $lang_default_id;
            $post_canonical_lang = $post_canonical ? ($post_canonical[$lang_code] ?? null ?: '') : '';

            $urls[$lang_code] = make_url([
                $can_be_empty === true ? '' : $lang_code,
                $post_canonical !== null
                    ? trim($can_be_empty ? $post_canonical_lang : ltrim($post_canonical_lang, $lang_code), '/')
                    : '',
                isset($urls[$lang_code]) === true
                    ? $urls[$lang_code]
                    : optional($trans->firstWhere('lang_id', $lang_current_id) ?: $trans->firstWhere('lang_id', $lang_default_id))
                        ->url,
            ]);
        }

        return $urls;
    }

    /****************************************************************
     * Mutators
     ***************************************************************/

    /**
     * Set "key" attribute
     *
     * @param string $value
     * @return void
     */
    public function setKeyAttribute(string $value)
    {
        $this->attributes['key'] = str()->slug($value);
    }

    /**
     * Set "data" attribute
     *
     * @param mixed $value
     * @return void
     */
    public function setDataAttribute($value)
    {
        $this->attributes['data'] = $value ? json_encode($value) : '';
    }

    /**
     * Set "visible_at" attribute
     *
     * @param string $value
     * @return void
     */
    public function setVisibleAtAttribute(string $value)
    {
        $this->attributes['visible_at'] = to_datetime_utc_string($value);
    }

    /**
     * Set "hidden_at" attribute
     *
     * @param string $value
     * @return void
     */
    public function setHiddenAtAttribute(string $value)
    {
        $this->attributes['hidden_at'] = to_datetime_utc_string($value);
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Parent post relation
     *
     * @return BelongsTo|static
     */
    public function post()
    {
        return $this->belongsTo(static::class, 'post_id', 'id');
    }

    /**
     * Parent post relation (recursive)
     *
     * @return BelongsTo|static
     */
    public function post_recursive()
    {
        return $this->post()->with(['trans', 'post_type', 'post_recursive']);
    }

    /**
     * Posts relations
     *
     * @return HasMany|Collection|static[]
     */
    public function posts()
    {
        return $this->hasMany(static::class, 'post_id', 'id');
    }

    /**
     * Post type relation
     *
     * @return BelongsTo|PostType
     */
    public function post_type()
    {
        return $this->belongsTo(PostType::class, 'post_type_id', 'id');
    }

    /**
     * Post type item restrictions relations
     *
     * @return HasMany|Collection|PostTypeItemRestriction[]
     */
    public function post_type_item_restrictions()
    {
        return $this->hasMany(PostTypeItemRestriction::class, 'post_id', 'id');
    }

    /**
     * Post items relations
     *
     * @return HasMany|Collection|PostItem[]
     */
    public function post_items()
    {
        return $this->hasMany(PostItem::class, 'post_id', 'id');
    }

    /**
     * Post items relations (recursive)
     *
     * @return HasMany|Collection|PostItem[]
     */
    public function post_items_recursive()
    {
        return $this->post_items()
            ->whereNull('post_item_id')
            ->with(['file', 'trans.file', 'post_type_item', 'post_items_recursive']);
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
        return $this->post_type->is_lazy;
    }

    /**
     * Get uploads directory
     *
     * @return string
     */
    public function getUploadDir()
    {
        return 'posts/' . $this->id;
    }

    /**
     * Update post type id
     *
     * @param string $post_type_id Parent post type id
     * @return void
     */
    public function setPostTypeId(string $post_type_id)
    {
        $this->updateEntry('post_type_id', $post_type_id);

        $this->reload(['post_type']);
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
        $post_data_override = $this->combined_data->get('override', []);
        $post_data_superadmin =
            (auth()->user()->profile->is_superadmin ?? false) === true
                ? []
                : array_keys(
                    array_filter($this->combined_data->get('modes', []), function ($mode) {
                        return $mode < 2;
                    })
                );

        foreach ($post_data_override as $key => $value) {
            data_set($data, $key, $value);
        }

        foreach ($post_data_superadmin as $key) {
            arr()->forget($data, $key);
        }

        if (isset($data['post_id']) === true) {
            $data['post_id'] = $data['post_id'] ?: null;
        }

        $this->updateEntries($data, [
            'post_id',
            'key',
            'reference',
            'is_indexable',
            'is_visible',
            'position',
            'visible_at',
            'hidden_at',
        ]);

        if (isset($data['config']) === true && is_array($data['config']) === true) {
            $this->updateConfig($data['config']);
        }

        if (isset($data['lang_code']) === true) {
            if ($this->post_type->is_page === true) {
                $this->updateTrans($data);
            }

            if (isset($data['fields']) === true && is_array($data['fields']) === true) {
                $this->updateItems($data['fields'], $data['lang_code']);
            }
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

        $this->updateEntry('data', $data);
    }

    /**
     * Update items
     *
     * @param array $data Items
     * @param string $lang_code Lang code
     * @return void
     */
    public function updateItems(array $data, string $lang_code)
    {
        $fields = collect();

        foreach ($data as $field) {
            $fields = $fields->merge($this->updateItem($field, $lang_code));
        }

        $fields_ids = $fields->pluck('id');

        $superadmin_ids = collect();

        if ((auth()->user()->profile->is_superadmin ?? false) === false) {
            $sub_items_superadmin_ids = function ($items) use (&$sub_items_superadmin_ids, &$superadmin_ids) {
                $superadmin_ids = $superadmin_ids->merge($items->pluck('id'));

                foreach ($items as $item) {
                    $sub_items_superadmin_ids($item->post_type_items);
                }
            };

            $sub_items_superadmin_ids(
                $this->post_type
                    ->post_type_items()
                    ->where('mode', 0)
                    ->get()
            );
        }

        if ($superadmin_ids->count() !== 0) {
            $fields_ids = $this->post_items()
                ->whereIn('post_type_item_id', $superadmin_ids->toArray())
                ->pluck('id')
                ->merge($fields_ids);
        }

        if ($fields_ids->count() !== 0) {
            $this->post_items()
                ->whereNotIn('id', $fields_ids->toArray())
                ->get()
                ->each(function ($p) {
                    $p->delete();
                });
        }

        $clean_fields_ids = $this->post_type
            ->post_type_items()
            ->get()
            ->pluck('id');

        if ($clean_fields_ids->count() !== 0) {
            $this->post_items()
                ->whereNotIn('post_type_item_id', $clean_fields_ids->toArray())
                ->get()
                ->each(function ($p) {
                    $p->delete();
                });
        }
    }

    /**
     * Update item
     *
     * @param array $field Item
     * @param string $lang_code Lang code
     * @param PostItem|null $parent
     * @return \Illuminate\Support\Collection
     */
    private function updateItem(array $field, string $lang_code, $parent = null)
    {
        $fields = collect();

        if (
            isset($field['post_type_item_id']) === false ||
            ($post_type_item = $this->post_type->post_type_items()->find($field['post_type_item_id'])) === null
        ) {
            return $fields;
        } elseif ($post_type_item->type === 'group') {
            $post_item = $this->updateFieldValue($field, null, 0, $lang_code, $parent);

            $fields->push($post_item);

            foreach ($field['items'] ?? [] as $field_value) {
                $fields = $fields->merge($this->updateItem($field_value, $lang_code, $post_item));
            }
        } elseif ($post_type_item->type === 'rows') {
            foreach ($field['value'] ?? [] as $row_position => $row) {
                $post_item = $this->updateFieldValue($row, null, $row_position, $lang_code, $parent);

                $fields->push($post_item);

                foreach ($row['items'] ?? [] as $field_value) {
                    $fields = $fields->merge($this->updateItem($field_value, $lang_code, $post_item));
                }
            }
        } elseif ($post_type_item->type === 'empty') {
            return $fields;
        } else {
            $type = $post_type_item->type === 'post' ? $post_type_item->data->type : $post_type_item->type;

            $value = $field['value'] ?? null;

            if (in_array($type, ['checkbox', 'selectmultiple']) === true) {
                $value = json_encode(to_array($value));
            }

            $fields->push($this->updateFieldValue($field, $value, 0, $lang_code, $parent));
        }

        return $fields;
    }

    /**
     * Update item
     *
     * @param array $field Item
     * @param mixed $value Item value
     * @param int $position Item position
     * @param string $lang_code Lang code
     * @param PostItem|null $parent
     * @return PostItem
     */
    public function updateFieldValue(array $field, $value, int $position, string $lang_code, $parent = null)
    {
        $post_item = $this->post_items()->find($field['id']);

        if ($post_item === null) {
            $post_item = $this->post_items()->create([
                'post_item_id' => optional($parent)->id,
                'post_type_item_id' => $field['post_type_item_id'],
            ]);
        }

        $post_item->updateData(['value' => $value, 'position' => $position, 'lang_code' => $lang_code]);

        return $post_item;
    }

    /**
     * Update media
     *
     * @param array $data Data
     * @return void
     */
    public function updateMedia(array $data)
    {
        foreach ($data['media'] ?? [] as $post_item_id => $value) {
            $post_item = $this->post_items()->find($post_item_id);

            if ($post_item) {
                $post_item->updateData([
                    'value' => $value,
                    'lang_code' => $data['lang_code'],
                ]);
            }
        }
    }
}

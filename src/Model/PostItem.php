<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\HasFileTrait;
use Tbnt\Cms\Model\Traits\HasLangTrait;

/**
 * Tbnt\Cms\Model\PostItem
 *
 * @property string $id
 * @property string|null $post_id
 * @property string|null $post_item_id
 * @property string|null $post_type_item_id
 * @property string|null $value
 * @property int $position
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read File|null $file
 * @property-read PostItemLang $default_lang
 * @property-read PostItemLang $display_lang
 * @property-read mixed $formatted_value
 * @property-read Collection|mixed[] $formatted_trans
 * @property-read PostItemLang $lang
 * @property-read string $value_type
 * @property-read Post|null $post
 * @property-read PostItem|null $post_item
 * @property-read Collection|PostItem[] $post_items
 * @property-read Collection|PostItem[] $post_items_recursive
 * @property-read int|null $post_items_count
 * @property-read PostTypeItem|null $post_type_item
 * @property-read Collection|PostItemLang[] $trans
 * @property-read int|null $trans_count
 * @method static Builder|PostItem hasKey($key)
 * @method static Builder|PostItem hasKeyValue($key, $value)
 * @method static Builder|PostItem hasTrans($key, $value)
 * @method static Builder|PostItem isPostId($post_id)
 * @method static Builder|PostItem isPostItemId($post_item_id)
 * @method static Builder|PostItem isPostTypeItemId($post_type_item_id)
 * @method static Builder|PostItem isTranslatable($is_translatable = true)
 * @method static Builder|PostItem isType($type)
 * @method static Builder|PostItem isValue($value)
 * @method static Builder|PostItem searchKeyValues($key, $searches, $multiple = true)
 * @method static Builder|PostItem searchKeysValues($keys, $searches, $multiple = true)
 * @method static Builder|PostItem searchTrans($fields, $searches, $multiple = true)
 * @method static Builder|PostItem whereBatch($value)
 * @method static Builder|PostItem whereCreatedAt($value)
 * @method static Builder|PostItem whereDeletedAt($value)
 * @method static Builder|PostItem whereId($value)
 * @method static Builder|PostItem wherePosition($value)
 * @method static Builder|PostItem wherePostId($value)
 * @method static Builder|PostItem wherePostItemId($value)
 * @method static Builder|PostItem wherePostTypeItemId($value)
 * @method static Builder|PostItem whereUpdatedAt($value)
 * @method static Builder|PostItem whereValue($value)
 */
class PostItem extends BaseModelPost
{
    use HasLangTrait, HasFileTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_items';

    /**
     * The "booting" method of the model
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        // Global scope "orderPosition"
        static::addGlobalScope('orderPosition', function (Builder $builder) {
            $builder->orderBy((new static())->tableCol('position'), 'ASC');
        });
    }

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
        return $query->whereHas('post', function ($query) {
            return $query->migratable();
        });
    }

    /**
     * Scope "isPostId"
     *
     * @param Builder|static $query
     * @param string $post_id Post id
     * @return Builder|static
     */
    public function scopeIsPostId($query, string $post_id)
    {
        return $query->where($this->tableCol('post_id'), $post_id);
    }

    /**
     * Scope "isPostItemId"
     *
     * @param Builder|static $query
     * @param string $post_item_id Post item id (parent)
     * @return Builder|static
     */
    public function scopeIsPostItemId($query, string $post_item_id)
    {
        return $query->where($this->tableCol('post_item_id'), $post_item_id);
    }

    /**
     * Scope "isPostTypeItemId"
     *
     * @param Builder|static $query
     * @param string $post_type_item_id Post type item id
     * @return Builder|static
     */
    public function scopeIsPostTypeItemId($query, string $post_type_item_id)
    {
        return $query->where($this->tableCol('post_type_item_id'), $post_type_item_id);
    }

    /**
     * Scope "isValue"
     *
     * @param Builder|static $query
     * @param string|array $value Value
     * @return Builder|static
     */
    public function scopeIsValue($query, $value)
    {
        return $query->withinKey($value, 'value');
    }

    /**
     * Scope "isTranslatable"
     *
     * @param Builder|static $query
     * @param bool $is_translatable Is translatable
     * @return Builder|static
     */
    public function scopeIsTranslatable($query, $is_translatable = true)
    {
        return $query->whereHas('post_type_item', function ($query) use ($is_translatable) {
            return $query->isTranslatable($is_translatable);
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
        return $query->whereHas('post_type_item', function ($query) use ($type) {
            return $query->isType($type);
        });
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
        return $query->whereHas('post_type_item', function ($query) use ($key) {
            return $query->isKey($key);
        });
    }

    /**
     * Scope "hasKeyValue"
     * **need test/review**
     *
     * @param Builder|static $query
     * @param string|array $key Key
     * @param string $value Value
     * @return Builder|static
     */
    public function scopeHasKeyValue($query, $key, string $value)
    {
        return $query->hasKey($key)->where(function ($query) use ($value) {
            return $query
                ->where(function ($query) use ($value) {
                    return $query->isTranslatable(true)->hasTrans('value', $value);
                })
                ->orWhere(function ($query) use ($value) {
                    return $query->isTranslatable(false)->isValue($value);
                });
        });
    }

    /**
     * Scope "searchKeyValues"
     * **need test/review**
     *
     * @param Builder|static $query
     * @param string|array $key Key
     * @param string|array $searches Searches
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearchKeyValues($query, $key, $searches, $multiple = true)
    {
        return $query->hasKey($key)->where(function ($query) use ($searches, $multiple) {
            return $query
                ->where(function ($query) use ($searches, $multiple) {
                    return $query->isTranslatable(true)->searchTrans('value', $searches, $multiple);
                })
                ->orWhere(function ($query) use ($searches, $multiple) {
                    return $query->isTranslatable(false)->search('value', $searches, $multiple);
                });
        });
    }

    /**
     * Scope "searchKeysValues"
     *
     * **need test/review**
     *
     * @param Builder|static $query
     * @param string|array $keys Keys
     * @param string|array $searches Searches
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearchKeysValues($query, $keys, $searches, $multiple = true)
    {
        $keys = to_array($keys);

        if ($multiple === true) {
            $query->where(function ($query) use ($keys, $searches, $multiple) {
                $query->where(function ($query) use ($keys, $searches, $multiple) {
                    return $query->searchKeyValues(array_shift($keys), $searches, $multiple);
                });

                foreach ($keys as $key) {
                    $query->orWhere(function ($query) use ($key, $searches, $multiple) {
                        return $query->searchKeyValues($key, $searches, $multiple);
                    });
                }

                return $query;
            });
        } else {
            foreach ($keys as $key) {
                $query->where(function ($query) use ($key, $searches, $multiple) {
                    return $query->searchKeyValues($key, $searches, $multiple);
                });
            }
        }

        return $query;
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Get "value_type" attribute
     *
     * @return string
     */
    public function getValueTypeAttribute()
    {
        return $this->post_type_item->value_type;
    }

    /**
     * Get "formatted_value" attribute
     *
     * @return mixed
     */
    public function getFormattedValueAttribute()
    {
        if ($this->post_type_item->is_translatable === true) {
            if (!$this->lang || !$this->lang->value) {
                if ($this->default_lang) {
                    return $this->formatValue($this->default_lang);
                } else {
                    return null;
                }
            } else {
                return $this->formatValue($this->lang);
            }
        }

        return $this->formatValue($this);
    }

    /**
     * Get "formatted_trans" attribute
     *
     * @return mixed[]
     */
    public function getFormattedTransAttribute()
    {
        return $this->trans->reduce(function ($carry, $lang) {
            $carry[$lang->lang_code] = $this->formatValue($lang);

            return $carry;
        }, []);
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Post relation
     *
     * @return BelongsTo|Post
     */
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }

    /**
     * Post type item relation
     *
     * @return BelongsTo|PostTypeItem
     */
    public function post_type_item()
    {
        return $this->belongsTo(PostTypeItem::class, 'post_type_item_id', 'id');
    }

    /**
     * Parent post item relation
     *
     * @return BelongsTo|static
     */
    public function post_item()
    {
        return $this->belongsTo(static::class, 'post_item_id', 'id');
    }

    /**
     * Post items relations
     *
     * @return HasMany|Collection|static[]
     */
    public function post_items()
    {
        return $this->hasMany(static::class, 'post_item_id', 'id');
    }

    /**
     * Post items relations (recursive)
     *
     * @return HasMany|Collection|static[]
     */
    public function post_items_recursive()
    {
        return $this->post_items()->with(['file', 'trans.file', 'post_type_item', 'post_items_recursive']);
    }

    /**
     * File relation
     *
     * @return BelongsTo|File
     */
    public function file()
    {
        return $this->belongsTo(File::class, 'value');
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
        return $this->post->isMigratable();
    }

    /**
     * Get uploads directory
     *
     * @return string
     */
    public function getUploadDir()
    {
        return $this->post->getUploadDir() . '/items/';
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        if ($this->post_type_item->is_translatable === true) {
            $lang = $this->getLangToUpdate($data);

            $data['value'] = $this->prepareValue($data['value'], $lang);

            $lang->updateData($data);

            $data['value'] = null;
        } else {
            $data['value'] = $this->prepareValue($data['value'], $this);
        }

        $this->updateEntries($data, ['value', 'position']);
    }

    /**
     * Prepare the value for update
     *
     * @param mixed $value
     * @param PostItemLang|static $source
     * @return mixed
     */
    protected function prepareValue($value, $source)
    {
        switch ($this->value_type) {
            case 'date':
                return to_date_string($value);
            case 'datetime':
                return to_datetime_utc_string($value);
            case 'encrypted':
                return encrypt($value);
            case 'file':
                return $source->updateFile('file', $value, ['path' => $this->getUploadDir()], 'value')->id ?? $source->value;
            default:
                break;
        }

        return $value;
    }

    /**
     * Format the value
     *
     * @param PostItemLang|static $source
     * @return mixed
     */
    protected function formatValue($source)
    {
        $type = $this->value_type;

        if ($type === 'file') {
            return $source->file;
        }

        $cast = $this->post_type_item->data->cast ?? $this->getDefaultCast($type);

        switch ($type) {
            case 'checkbox':
            case 'selectmultiple':
                return array_map(function ($value) use ($cast) {
                    return $this->castValue($value, $cast);
                }, to_array(json_decode($source->value)));
            case 'radio':
            case 'select':
                return $this->castValue(to_array(json_decode($source->value))[0] ?? $source->value, $cast);
            case 'encrypted':
                return $this->castValue(decrypt_value($source->value), $cast);
            default:
                break;
        }

        return $this->castValue($source->value, $cast);
    }

    /**
     * Cast the value
     *
     * @param mixed $value
     * @param string $cast
     * @return mixed
     */
    private function castValue($value, string $cast)
    {
        switch ($cast) {
            case 'boolean':
                return to_bool($value);
            case 'integer':
                return numeric_val($value);
            case 'string':
                return (string) $value;
            default:
                break;
        }

        return $value;
    }

    /**
     * Get the default cast based on the type
     *
     * @param string $type
     * @return string
     */
    private function getDefaultCast(string $type)
    {
        switch ($type) {
            case 'number':
                return 'integer';
            case 'checkbox':
            case 'date':
            case 'datetime':
            case 'email':
            case 'encrypted':
            case 'radio':
            case 'select':
            case 'selectmultiple':
            case 'text':
            case 'textarea':
            case 'time':
            case 'url':
            case 'wysiwyg':
            default:
                break;
        }

        return 'string';
    }
}

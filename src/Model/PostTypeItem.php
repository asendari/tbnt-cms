<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\HasLangTrait;

/**
 * Tbnt\Cms\Model\PostTypeItem
 *
 * @property string $id
 * @property string|null $post_type_id
 * @property string|null $post_type_item_id
 * @property string $key
 * @property string $label
 * @property string $type
 * @property object|null $data
 * @property int $position
 * @property int $mode
 * @property bool $is_required
 * @property bool $is_translatable
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read PostTypeItemLang $default_lang
 * @property-read PostTypeItemLang $display_lang
 * @property-read PostTypeItemLang $lang
 * @property-read string $value_type
 * @property-read Collection|PostItem[] $post_items
 * @property-read int|null $post_items_count
 * @property-read PostType|null $post_type
 * @property-read PostTypeItem|null $post_type_item
 * @property-read Collection|PostTypeItemCondition[] $post_type_item_conditions
 * @property-read int|null $post_type_item_conditions_count
 * @property-read Collection|PostTypeItemCondition[] $post_type_item_conditions_matches
 * @property-read int|null $post_type_item_conditions_matches_count
 * @property-read Collection|PostTypeItemCondition[] $post_type_item_conditions_values
 * @property-read int|null $post_type_item_conditions_values_count
 * @property-read Collection|PostTypeItemRestriction[] $post_type_item_restrictions
 * @property-read int|null $post_type_item_restrictions_count
 * @property-read Collection|PostTypeItem[] $post_type_items
 * @property-read int|null $post_type_items_count
 * @property-read Collection|PostTypeItemLang[] $trans
 * @property-read int|null $trans_count
 * @method static Builder|PostTypeItem hasTrans($key, $value)
 * @method static Builder|PostTypeItem isKey($key)
 * @method static Builder|PostTypeItem isMode($mode)
 * @method static Builder|PostTypeItem isPostTypeId($post_type_id)
 * @method static Builder|PostTypeItem isPostTypeItemId($post_type_item_id)
 * @method static Builder|PostTypeItem isRequired($is_required = true)
 * @method static Builder|PostTypeItem isTranslatable($is_translatable = true)
 * @method static Builder|PostTypeItem isType($type)
 * @method static Builder|PostTypeItem searchTrans($fields, $searches, $multiple = true)
 * @method static Builder|PostTypeItem whereBatch($value)
 * @method static Builder|PostTypeItem whereCreatedAt($value)
 * @method static Builder|PostTypeItem whereData($value)
 * @method static Builder|PostTypeItem whereDeletedAt($value)
 * @method static Builder|PostTypeItem whereId($value)
 * @method static Builder|PostTypeItem whereIsRequired($value)
 * @method static Builder|PostTypeItem whereIsTranslatable($value)
 * @method static Builder|PostTypeItem whereKey($value)
 * @method static Builder|PostTypeItem whereLabel($value)
 * @method static Builder|PostTypeItem whereMode($value)
 * @method static Builder|PostTypeItem wherePosition($value)
 * @method static Builder|PostTypeItem wherePostTypeId($value)
 * @method static Builder|PostTypeItem wherePostTypeItemId($value)
 * @method static Builder|PostTypeItem whereType($value)
 * @method static Builder|PostTypeItem whereUpdatedAt($value)
 */
class PostTypeItem extends BaseModelPost
{
    use HasLangTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_type_items';

    /**
     * The attributes that should be cast to native types
     *
     * Possible values:
     * integer, real, float, double, string, boolean, object, array, collection, date, datetime, timestamp
     *
     * @var array
     */
    protected $casts = [
        'data' => 'object',
        'is_required' => 'boolean',
        'is_translatable' => 'boolean',
    ];

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
        return $query;
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
     * Scope "isRequired"
     *
     * @param Builder|static $query
     * @param bool $is_required Is required
     * @return Builder|static
     */
    public function scopeIsRequired($query, $is_required = true)
    {
        return $query->where($this->tableCol('is_required'), intval($is_required));
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
        return $query->where($this->tableCol('is_translatable'), intval($is_translatable));
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
        return $this->type === 'post' ? $this->data->type ?? 'empty' : $this->type;
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
        return trim($value) ?: ucfirst(str_replace('-', ' ', str()->kebab(trim($this->attributes['key']))));
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
        $this->attributes['data'] = $value ? json_encode($value) : '';
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Parent post type relation
     *
     * @return BelongsTo|PostType
     */
    public function post_type()
    {
        return $this->belongsTo(PostType::class, 'post_type_id', 'id');
    }

    /**
     * Parent post type item relation
     *
     * @return BelongsTo|static
     */
    public function post_type_item()
    {
        return $this->belongsTo(static::class, 'post_type_item_id', 'id');
    }

    /**
     * Post type items relations
     *
     * @return HasMany|Collection|static[]
     */
    public function post_type_items()
    {
        return $this->hasMany(static::class, 'post_type_item_id', 'id');
    }

    /**
     * Post type items relations (recursive)
     *
     * @return HasMany|Collection|static[]
     */
    public function post_type_items_recursive()
    {
        return $this->post_type_items()->with([
            'post_type_item_conditions.post_type_item_value',
            'post_type_item_restrictions',
            'post_type_items_recursive',
        ]);
    }

    /**
     * Post type item conditions relations
     *
     * @return HasMany|Collection|PostTypeItemCondition[]
     */
    public function post_type_item_conditions()
    {
        return $this->hasMany(PostTypeItemCondition::class, 'post_type_item_id', 'id');
    }

    /**
     * Post type item conditions relations
     *
     * @return HasMany|Collection|PostTypeItemCondition[]
     */
    public function post_type_item_conditions_matches()
    {
        return $this->hasMany(PostTypeItemCondition::class, 'post_type_item_id_match', 'id');
    }

    /**
     * Post type item conditions relations
     *
     * @return HasMany|Collection|PostTypeItemCondition[]
     */
    public function post_type_item_conditions_values()
    {
        return $this->hasMany(PostTypeItemCondition::class, 'post_type_item_id_value', 'id');
    }

    /**
     * Post type item restrictions relations
     *
     * @return HasMany|Collection|PostTypeItemRestriction[]
     */
    public function post_type_item_restrictions()
    {
        return $this->hasMany(PostTypeItemRestriction::class, 'post_type_item_id', 'id');
    }

    /**
     * Post items relations
     *
     * @return HasMany|Collection|PostItem[]
     */
    public function post_items()
    {
        return $this->hasMany(PostItem::class, 'post_type_item_id', 'id');
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
        return $this->post_type->isMigratable();
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, [
            'post_type_item_id',
            'key',
            'label',
            'type',
            'data',
            'position',
            'mode',
            'is_required',
            'is_translatable',
        ]);

        if (isset($data['config']) === true && is_array($data['config']) === true) {
            $this->updateConfig($data['config']);
        }
        if (isset($data['conditions']) === true && is_array($data['conditions']) === true) {
            $this->updateConditions($data['conditions']);
        }
        if (isset($data['restrictions']) === true && is_array($data['restrictions']) === true) {
            $this->updateRestrictions($data['restrictions']);
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
        if (isset($data['count']) === true && $data['count'] === 0) {
            unset($data['count']);
        }
        if (isset($data['min']) === true && $data['min'] === 0) {
            unset($data['min']);
        }
        if (isset($data['max']) === true && $data['max'] === 0) {
            unset($data['max']);
        }

        $this->updateEntry('data', $data);
    }

    /**
     * Update data conditions
     *
     * @param array $data Data
     * @return void
     */
    public function updateConditions(array $data)
    {
        $post_conditions = collect();

        foreach ($data as $match => $values) {
            foreach ($values as $value) {
                $post_type_item_condition = $this->post_type_item_conditions()
                    ->where('post_type_item_id_match', $match)
                    ->where('post_type_item_id_value', $value)
                    ->first();

                if ($post_type_item_condition === null) {
                    $post_type_item_condition = $this->post_type_item_conditions()->create([
                        'post_type_item_id_match' => $match,
                        'post_type_item_id_value' => $value,
                    ]);
                }

                $post_conditions->push($post_type_item_condition);
            }
        }

        $query = $this->post_type_item_conditions();

        if ($post_conditions->count() !== 0) {
            $query->whereNotIn('id', $post_conditions->pluck('id')->toArray());
        }

        $query->get()->each(function ($p) {
            $p->delete();
        });
    }

    /**
     * Update data restrictions
     *
     * @param array $data Data
     * @return void
     */
    public function updateRestrictions(array $data)
    {
        $post_restrictions = collect();

        foreach ($data as $post_id) {
            $post_type_item_restriction = $this->post_type_item_restrictions()
                ->where('post_id', $post_id)
                ->first();

            if ($post_type_item_restriction === null) {
                $post_type_item_restriction = $this->post_type_item_restrictions()->create([
                    'post_id' => $post_id,
                ]);
            }

            $post_restrictions->push($post_type_item_restriction);
        }

        $query = $this->post_type_item_restrictions();

        if ($post_restrictions->count() !== 0) {
            $query->whereNotIn('id', $post_restrictions->pluck('id')->toArray());
        }

        $query->get()->each(function ($p) {
            $p->delete();
        });
    }
}

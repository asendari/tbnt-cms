<?php

namespace Tbnt\Cms\Model\Traits;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;

/**
 * Tbnt\Cms\Model\Traits\BaseTrait
 *
 * @mixin Eloquent
 */
trait BaseTrait
{
    /**
     * The attributes that are encryptable
     *
     * @var array
     */
    protected $encryptable = [];

    /**
     * Get the number of models to return per page.
     *
     * @return int
     */
    public function getPerPage()
    {
        return intval(request()->query('page_count', 0) < 0 ? $this->count() : request()->query('page_count') ?: $this->perPage);
    }

    /**
     * Check if a given attribute is loaded on the model
     *
     * @param string $key
     * @return bool
     */
    public function hasAttribute(string $key)
    {
        return isset($this->getAttributes()[$key]);
    }

    /**
     * Check if a given relation is loaded on the model
     *
     * @param string $key
     * @return bool
     */
    public function hasRelation(string $key)
    {
        return array_key_exists($key, $this->relations);
    }

    /**
     * Check if a given attribute/relation is loaded on the model
     *
     * @param string $key
     * @return bool
     */
    public function hasProperty(string $key)
    {
        return $this->hasAttribute($key) === true || $this->hasRelation($key) === true;
    }

    /**
     * Set a given attribute on the model.
     *
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->encryptable) === true) {
            $value = encrypt(decrypt_value($value));
        }

        /** @noinspection PhpUndefinedClassInspection */
        return parent::setAttribute($key, $value);
    }

    /**
     * Get a plain attribute (not a relationship).
     *
     * @param string $key
     * @return mixed
     */
    public function getAttributeValue($key)
    {
        /** @noinspection PhpUndefinedClassInspection */
        $value = parent::getAttributeValue($key);

        if (in_array($key, $this->encryptable) === true) {
            return decrypt_value($value);
        }

        return $value;
    }

    /**
     * Get (set is unset) attribute as relation
     *
     * @param string $name Data name
     * @param mixed $value Data value
     * @return void
     */
    protected function getAttributeAsRelation(string $name, $value)
    {
        if (array_key_exists($name, $this->relations) === false) {
            if (is_callable($value) === true) {
                $value = $value();
            }

            $this->setRelation($name, $value);
        }

        return $this->getRelation($name);
    }

    /**
     * Reload relations
     *
     * @param array $relations Relations
     * @return void
     */
    public function reload(array $relations)
    {
        $relations = to_array($relations);

        if (count($relations) === 0) {
            return;
        }

        foreach ($relations as $relation) {
            if (isset($this->{$relation}) === false) {
                unset($relations[$relation]);
            }
        }

        $this->load($relations);
    }

    /**
     * Set attributes/relations as property
     *
     * @param array $attributes Attributes/relations
     * @param bool $reload Reload attribute/relation
     * @return self
     */
    public function forceLoad(array $attributes, $reload = false)
    {
        foreach ($attributes as $attribute) {
            if (isset($this->{$attribute}) === true) {
                if ($reload === false) {
                    continue;
                } else {
                    unset($this->{$attribute});
                }
            }

            $value = $this->{$attribute};
            $this->{$attribute} = $value;
        }

        return $this;
    }

    /**
     * Update attribute
     *
     * @param string $name Data name
     * @param mixed $value Data value
     * @return void
     */
    public function updateEntry(string $name, $value)
    {
        $this->{$name} = $value;
        $this->save();
    }

    /**
     * Update attributes
     *
     * @param array $data Model data
     * @param array|null $filters Data filters
     * @return void
     */
    public function updateEntries(array $data, $filters = null)
    {
        if (is_array($filters) === true) {
            $data = arr()->only($data, $filters);
        }

        foreach ($data as $name => $value) {
            $this->{$name} = $value;
        }

        $this->save();
    }

    /**
     * Format table column
     *
     * @param string $column Column
     * @return string
     */
    public function tableCol(string $column)
    {
        return implode('.', [$this->getTable(), $column]);
    }

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "like"
     * LIKE clause on multiple fields with single value
     *
     * @param Builder|static $query
     * @param array|string $fields Fields to perform search
     * @param mixed $search Search value
     * @return Builder|static
     */
    public function scopeLike($query, $fields, $search)
    {
        $fields = to_array($fields);

        $query->where(array_shift($fields), 'like', '%' . $search . '%');

        foreach ($fields as $field) {
            $query->orWhere($this->tableCol($field), 'like', '%' . $search . '%');
        }

        return $query;
    }

    /**
     * Scope "orLike"
     * OR LIKE clause on multiple fields with single value
     *
     * @param Builder|static $query
     * @param array|string $fields Fields to perform search
     * @param mixed $search Search value
     * @return Builder|static
     */
    public function scopeOrLike($query, $fields, $search)
    {
        $fields = to_array($fields);

        $query->orWhere(array_shift($fields), 'like', '%' . $search . '%');

        foreach ($fields as $field) {
            $query->orWhere($this->tableCol($field), 'like', '%' . $search . '%');
        }

        return $query;
    }

    /**
     * Scope "search"
     * LIKE clause on multiple fields with multiple values
     *
     * @param Builder|static $query
     * @param string|array $fields Search fields
     * @param string|array $searches Search string
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearch($query, $fields, $searches, $multiple = true)
    {
        $searches = is_array($searches) ? $searches : explode(' ', $searches);
        $searches = array_filter(array_map('trim', $searches));

        $func = $multiple === true ? 'orLike' : 'like';

        return $query->where(function ($query) use ($fields, $searches, $func) {
            $query->like($fields, array_shift($searches));

            foreach ($searches as &$search) {
                $query->$func($fields, $search);
            }
        });
    }

    /**
     * Scope "isBefore"
     * Where 'created_at' field is egal or before datetime
     *
     * @param Builder|static $query
     * @param string|null $created_at Datetime
     * @return Builder|static
     */
    public function scopeIsBefore($query, $created_at = null)
    {
        return $query->where($this->tableCol('created_at'), '<=', to_datetime_utc_string($created_at ?: now()));
    }

    /**
     * Scope "within"
     * WhereIn clause on numeric column, default to 'id'
     *
     * @param Builder|static $query
     * @param int|array $value Value
     * @param string|null $column Column
     * @return Builder|static
     */
    public function scopeWithin($query, $value, $column = null)
    {
        return $query->whereIn($this->tableCol($column ?: 'id'), to_array($value));
    }

    /**
     * Scope "withinNot"
     * WhereNotIn clause on numeric column, default to 'id'
     *
     * @param Builder|static $query
     * @param int|array $value Value
     * @param string|null $column Column
     * @return Builder|static
     */
    public function scopeWithinNot($query, $value, $column = null)
    {
        return $query->whereNotIn($this->tableCol($column ?: 'id'), to_array($value));
    }

    /**
     * Scope "withinKey"
     * WhereIn clause on string column, default to 'key'
     *
     * @param Builder|static $query
     * @param string|array $value Value
     * @param string|null $column Column
     * @return Builder|static
     */
    public function scopeWithinKey($query, $value, $column = null)
    {
        return $query->whereIn($this->tableCol($column ?: 'key'), to_array($value));
    }

    /**
     * Scope "withinKeyNot"
     * WhereNotIn clause on string column, default to 'key'
     *
     * @param Builder|static $query
     * @param string|array $value Value
     * @param string|null $column Column
     * @return Builder|static
     */
    public function scopeWithinKeyNot($query, $value, $column = null)
    {
        return $query->whereNotIn($this->tableCol($column ?: 'key'), to_array($value));
    }

    /**
     * Scope "keyId"
     * WhereIn clause on column, default to 'key' if string or 'id' if numeric
     *
     * @param Builder|static $query
     * @param int|string|array $value Value
     * @param string|null $string Column string
     * @param string|null $numeric Column numeric
     * @return Builder|static
     */
    public function scopeKeyId($query, $value, $string = null, $numeric = null)
    {
        return is_numeric(to_array($value)[0] ?? null) === true
            ? $query->within($value, $numeric)
            : $query->withinKey($value, $string);
    }

    /**
     * Scope "keyIdNot"
     * WhereNotIn clause on column, default to 'key' if string or 'id' if numeric
     *
     * @param Builder|static $query
     * @param int|string|array $value Value
     * @param string|null $string Column string
     * @param string|null $numeric Column numeric
     * @return Builder|static
     */
    public function scopeKeyIdNot($query, $value, $string = null, $numeric = null)
    {
        return is_numeric(to_array($value)[0] ?? null) === true
            ? $query->withinNot($value, $numeric)
            : $query->withinKeyNot($value, $string);
    }

    /****************************************************************
     * Static
     ***************************************************************/

    /**
     * Find by column
     * 'where' clause on column, default to 'null'
     *
     * @param string $value Value
     * @param string|null $column Column
     * @param string|null $cast Cast function
     * @return static
     */
    public static function findFor(string $value, $column = null, $cast = null)
    {
        return self::where($column ?: 'id', is_callable($cast) ? $cast($value) : $value)->first();
    }

    /**
     * Check if exists by column
     * 'where->exists' clause on column, default to 'null'
     *
     * @param string $value Value
     * @param string|null $column Column
     * @param string|null $cast Cast function
     * @return bool
     */
    public static function existsFor(string $value, $column = null, $cast = null)
    {
        return self::where($column ?: 'id', is_callable($cast) ? $cast($value) : $value)->exists();
    }
}

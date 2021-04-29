<?php

namespace Tbnt\Cms\Model\Traits;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Tbnt\Cms\Model\Traits\HasLangTrait
 *
 * @mixin Eloquent
 */
trait HasLangTrait
{
    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "hasTrans"
     *
     * @param Builder|static $query
     * @param string $key Key
     * @param string $value Value
     * @return Builder|static
     */
    public function scopeHasTrans($query, string $key, string $value)
    {
        return $query->whereHas('trans', function ($query) use ($key, &$value) {
            $query->hasCurrentDefaultValue($key, $value);
        });
    }

    /**
     * Scope "searchTrans"
     *
     * @param Builder|static $query
     * @param string|array $fields Fields
     * @param string|array $searches Searches
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearchTrans($query, $fields, $searches, $multiple = true)
    {
        return $query->whereHas('trans', function ($query) use ($fields, $searches, $multiple) {
            $query->searchCurrentDefaultValues($fields, $searches, $multiple);
        });
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Get "lang" attribute
     *
     * @return Eloquent
     */
    public function getLangAttribute()
    {
        return $this->trans->keyBy('lang_id')[lang()->getCurrentId()] ?? null;
    }

    /**
     * Get "default_lang" attribute
     *
     * @return Eloquent
     */
    public function getDefaultLangAttribute()
    {
        return $this->trans->keyBy('lang_id')[lang()->getDefaultId()] ?? null;
    }

    /**
     * Get "display_lang" attribute
     *
     * @return object
     */
    public function getDisplayLangAttribute()
    {
        $trans = $this->trans->keyBy('lang_id');

        $default_lang_id = lang()->getDefaultId();
        $current_lang_id = lang()->getCurrentId();

        $values = [];

        $class = $this->getFullLangClassName();
        $class = new $class();

        if (is_array($class->attributes_lang)) {
            foreach ($class->attributes_lang as $attribute_lang) {
                $values[$attribute_lang] =
                    ($trans[$current_lang_id] ?? null)[$attribute_lang] ?? null ?:
                    ($trans[$default_lang_id] ?? null)[$attribute_lang] ?? null;
            }
        }

        return (object) $values;
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Trans relation
     *
     * @return HasMany|Collection|mixed[]
     */
    public function trans()
    {
        return $this->hasMany($this->getFullLangClassName(), $this->getColumnIdentifier());
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Get relation classname
     * Ex: Post
     *
     * @return string
     */
    private function getCurrentClassName()
    {
        return last(explode('\\', $this->getFullCurrentClassName()));
    }

    /**
     * Get relation FQN class
     * Ex: Tbnt\Cms\Model\Post
     *
     * @return string
     */
    private function getFullCurrentClassName()
    {
        return static::class;
    }

    /**
     * Get lang classname
     * Ex: PostLang
     *
     * @return string
     */
    private function getLangClassName()
    {
        return $this->getCurrentClassName() . 'Lang';
    }

    /**
     * Get lang FQN class
     * Ex: Tbnt\Cms\Model\PostLang
     *
     * @return string
     */
    private function getFullLangClassName()
    {
        $class_parts = explode('\\', $this->getFullCurrentClassName());
        array_pop($class_parts);
        $base = implode('\\', $class_parts);

        return $base . '\\' . $this->getLangClassName();
    }

    /**
     * Get langs table name
     * Ex: post_id
     *
     * @return string
     */
    private function getTableIdentifier()
    {
        $class = $this->getFullLangClassName();

        return (new $class())->getTable();
    }

    /**
     * Get relation column identifier
     * Ex: post_id
     *
     * @return string
     */
    private function getColumnIdentifier()
    {
        return strtolower(str()->snake($this->getCurrentClassName())) . '_id';
    }

    /**
     * Get lang to update
     * Will use $lang_any arg, otherwise $data['lang_code'] or finally $data['lang_id']
     *
     * @param array $data Data
     * @param string|int|null $lang_any Lang id/code
     * @return mixed|null
     */
    public function getLangToUpdate(array $data, $lang_any = null)
    {
        $lang_id = lang()->normalizeId($lang_any ?: $data['lang_code'] ?? ($data['lang_id'] ?? null));

        if (!$lang_id) {
            return null;
        }

        return $this->trans()->firstOrCreate(['lang_id' => $lang_id]);
    }

    /**
     * Update trans
     * Will use $lang_any arg, otherwise $data['lang_code'] or finally $data['lang_id']
     *
     * @param array $data Data
     * @param string|int|null $lang_any Lang id/code
     * @return void
     */
    public function updateTrans(array $data, $lang_any = null)
    {
        $lang = $this->getLangToUpdate($data, $lang_any);

        if (!$lang) {
            return;
        }

        $lang->updateData($data);

        $this->reload(['trans']);
    }
}

<?php

namespace Tbnt\Cms\Model\Traits;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;

/**
 * Tbnt\Cms\Model\Traits\LangTrait
 *
 * @mixin Eloquent
 */
trait LangTrait
{
    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "isCurrentLang"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsCurrentLang($query)
    {
        return $query->where($this->tableCol('lang_id'), lang()->getCurrentId());
    }

    /**
     * Scope "isDefaultLang"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsDefaultLang($query)
    {
        return $query->where($this->tableCol('lang_id'), lang()->getDefaultId());
    }

    /**
     * Scope "isCurrentDefaultLang"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsCurrentDefaultLang($query)
    {
        return $query->where(function ($query) {
            return $query
                ->where($this->tableCol('lang_id'), lang()->getCurrentId())
                ->orWhere($this->tableCol('lang_id'), lang()->getDefaultId());
        });
    }

    /**
     * Scope "isLangId"
     *
     * @param Builder|static $query
     * @param int|null $lang_id Lang id
     * @return Builder|static
     */
    public function scopeIsLangId($query, $lang_id = null)
    {
        return $query->where($this->tableCol('lang_id'), intval($lang_id ?: lang()->getCurrentId()));
    }

    /**
     * Scope "isLangCode"
     *
     * @param Builder|static $query
     * @param string|null $lang_code Lang code
     * @return Builder|static
     */
    public function scopeIsLangCode($query, $lang_code = null)
    {
        return $query->isLangId(lang()->getId($lang_code ?: lang()->getCurrentCode()));
    }

    /**
     * Scope "isLang"
     *
     * @param Builder|static $query
     * @param int|null $lang_any Lang any
     * @return Builder|static
     */
    public function scopeIsLang($query, $lang_any = null)
    {
        return is_numeric($lang_any) === true ? $query->isLangId($lang_any) : $query->isLangCode($lang_any);
    }

    /**
     * Scope "hasCurrentDefaultValue"
     *
     * @param Builder|static $query
     * @param string $key Key
     * @param string $value Value
     * @return Builder|static
     */
    public function scopeHasCurrentDefaultValue($query, string $key, string $value)
    {
        return $query->isCurrentDefaultLang()->where($key, $value);
    }

    /**
     * Scope "searchCurrentDefaultValues"
     *
     * @param Builder|static $query
     * @param string|array $fields Fields
     * @param string|array $searches Searches
     * @param bool $multiple Search multiple
     * @return Builder|static
     */
    public function scopeSearchCurrentDefaultValues($query, $fields, $searches, $multiple = true)
    {
        return $query->isCurrentDefaultLang()->search($fields, $searches, $multiple);
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Append lang code attribute
     *
     * @return string
     */
    public function getLangCodeAttribute()
    {
        return lang()->getCode($this->lang_id);
    }
}

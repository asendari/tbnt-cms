<?php

namespace Tbnt\Cms\Utils;

use App;
use Request;
use Tbnt\Cms\Model\Lang;

class LangUtils
{
    /**
     * Langs
     *
     * @var Lang[]|null
     */
    private static $langs = null;

    /**
     * Langs by id
     *
     * @var Lang[]|null
     */
    private static $langs_by_id = null;

    /**
     * Langs by code
     *
     * @var Lang[]|null
     */
    private static $langs_by_code = null;

    /**
     * Langs that are visible
     *
     * @var Lang[]|null
     */
    private static $langs_without_hidden = null;

    /**
     * Default lang
     *
     * @var Lang|null
     */
    private static $default = null;

    /**
     * Default lang id
     *
     * @var int
     */
    private static $default_id = 0;

    /**
     * Default lang code
     *
     * @var string
     */
    private static $default_code = '';

    /**
     * Current lang
     *
     * @var Lang|null
     */
    private static $current = null;

    /**
     * Current lang id
     *
     * @var int
     */
    private static $current_id = 0;

    /**
     * Current lang code
     *
     * @var string
     */
    private static $current_code = '';

    /**
     * Check if lang id exists
     *
     * @param int|null $lang_id Lang id
     * @return bool
     */
    public static function exists($lang_id)
    {
        return isset(self::_configById()[$lang_id]);
    }

    /**
     * Check if lang code exists
     *
     * @param string|null $lang_code Lang code
     * @return bool
     */
    public static function codeExists($lang_code)
    {
        return isset(self::_configByCode()[$lang_code]);
    }

    /**
     * Check if default lang can be empty
     *
     * @param string|null $lang_code Lang code
     * @return bool
     */
    public static function canBeEmpty($lang_code = null)
    {
        return config('cmslang.can_be_empty') === true &&
            $lang_code !== '' &&
            ($lang_code ?: self::getDefaultCode()) === self::getDefaultCode();
    }

    /**
     * Check if current lang is default lang
     *
     * @return bool
     */
    public static function currentIsDefault()
    {
        return self::getCurrentCode() === self::getDefaultCode();
    }

    /**
     * Get lang id from code
     *
     * @param string $lang_code Lang code
     * @return int
     */
    public static function getId(string $lang_code)
    {
        return self::findByCode($lang_code)['id'] ?? 0;
    }

    /**
     * Get lang code from id
     *
     * @param int $lang_id Lang id
     * @return string
     */
    public static function getCode(int $lang_id)
    {
        return self::find($lang_id)['code'] ?? '';
    }

    /**
     * Get lang id from id or code
     *
     * @param string|int $lang_any Lang id/code
     * @return int|null
     */
    public static function normalizeId($lang_any)
    {
        return self::exists($lang_any) ? $lang_any : (self::codeExists($lang_any) ? self::getId($lang_any) : null) ?: null;
    }

    /**
     * Get lang code from id or code
     *
     * @param string|int $lang_any Lang id/code
     * @return string|null
     */
    public static function normalizeCode($lang_any)
    {
        return self::codeExists($lang_any) ? $lang_any : (self::exists($lang_any) ? self::getCode($lang_any) : null) ?: null;
    }

    /**
     * Get default lang id
     *
     * @return int
     */
    public static function getDefaultId()
    {
        if (self::$default_id === 0) {
            self::$default_id = self::getDefault()['id'] ?? 0;
        }

        return self::$default_id;
    }

    /**
     * Get default lang code
     *
     * @return string
     */
    public static function getDefaultCode()
    {
        if (self::$default_code === '') {
            self::$default_code = config('cmslang.default') ?: '';
        }

        return self::$default_code;
    }

    /**
     * Get current lang
     *
     * @return Lang|null
     */
    public static function getDefault()
    {
        if (self::$default === null) {
            self::$default = self::findByCode(self::getDefaultCode());
        }

        return self::$default;
    }

    /**
     * Get current lang id
     *
     * @return int
     */
    public static function getCurrentId()
    {
        if (self::$current_id === 0 || self::$current_code !== App::getLocale()) {
            self::$current_id = self::getCurrent()['id'] ?? 0;
        }

        return self::$current_id;
    }

    /**
     * Get current lang code
     *
     * @return string
     */
    public static function getCurrentCode()
    {
        if (self::$current_code !== App::getLocale()) {
            self::$current_code = App::getLocale();
        }

        return self::$current_code;
    }

    /**
     * Get current lang
     *
     * @return Lang|null
     */
    public static function getCurrent()
    {
        if (self::$current === null || self::$current_code !== App::getLocale()) {
            self::$current = self::findByCode(self::getCurrentCode());
        }

        return self::$current;
    }

    /**
     * Get current lang
     *
     * @param string $lang_any Lang id/code
     * @return void
     */
    public static function setCurrent(string $lang_any)
    {
        App::setLocale(self::normalizeCode($lang_any));

        Request::instance()->lang = self::getCurrent();
    }

    /**
     * Get lang by id
     *
     * @param int $lang_id Lang id
     * @return Lang|null
     */
    public static function find(int $lang_id)
    {
        return self::_configById()[$lang_id] ?? null;
    }

    /**
     * Get lang by code
     *
     * @param string $lang_code Lang code
     * @return Lang|null
     */
    public static function findByCode(string $lang_code)
    {
        return self::_configByCode()[$lang_code] ?? null;
    }

    /**
     * Get all langs
     *
     * @return array
     */
    public static function all()
    {
        return self::_config();
    }

    /**
     * Get all langs by ids
     *
     * @return array
     */
    public static function allByIds()
    {
        return self::_configById();
    }

    /**
     * Get all langs by codes
     *
     * @return array
     */
    public static function allByCodes()
    {
        return self::_configByCode();
    }

    /**
     * Get all langs without the hidden ones
     *
     * @return array
     */
    public static function allWithoutHidden()
    {
        return self::_configWithoutHidden();
    }

    /**
     * Get all langs ids
     *
     * @return array
     */
    public static function allIds()
    {
        return array_keys(self::_configById());
    }

    /**
     * Get all langs codes
     *
     * @return array
     */
    public static function allCodes()
    {
        return array_keys(self::_configByCode());
    }

    /**
     * Get all hidden langs codes
     *
     * @return array
     */
    public static function getHiddenCodes()
    {
        return config('cmslang.hidden');
    }

    /**
     * Get all langs from config
     *
     * @return void
     */
    private static function _init()
    {
        if (self::$langs !== null) {
            return;
        }

        $hidden_codes = self::getHiddenCodes();

        self::$langs_by_id = [];
        self::$langs_by_code = [];
        self::$langs_without_hidden = [];

        self::$langs = array_map(function ($lang) use ($hidden_codes) {
            $lang = factory(Lang::class)->make($lang);
            $lang->is_hidden = in_array($lang->code, $hidden_codes);

            self::$langs_by_id[$lang->id] = $lang;
            self::$langs_by_code[$lang->code] = $lang;

            if (!$lang->is_hidden) {
                self::$langs_without_hidden[$lang->id] = $lang;
            }

            return $lang;
        }, config('cmslang.langs'));
    }

    /**
     * Get all langs from config
     *
     * @return Lang[]
     */
    private static function _config()
    {
        if (self::$langs === null) {
            self::_init();
        }

        return self::$langs;
    }

    /**
     * Get all langs from config
     *
     * @return Lang[]
     */
    private static function _configById()
    {
        if (self::$langs_by_id === null) {
            self::_init();
        }

        return self::$langs_by_id;
    }

    /**
     * Get all langs from config
     *
     * @return Lang[]
     */
    private static function _configByCode()
    {
        if (self::$langs_by_code === null) {
            self::_init();
        }

        return self::$langs_by_code;
    }

    /**
     * Get all langs from config
     *
     * @return Lang[]
     */
    private static function _configWithoutHidden()
    {
        if (self::$langs_without_hidden === null) {
            self::_init();
        }

        return self::$langs_without_hidden;
    }
}

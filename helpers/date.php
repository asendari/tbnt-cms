<?php

use Carbon\Carbon;

/**
 * Shorten time in HH:mm
 *
 * @param string $time Time to shorten
 * @return string
 */
function short_time(string $time)
{
    return preg_replace('/:[^:]+$/', '', $time);
}

/**
 * Format date
 *
 * @param string $date Date to timezone
 * @param string $format DateTime format
 * @return string
 * @throws Exception
 */
function format_date(string $date, $format = 'm F Y, H:i')
{
    return optional(new DateTime($date))->format($format);
}

/**
 * Format date with strftime
 *
 * @param string $date Date to timezone
 * @param string $format strftime format
 * @param string|null $locale Locale (en_US, ...)
 * @return string
 * @throws Exception
 */
function format_date_strf(string $date, $format = '%d %m %Y', $locale = null)
{
    setlocale(LC_TIME, ($locale ?? lang()->getCurrent()->locale) . '.UTF-8');

    return strftime($format, format_date($date, 'U'));
}

/**
 * Format date with trans
 *
 * @param string $date Date to timezone
 * @param string $format Key trans('dates._key_')
 * @param string|null $locale Locale (en_US, ...)
 * @return string
 * @throws Exception
 */
function trans_date(string $date, string $format, $locale = null)
{
    return format_date_strf(
        $date,
        __('cms::dates' . $format, [], explode('_', $locale ?? lang()->getCurrent()->locale)[0] ?? ''),
        $locale
    );
}

/**
 * Format date with trans
 *
 * @param string $date Date to timezone
 * @param string $format Dateformat
 * @param mixed $tz Timezone
 * @param string|null $locale Locale (en_US, ...)
 * @return string
 * @throws Exception
 */
function trans_date_tz(string $date, string $format, $tz = null, $locale = null)
{
    return trans_date(to_datetime_tz_string($date, $tz), $format, $locale);
}

/**
 * Format date to YYYY-mm-dd[T]HH:ii:ss[Z]
 *
 * @param mixed $date Date
 * @return string
 */
function to_iso8601_string($date)
{
    return is_date_valid($date) === true ? carbon($date)->toIso8601ZuluString() : null;
}

/**
 * Format date to YYYY-mm-dd[T]HH:ii:ss+tz:tz
 *
 * @param mixed $date Date
 * @return string
 */
function to_rfc3339_string($date)
{
    return is_date_valid($date) === true ? carbon($date)->toRfc3339String() : null;
}

/**
 * Format date to YYYY-mm-dd[T]HH:ii:ss+00:00
 *
 * @param mixed $date Date
 * @return string
 */
function to_rfc3339_utc_string($date)
{
    return to_rfc3339_string(to_iso8601_string($date));
}

/**
 * Format date to YYYY-mm-dd[T]HH:ii:ss+tz:tz
 *
 * @param mixed $date Date
 * @param mixed $tz Timezone
 * @return string
 */
function to_rfc3339_tz_string($date, $tz = null)
{
    return to_rfc3339_string(set_timezone($date, $tz));
}

/**
 * Format date to YYYY-mm-dd HH:ii:ss
 *
 * @param mixed $date Date
 * @return string
 */
function to_datetime_string($date)
{
    return is_date_valid($date) === true ? carbon($date)->toDateTimeString() : null;
}

/**
 * Format date to YYYY-mm-dd HH:ii:ss
 *
 * @param mixed $date Date
 * @return string
 */
function to_datetime_utc_string($date)
{
    return to_datetime_string(to_iso8601_string($date));
}

/**
 * Format date to YYYY-mm-dd HH:ii:ss
 *
 * @param mixed $date Date
 * @param mixed $tz Timezone
 * @return string
 */
function to_datetime_tz_string($date, $tz = null)
{
    return to_datetime_string(to_rfc3339_tz_string($date, $tz));
}

/**
 * Format date to YYYY-mm-dd
 *
 * @param mixed $date Date
 * @return string
 */
function to_date_string($date)
{
    return is_date_valid($date) === true ? carbon($date)->toDateString() : null;
}

/**
 * Format date to HH:ii:ss
 *
 * @param mixed $date Date
 * @return string
 */
function to_time_string($date)
{
    return is_date_valid($date) === true ? carbon($date)->toTimeString() : null;
}

/**
 * Format date to HH:ii:ss
 *
 * @param mixed $date Date
 * @return string
 */
function to_time_utc_string($date)
{
    return to_time_string(to_iso8601_string($date));
}

/**
 * Format date to HH:ii:ss
 *
 * @param mixed $date Date
 * @param mixed $tz Timezone
 * @return string
 */
function to_time_tz_string($date, $tz = null)
{
    return to_time_string(to_rfc3339_tz_string($date, $tz));
}

/**
 * Set date timezone from date
 *
 * @param mixed $date Date
 * @param mixed $date_tz Date/timezone
 * @return Carbon
 */
function set_timezone($date, $date_tz = null)
{
    if (is_date_valid($date) === false) {
        return null;
    }

    $date_tz = $date_tz ?: config('cms.timezone') ?: null;

    if ($date_tz !== null) {
        if (is_date_valid($date_tz) === true) {
            $date = clone carbon($date);
            $date->timezone = carbon($date_tz)->timezone;
        } elseif (is_string($date_tz) === true) {
            $date = clone carbon($date);
            try {
                $date->timezone = $date_tz;
            } catch (Exception $e) {
            }
        }
    }

    return $date;
}

/**
 * Parse date and return a Carbon instance
 *
 * @param mixed $date Date
 * @return Carbon
 */
function carbon($date)
{
    return is_carbon($date) === true ? $date : Carbon::parse($date);
}

/**
 * Check if date is Crabon instance
 *
 * @param mixed $date Date
 * @return bool
 */
function is_carbon($date)
{
    return $date instanceof Carbon;
}

/**
 * Check if date is valid
 *
 * @param mixed $date Date
 * @return bool
 */
function is_date_valid($date)
{
    if (is_carbon($date) === false && (is_string($date) === false || trim($date) === '')) {
        return false;
    }

    try {
        $carbon = carbon($date);
    } catch (Exception $e) {
        return false;
    }

    return $carbon->timestamp > 0 && checkdate($carbon->month, $carbon->day, $carbon->year);
}

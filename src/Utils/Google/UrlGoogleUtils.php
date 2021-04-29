<?php

namespace Tbnt\Cms\Utils\Google;

class UrlGoogleUtils
{
    /**
     * Encode a string to URL-safe base64
     *
     * @param string $value Value to encode
     * @return string
     */
    private static function encodeBase64(string $value)
    {
        return str_replace(['+', '/'], ['-', '_'], base64_encode($value));
    }

    /**
     * Decode a string from URL-safe base64
     *
     * @param string $value Value to encode
     * @return string
     */
    private static function decodeBase64(string $value)
    {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $value));
    }

    /**
     * Sign a URL with a given crypto key
     * Note that this URL must be properly URL-encoded
     *
     * @param string $myUrlToSign Value to encode
     * @param string $privateKey Value to encode
     * @return string
     */
    public static function sign(string $myUrlToSign, string $privateKey)
    {
        $url = parse_url($myUrlToSign);

        return $myUrlToSign .
            '&signature=' .
            self::encodeBase64(hash_hmac('sha1', $url['path'] . '?' . $url['query'], self::decodeBase64($privateKey), true));
    }
}

<?php

namespace Tbnt\Cms\Utils;

class VideoUtils
{
    /**
     * Convert video browser link to embed link
     *
     * @param string $link Link
     * @return string
     */
    public static function convert_embed(string $link)
    {
        if (strpos($link, 'youtube.') !== false || strpos($link, 'youtu.be') !== false) {
            return self::convert_youtube($link);
        }
        if (strpos($link, 'vimeo.') !== false) {
            return self::convert_vimeo($link);
        }
        if (strpos($link, 'dailymotion.') !== false) {
            return self::convert_dailymotion($link);
        }

        return $link;
    }

    /**
     * Convert youtube browser link to embed link
     *
     * @param string $link Link
     * @return string
     */
    public static function convert_youtube(string $link)
    {
        $regex = '/(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/i';
        $replacement = 'https://www.youtube.com/embed/$1';

        return self::convert_link($regex, $replacement, $link);
    }

    /**
     * Convert vimeo browser link to embed link
     *
     * @param string $link Link
     * @return string
     */
    public static function convert_vimeo(string $link)
    {
        $regex = '/(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/i';
        $replacement = 'https://player.vimeo.com/video/$1';

        return self::convert_link($regex, $replacement, $link);
    }

    /**
     * Convert dailymotion browser link to embed link
     *
     * @param string $link Link
     * @return string
     */
    public static function convert_dailymotion(string $link)
    {
        $regex = '/(?:http?s?:\/\/)?(?:www\.)?(?:dailymotion\.com)\/(?:video\/)?(.+)/i';
        $replacement = 'https://www.dailymotion.com/embed/video/$1';

        return self::convert_link($regex, $replacement, $link);
    }

    /**
     * Convert browser link to embed link helper
     *
     * @param string $regex From pattern
     * @param string $replacement To pattern
     * @param string $link Link
     * @return string
     */
    private static function convert_link(string $regex, string $replacement, string $link)
    {
        if (
            preg_match($regex, $link) !== 0 &&
            preg_match('/' . str_replace(['/', ':', '.', '$1'], ['\\/', '\\:', '\\.', '(.+)'], $replacement) . '/i', $link) === 0
        ) {
            $link = preg_replace($regex, $replacement, $link);
        }

        $link = str_replace('&', '?', $link);
        $pos = strpos($link, '?');

        if ($pos !== false) {
            $link = substr($link, 0, $pos + 1) . str_replace('?', '&', substr($link, $pos + 1));
        }

        return $link;
    }
}

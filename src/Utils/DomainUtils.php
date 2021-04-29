<?php

namespace Tbnt\Cms\Utils;

use Exception;

class DomainUtils
{
    /**
     * Check if DNS respond
     *
     * @param string $domain Domain
     * @return bool
     */
    public static function check(string $domain)
    {
        try {
            $dns = $domain ? dns_get_record($domain, DNS_A) : false;

            return $dns && count($dns);
        } catch (Exception $e) {
            return false;
        }
    }
}

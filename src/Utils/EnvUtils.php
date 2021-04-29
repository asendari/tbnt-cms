<?php

namespace Tbnt\Cms\Utils;

class EnvUtils
{
    /**
     * Read .env values
     *
     * @param string $env_file Env file (.env or .env.example)
     * @param array $data Data to read
     * @return array|false
     */
    public static function get(string $env_file, $data = [])
    {
        $filename = base_path($env_file);
        $is_array = is_array($data);

        if (file_exists($filename) === false || count(to_array($data)) === 0) {
            return $is_array === true ? [] : false;
        }

        $env = explode(PHP_EOL, file_get_contents($filename));
        $values = [];

        foreach (to_array($data) as $key) {
            foreach ($env as $env_key => $env_value) {
                $entry = explode('=', $env_value, 2);

                if ($entry[0] === $key) {
                    if ($is_array === false) {
                        return $entry[1] ?? '';
                    } else {
                        $values[$env_key] = $entry[1] ?? '';
                    }
                }
            }
        }

        return $values;
    }

    /**
     * Write .env values
     *
     * @param string $env_file Env file (.env or .env.example)
     * @param array $data Data to read
     * @return bool
     */
    public static function set(string $env_file, $data = [])
    {
        $filename = base_path($env_file);

        if (file_exists($filename) === false || count($data) === 0) {
            return false;
        }

        $env = explode(PHP_EOL, file_get_contents($filename));

        foreach ($data as $key => $value) {
            $found = false;

            foreach ($env as $env_key => $env_value) {
                $entry = explode('=', $env_value, 2);

                if ($entry[0] === $key) {
                    $env[$env_key] = $key . '=' . $value;
                    $found = true;
                } else {
                    $env[$env_key] = $env_value;
                }
            }

            if ($found === false) {
                $env[$key] = $key . '=' . $value;
            }
        }

        file_put_contents($filename, implode(PHP_EOL, $env));

        return true;
    }
}

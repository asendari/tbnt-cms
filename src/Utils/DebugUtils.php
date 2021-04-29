<?php

namespace Tbnt\Cms\Utils;

class DebugUtils
{
    /**
     * Start debug time
     *
     * @var int
     */
    public $time_start = 0;

    /**
     * Create a new instance
     *
     * @return void
     */
    public function __construct()
    {
        $this->resetTime();
    }

    /**
     * Reset the execution time
     *
     * @return void
     */
    public function resetTime()
    {
        $this->time_start = microtime(true);
    }

    /**
     * Get the execution time
     *
     * @return int
     */
    public function getTime()
    {
        return microtime(true) - $this->time_start;
    }
}

<?php

namespace Tbnt\Cms\Commands\Traits;

trait BaseCommandTrait
{
    /**
     * Get formatted option or ask for it
     *
     * @param string $name
     * @param string $message
     * @param string $default
     * @return mixed
     */
    protected function optionAsk(string $name, string $message, $default = ' ')
    {
        return $this->optionSafe($name) ?? $this->askSafe($message, $default);
    }

    /**
     * Get formatted option or confirm it
     *
     * @param string $name
     * @param string $message
     * @param bool $default
     * @return mixed
     */
    protected function optionConfirm(string $name, string $message, $default = false)
    {
        return to_bool($this->optionSafe($name) ?? $this->confirm($message, $default));
    }

    /**
     * Get formatted option or confirm it
     *
     * @param string $name
     * @param string $message
     * @param array $options
     * @param bool $default
     * @return mixed
     */
    protected function optionChoice(string $name, string $message, array $options, $default = false)
    {
        return to_bool($this->optionSafe($name) ?? $this->choice($message, $options, $default));
    }

    /**
     * Get formatted option
     *
     * @param string $name
     * @return mixed
     */
    protected function optionSafe(string $name)
    {
        return $this->formatArg($this->option($name));
    }

    /**
     * Get formatted ask
     *
     * @param string $message
     * @param string $default
     * @return mixed
     */
    protected function askSafe(string $message, $default = ' ')
    {
        return $this->formatArg($this->ask($message, $default));
    }

    /**
     * Get formatted argument
     *
     * @param string $name
     * @return mixed
     */
    protected function argumentSafe(string $name)
    {
        return $this->formatArg($this->argument($name));
    }

    /**
     * Format argument
     *
     * @param mixed $arg
     * @return mixed
     */
    protected function formatArg($arg)
    {
        return trim($arg) ?: null;
    }
}

<?php

namespace Tbnt\Cms\Utils;

/**
 * @url https://medium.com/@m.f.m.barber/php-bytesize-optimizing-file-handling-part-1-read-824ff779278d
 * @url https://medium.com/@m.f.m.barber/php-bytesize-optimizing-file-handling-part-2-write-1b13b7f8e615
 */
class FileBufferUtils
{
    /**
     * Reading chunk size.
     *
     * @var int
     */
    const CHUNK_SIZE = 4096 * 64;

    /**
     * Max lines before writing.
     *
     * @var int
     */
    const WRITE_BUFFER_LIMIT = 200;

    /**
     * ...
     *
     * @var array
     */
    private $chunk = [];

    /**
     * ...
     *
     * @var string|array
     */
    private $buffer = '';

    /**
     * ...
     *
     * @var array
     */
    private $write_buffer = [];

    /**
     * ...
     *
     * @var int
     */
    private $write_buffer_counter = 0;

    /**
     * ...
     *
     * @var resource|false
     */
    private $fp = false;

    /**
     * ...
     *
     * @var string
     */
    private $path = '';

    /**
     * ...
     *
     * @var int|null
     */
    private $write_buffer_limit = null;

    /**
     * Open file.
     *
     * @param string $path
     * @param string $modifier
     * @return bool
     */
    public function open(string $path, $modifier = 'r')
    {
        $this->path = $path;

        $this->close();

        if (!$this->fp) {
            $this->fp = fopen($path, $modifier);
        }

        return boolval($this->fp);
    }

    /**
     * Rewind file.
     *
     * @return void
     */
    public function rewind()
    {
        if ($this->fp) {
            rewind($this->fp);

            $this->chunk = [];
            $this->buffer = '';
        }
    }

    /**
     * Close file.
     *
     * @param bool $flush
     * @return void
     */
    public function close($flush = false)
    {
        if ($this->fp) {
            if ($flush) {
                $this->flushLines();
            }

            fclose($this->fp);

            $this->fp = false;
            $this->path = '';
        }
    }

    /**
     * Open file.
     *
     * @return int|false
     */
    public function count()
    {
        if (!$this->path) {
            return false;
        }

        $fp = new self();
        $fp_opened = $fp->open($this->path, 'r');

        if (!$fp_opened) {
            return false;
        }

        $count = 0;

        while ($line = $fp->nextLine()) {
            if ($line === false) {
                break;
            }

            $count += 1;
        }

        return $count;
    }

    /**
     * Set write buffer limit.
     *
     * @param int|null $write_buffer_limit
     * @return void
     */
    public function setWriteBuffer($write_buffer_limit = null)
    {
        $this->write_buffer_limit = $write_buffer_limit;

        if ($this->write_buffer_counter >= ($this->write_buffer_limit ?? static::WRITE_BUFFER_LIMIT)) {
            $this->flushLines();
        }
    }

    /**
     * Read next line of file.
     *
     * @return string|false
     */
    public function nextLine()
    {
        if (empty($this->chunk)) {
            if (feof($this->fp)) {
                return false;
            }

            $this->chunk = $this->buffer . fread($this->fp, static::CHUNK_SIZE);
            $this->chunk = preg_split("/\\r\\n|\\r|\\n/", $this->chunk);

            if (!feof($this->fp)) {
                $this->buffer = array_pop($this->chunk);
            }
        }

        return '' === ($line = array_shift($this->chunk)) ? false : $line;
    }

    /**
     * Read file line by line.
     *
     * @param string $content
     * @param bool $flush
     * @return bool
     */
    public function writeLine(string $content, $flush = false)
    {
        $result = true;

        $this->write_buffer[] = $content;

        ++$this->write_buffer_counter;

        if ($this->write_buffer_counter >= ($this->write_buffer_limit ?? static::WRITE_BUFFER_LIMIT) || $flush) {
            $result = $this->flushLines();
        }

        return $result;
    }

    /**
     * Read file line by line.
     *
     * @return bool
     */
    public function flushLines()
    {
        $result = (bool) fwrite($this->fp, static::arrayToString($this->write_buffer));

        $this->write_buffer = [];
        $this->write_buffer_counter = 0;

        return $result;
    }

    /**
     * Convert array to string.
     *
     * @param array $array
     * @param mixed $concat
     * @return string
     */
    private static function arrayToString(array $array, $concat = '')
    {
        return implode($concat, $array);
    }
}

<?php

namespace Tbnt\Cms\Utils;

use Exception;
use Illuminate\Console\OutputStyle;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tbnt\Cms\Model\BaseModelUuid;
use Tbnt\Cms\Model\File;
use Tbnt\Cms\Model\Post;
use Tbnt\Cms\Model\PostItem;
use Tbnt\Cms\Model\PostItemLang;
use Tbnt\Cms\Model\PostLang;
use Tbnt\Cms\Model\PostType;
use Tbnt\Cms\Model\PostTypeItem;
use Tbnt\Cms\Model\PostTypeItemCondition;
use Tbnt\Cms\Model\PostTypeItemLang;
use Tbnt\Cms\Model\PostTypeItemRestriction;
use Tbnt\Cms\Model\PostTypeLang;

class MigrationUtils
{
    /**
     * Glue to separate batch and uuid.
     *
     * @var string
     */
    const INDEX_GLUE = '-';

    /**
     * Glue to separate table and date and batch.
     *
     * @var string
     */
    const TABLE_GLUE = '-';

    /**
     * Glue to separate index and data.
     *
     * @var string
     */
    const DATA_GLUE = '|';

    /**
     * Files extension.
     *
     * @var string
     */
    const FILE_EXTENTION = 'txt';

    /**
     * Max lines per file.
     *
     * @var int
     */
    const MAX_LINES = 25 * 1000;

    /**
     * The order of migration import.
     *
     * @var BaseModelUuid[]
     */
    const TABLES_ORDER = [
        'files' => File::class,
        'post_types' => PostType::class,
        'post_type_langs' => PostTypeLang::class,
        'post_type_items' => PostTypeItem::class,
        'post_type_item_langs' => PostTypeItemLang::class,
        'posts' => Post::class,
        'post_langs' => PostLang::class,
        'post_items' => PostItem::class,
        'post_item_langs' => PostItemLang::class,
        'post_type_item_conditions' => PostTypeItemCondition::class,
        'post_type_item_restrictions' => PostTypeItemRestriction::class,
    ];

    /**
     * Is migration locked.
     *
     * @var bool
     */
    protected static $locked = false;

    /**
     * Get storage disk.
     *
     * @return Filesystem
     */
    protected static function getDisk()
    {
        return Storage::disk('migrations');
    }

    /**
     * Format index.
     *
     * @param BaseModelUuid $model
     * @return string
     */
    protected static function formatIndex(BaseModelUuid $model)
    {
        return $model->batch . static::INDEX_GLUE . $model->id;
    }

    /**
     * Format file base with glue.
     *
     * @param array $parts
     * @return string
     */
    protected static function formatFileBase(array $parts)
    {
        return implode(static::TABLE_GLUE, to_array($parts));
    }

    /**
     * Format filename with extension.
     *
     * @param array $parts
     * @return string
     */
    protected static function formatFileName(array $parts)
    {
        return trim(self::formatFileBase($parts), '.' . static::FILE_EXTENTION) . '.' . static::FILE_EXTENTION;
    }

    /**
     * Generate new file base (without extension).
     *
     * @param string $table
     * @param string|null $date
     * @return string
     */
    protected static function generateFileBase(string $table, $date = null)
    {
        return self::formatFileBase([$table, $date ?? date('Y_m_d_His')]);
    }

    /**
     * Encode json accordingly.
     *
     * @param mixed $data
     * @return string
     */
    public static function encode($data)
    {
        return json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Get model data.
     *
     * @param BaseModelUuid $model
     * @return array|null
     */
    protected static function getData(BaseModelUuid $model)
    {
        $model->updateBatch();

        return $model->getOriginal();
    }

    /**
     * Get table files.
     *
     * @param string $table
     * @return array
     */
    protected static function getTableFiles(string $table)
    {
        $files = array_filter(self::files(), function ($f) use ($table) {
            return strpos($f, $table . static::TABLE_GLUE) !== false;
        });

        natsort($files);

        return array_values($files);
    }

    /**
     * Get table files.
     *
     * @param string $table
     * @param int $batch
     * @return string
     */
    protected static function getBatchFile(string $table, int $batch)
    {
        // Get table migrations
        $files = self::getTableFiles($table);

        // Get table migration filename to update
        $last_batch = 0;
        $filename = '';

        foreach ($files as $i => $file) {
            $file_parts = explode(static::TABLE_GLUE, $file);
            $file_batch = array_pop($file_parts);

            if ($batch >= $last_batch && $batch <= $file_batch) {
                break;
            }

            $last_batch = $file_batch;
            $filename = $file;
        }

        return $filename;
    }

    /**
     * Rename table files.
     *
     * @param string $table
     * @param string $file_base
     * @return void
     */
    protected static function renameTableFiles(string $table, string $file_base)
    {
        foreach (self::getTableFiles($table) as $file) {
            $file_parts = explode(static::TABLE_GLUE, $file);
            $file_batch = array_pop($file_parts);

            $filename = self::formatFileName([$file_base, $file_batch]);

            rename(self::filePath($file), self::filePath($filename));
        }
    }

    /**
     * Create migration.
     *
     * @param BaseModelUuid $model
     * @param string|null $date
     * @return bool
     * @deprecated This is a first draft, that needs to be improved.
     */
    public static function create(BaseModelUuid $model, $date = null)
    {
        if (self::$locked === true) {
            return false;
        }

        $model->refresh();

        // Get table name
        $table = $model->getTable();

        // Get model data
        $data = self::getData($model);

        if ($data) {
            // Generate table migrations base name (without extension)
            $file_base = self::generateFileBase($table, $date);

            // Get table migration filename to create/update
            $filename = self::getBatchFile($table, $data['batch']) ?? self::formatFileName([$file_base, 0]);

            // Init table migration file
            if (!self::fileExists($filename)) {
                self::getDisk()->put($filename, '');
            }

            // Open writer
            $write = new FileBufferUtils();
            $write_opened = $write->open(self::filePath($filename), 'r+');

            if (!$write_opened) {
                return false;
            }

            // Check lines count
            $count = 0;
            $last_line = '';

            while ($line = $write->nextLine()) {
                if ($line === false) {
                    break;
                }

                $count += 1;
                $last_line = $line;
            }

            $last_line_parts = explode(static::INDEX_GLUE, explode(static::DATA_GLUE, $last_line)[0] ?? '');
            $last_line_batch = intval(array_shift($last_line_parts) ?: $data['batch']);

            // Create new chunk
            if ($count >= static::MAX_LINES && $last_line_batch !== $data['batch']) {
                $write->close(true);

                $filename = self::formatFileName([$file_base, $data['batch']]);

                self::getDisk()->put($filename, '');

                $write_opened = $write->open(self::filePath($filename), 'r+');

                if (!$write_opened) {
                    return false;
                }
            }

            // Write migration into file
            $write->writeLine(self::formatIndex($model) . static::DATA_GLUE . self::encode($data) . PHP_EOL);

            // Close writer
            $write->close(true);

            // Update migrations date
            self::renameTableFiles($table, $file_base);
        }

        return true;
    }

    /**
     * Update migration.
     *
     * @param BaseModelUuid $model
     * @param string|null $date
     * @return bool
     * @deprecated This is a first draft, that needs to be improved.
     */
    public static function alter(BaseModelUuid $model, $date = null)
    {
        if (self::$locked === true) {
            return false;
        }

        $updated = false;

        $model->refresh();

        // Get table name
        $table = $model->getTable();

        // Get model data
        $data = self::getData($model);

        if ($data) {
            // Get table migration filename to update
            $filename = self::getBatchFile($table, $data['batch']);

            if (!self::fileExists($filename)) {
                return false;
            }

            // Format migration index
            $index = self::formatIndex($model);

            // Encode migration content
            $content = self::encode($data);

            // Create reader
            $read = new FileBufferUtils();
            $read_opened = $read->open(self::filePath($filename), 'r');

            if (!$read_opened) {
                return false;
            }

            // Create writer (temp file)
            $write = new FileBufferUtils();
            $write_opened = $write->open(
                str_replace('.' . static::FILE_EXTENTION, '.temp.' . static::FILE_EXTENTION, self::filePath($filename)),
                'w'
            );

            if (!$write_opened) {
                return false;
            }

            // Compare line by line
            while ($line = $read->nextLine()) {
                if ($line === false) {
                    break;
                }

                $line_comp = explode(static::DATA_GLUE, $line);

                if ($line_comp[0] === $index) {
                    $updated = true;

                    // Update line
                    $write->writeLine($index . static::DATA_GLUE . $content . PHP_EOL);
                } else {
                    // Keep line
                    $write->writeLine($line . PHP_EOL);
                }
            }

            // Close writer
            $write->close(true);

            // Close reader
            $read->close();

            // Move temp migration file into migration file
            rename(
                str_replace('.' . static::FILE_EXTENTION, '.temp.' . static::FILE_EXTENTION, self::filePath($filename)),
                self::filePath($filename)
            );

            // Generate table migrations base name (without extension)
            $file_base = self::generateFileBase($table, $date);

            // Update migrations date
            self::renameTableFiles($table, $file_base);
        }

        return $updated;
    }

    /**
     * Add migration.
     *
     * @param BaseModelUuid $model
     * @return bool
     * @deprecated This is a first draft, that needs to be improved.
     */
    public static function add(BaseModelUuid $model)
    {
        return self::create($model);
    }

    /**
     * Update migration.
     *
     * @param BaseModelUuid $model
     * @return bool
     * @deprecated This is a first draft, that needs to be improved.
     */
    public static function update(BaseModelUuid $model)
    {
        return self::alter($model) || self::create($model);
    }

    /**
     * Remove migration.
     *
     * @param BaseModelUuid $model
     * @return bool
     * @deprecated This is a first draft, that needs to be improved.
     */
    public static function remove(BaseModelUuid $model)
    {
        return self::alter($model);
    }

    /**
     * Empty migrations.
     *
     * @return void
     */
    public static function empty()
    {
        self::deleteFiles(self::files());
    }

    /**
     * Empty table migrations.
     *
     * @param string $table
     * @return void
     */
    public static function emptyTable(string $table)
    {
        self::deleteFiles(self::getTableFiles($table));
    }

    /**
     * Empty files and truncate all tables.
     *
     * @return void
     */
    public static function emptyTruncateAll()
    {
        self::empty();
        self::truncateAll();
    }

    /**
     * Get files.
     *
     * @param string|null $directory
     * @return array
     */
    public static function files($directory = null)
    {
        return self::getDisk()->files($directory);
    }

    /**
     * Delete files.
     *
     * @param string|array $files
     * @return void
     */
    public static function deleteFiles($files)
    {
        self::getDisk()->delete($files);
    }

    /**
     * Get file path.
     *
     * @param string $filename
     * @return string
     */
    public static function filePath(string $filename)
    {
        return dir_separator([config('filesystems.disks.migrations.root'), $filename]);
    }

    /**
     * Check if file exists.
     *
     * @param string $path
     * @return bool
     */
    public static function fileExists(string $path)
    {
        return self::getDisk()->exists($path);
    }

    /**
     * Write file content.
     *
     * @param string $path
     * @param string $content
     * @return void
     * @deprecated Was used in the first implementation attempt, but keeped in case of.
     */
    protected static function writeFile(string $path, string $content)
    {
        $zh = gzopen(self::filePath($path) . '.gz', 'w');

        if ($zh === false || -1 == gzwrite($zh, $content)) {
            self::getDisk()->put($path, $content);
        }

        gzclose($zh);
    }

    /**
     * Get file content.
     *
     * @param string $path
     * @param mixed $value_error
     * @return string|mixed
     * @deprecated Was used in the first implementation attempt, but keeped in case of.
     */
    protected static function readFile(string $path, $value_error = null)
    {
        $zh = gzopen(self::filePath($path), 'r');

        $content = '';

        if ($zh !== false) {
            while ($line = gzgets($zh, 1024)) {
                $content .= $line;
            }

            gzclose($zh);
        } else {
            return $value_error;
        }

        return $content;
    }

    /**
     * Export tables.
     *
     * @param string|null $date
     * @param OutputStyle|null $output
     * @return void
     */
    public static function exportAll($date = null, $output = null)
    {
        foreach (static::TABLES_ORDER as $table => $model) {
            self::exportTable($table, $date, $output);
        }
    }

    /**
     * Export table.
     *
     * @param string $table
     * @param string|null $date
     * @param OutputStyle|null $output
     * @param int $chunk_count
     * @return void
     */
    public static function exportTable(string $table, $date = null, $output = null, $chunk_count = 3000)
    {
        $from = microtime(true);

        $max = return_bytes(ini_get('memory_limit')) / 1024 / 1024 - 32;

        $output = optional($output);

        self::emptyTable($table);

        // Generate table migrations base name (without extension)
        $model = static::TABLES_ORDER[$table] ?? null;

        // Generate table migrations base name (without extension)
        $file_base = self::generateFileBase($table, $date);

        // Get table migration filename to create/update
        $filename = self::formatFileName([$file_base, 0]);

        // Init table migration file
        self::getDisk()->put($filename, '');

        // Log migration file
        $output->writeln(
            "<fg=yellow>Exporting:</> <fg=default>{$table}" . ($chunk_count < 3000 ? " (slower: {$chunk_count})" : '') . '</>'
        );

        // Open writer
        $write = new FileBufferUtils();
        $write_opened = $write->open(self::filePath($filename), 'r+');

        if (!$write_opened) {
            return;
        }

        // Create progress bar
        $bar = null;
        $count = app($model)
            ->migratable()
            ->count();

        if ($output && $count) {
            $bar = $output->createProgressBar($count);

            if ($bar) {
                $bar->start();
            }
        }

        $lines_count = 0;
        $last_line_batch = 0;

        // Dump database into chunks
        try {
            $model
                ::migratable()
                ->orderBy('batch')
                ->chunk($chunk_count, function ($results) use (
                    &$lines_count,
                    &$last_line_batch,
                    &$write,
                    $file_base,
                    $bar,
                    $max
                ) {
                    foreach ($results as $data) {
                        if (memory_get_usage() / 1024 / 1024 >= $max) {
                            $write->flushLines();
                        }

                        if (memory_get_usage() / 1024 / 1024 >= $max) {
                            throw new Exception('max_memory');
                        }

                        if ($lines_count >= static::MAX_LINES && $last_line_batch !== $data->batch) {
                            $write->close(true);

                            $filename = self::formatFileName([$file_base, $data->batch]);

                            self::getDisk()->put($filename, '');

                            $write = new FileBufferUtils();
                            $write_opened = $write->open(self::filePath($filename), 'r+');

                            if (!$write_opened) {
                                return;
                            }

                            $lines_count = 0;
                        }

                        $write->writeLine(self::formatIndex($data) . static::DATA_GLUE . self::encode($data) . PHP_EOL);

                        $last_line_batch = $data->batch;

                        $lines_count += 1;

                        // Advance progress bar
                        if (isset($bar)) {
                            $bar->advance();
                        }
                    }

                    unset($results);
                });
        } catch (Exception $e) {
            unset($model);
            unset($results);

            if (isset($bar)) {
                $bar->finish();
                $output->writeln('');
                unset($bar);
            }

            if ($e->getMessage() === 'max_memory') {
                unset($e);

                $new_chunk_count = 0;

                if ($chunk_count > 3000) {
                    $new_chunk_count = 3000;
                } elseif ($chunk_count > 300) {
                    $new_chunk_count = 300;
                } elseif ($chunk_count > 100) {
                    $new_chunk_count = 100;
                }

                if ($new_chunk_count) {
                    $write->close(true);

                    unset($write);

                    self::exportTable($table, $date, $output, $new_chunk_count);

                    return;
                }
            } else {
                $output->writeln("<fg=red>Cannot export create migrations: {$e->getMessage()}</>");
            }
        }

        // Close writter
        $write->close(true);

        // End progress bar
        if (isset($bar)) {
            $bar->finish();
            $output->writeln('');
            unset($bar);
        }

        // Log migrated file
        $total = round(microtime(true) - $from, 2);

        $output->writeln(
            '<fg=green>Exported: </> <fg=default>' .
                $table .
                ' (' .
                ($count ? $total . ' second' . ($total > 1 ? 's' : '') : 'empty') .
                ')</>'
        );
    }

    /**
     * Truncate tables.
     *
     * @return void
     */
    public static function truncateAll()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        foreach (array_reverse(static::TABLES_ORDER) as $table => $model) {
            DB::table($table)->truncate();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Set migration process inactive.
     *
     * @return void
     */
    public static function setLocked()
    {
        self::$locked = true;
    }

    /**
     * Set migration process active.
     *
     * @return void
     */
    public static function setUnlocked()
    {
        self::$locked = false;
    }
}

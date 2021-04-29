<?php

namespace Tbnt\Cms\Utils;

use Exception;
use Illuminate\Support\Facades\Storage;

class BackupUtils
{
    const QUARTERLY = 60 * 15;
    const HOURLY = 60 * 60;
    const DAILY = 60 * 60 * 24;
    const WEEKLY = 60 * 60 * 24 * 7;

    /**
     * Timeframes
     *
     * @var array
     */
    public static $timeframes = [
        'quarterly' => self::QUARTERLY,
        'hourly' => self::HOURLY,
        'daily' => self::DAILY,
        'weekly' => self::WEEKLY,
    ];

    /**
     * Timeframes
     *
     * @var string
     */
    public static $backup_dir = 'backup/db';

    /**
     * Backup timeframes
     *
     * @return void
     * @throws Exception
     */
    public static function backupTimeframes()
    {
        foreach (self::$timeframes as $folder => $timeframe) {
            self::backupTimeframe($folder, $timeframe);
        }
    }

    /**
     * Backup timeframe
     *
     * @param string $folder Backup folder
     * @param int $timeframe Time since last backup
     * @return void
     * @throws Exception
     */
    public static function backupTimeframe(string $folder, int $timeframe)
    {
        Storage::makeDirectory(dir_separator([self::$backup_dir, $folder]));

        $files = arr()->last(Storage::files(dir_separator([self::$backup_dir, $folder])));

        if ($files !== null && $timeframe >= now()->diffInSeconds(carbon(Storage::lastModified($files)), 'seconds')) {
            return;
        }

        self::backup($folder, 10);
    }

    /**
     * Backup database
     *
     * @param string $folder folder
     * @param int|null $count to keep
     * @return string
     * @throws Exception
     */
    public static function backup(string $folder, $count = null)
    {
        // Format backup file path
        $backup_folder = dir_separator([self::$backup_dir, $folder]);

        // Create folder
        Storage::makeDirectory($backup_folder);

        // Backup database
        $path = dir_separator(['app', $backup_folder, date('Y_m_d_His') . '.sql.gz']);

        MySQLDumpUtils::connect()->save(storage_path($path));

        // Clean backup folder
        if ($count) {
            self::clean($folder, $count);
        }

        return $path;
    }

    /**
     * Clean backup folder
     *
     * @param string $folder to clean
     * @param int $count count to keep
     * @return void
     */
    public static function clean(string $folder, int $count)
    {
        // Get files directory
        $files = Storage::files(dir_separator([self::$backup_dir, $folder]));
        $files = collect($files)
            ->sort()
            ->reverse()
            ->values();

        // Filter files to delete
        $files_to_delete = $files->take(0 - max([0, $files->count() - $count]));

        // Delete files
        Storage::delete($files_to_delete->all());
    }
}

<?php

namespace Tbnt\Cms\Commands;

use Exception;
use Illuminate\Support\Facades\DB;
use Tbnt\Cms\Utils\BackupUtils;
use Tbnt\Cms\Utils\FileBufferUtils;
use Tbnt\Cms\Utils\MigrationUtils;

class MigrateCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:migrate
							{--skip-backup : Skip database backup}
							{--skip-migrations : Skip end migrations}
							{--truncate : Truncate before migrate}
							{--progress : Verbose output}
							{--time-limit=60 : PHP time limit in minutes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate cms posts.';

    /**
     * Backup directory
     *
     * @var string
     */
    protected $backup_folder = 'migrations';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        set_time_limit_safe(1 * 60 * ($this->optionSafe('time-limit') || 60));

        $skip_backup = $this->optionSafe('skip-backup');
        $skip_migrations = $this->optionSafe('skip-migrations');
        $truncate = $this->optionSafe('truncate');
        $verbose = $this->optionSafe('progress');

        $max = return_bytes(ini_get('memory_limit')) / 1024 / 1024 / 4 / 2;

        $from_total = microtime(true);

        DB::connection()->disableQueryLog();

        // Backing up database
        if (!$skip_backup) {
            try {
                $this->info('<fg=yellow>Backing up database...</>');

                $backup_file = BackupUtils::backup($this->backup_folder);

                $this->info('<fg=green>Database backed up (storage/' . $backup_file . ').</>');
            } catch (Exception $e) {
                $this->info('<fg=red>Database backup failed, aborting.</>');

                return;
            }
        }

        // Truncate tables
        if ($truncate) {
            MigrationUtils::truncateAll();

            $this->info('<fg=green>Tables truncated.</>');
        }

        // Get migrations
        $files = MigrationUtils::files();

        if (!count($files)) {
            $this->info('<fg=green>Nothing to migrate.</>');

            return;
        }

        // Sort migrations
        natsort($files);

        // Group migrations by table
        $files_grouped = [];

        foreach ($files as $filename) {
            $parts = explode(MigrationUtils::TABLE_GLUE, $filename);
            $table = array_shift($parts);

            if (!isset($files_grouped[$table])) {
                $files_grouped[$table] = [];
            }

            array_push($files_grouped[$table], $filename);
        }

        unset($parts);
        unset($table);

        $files = array_values($files);
        $db_batch = [];

        foreach (MigrationUtils::TABLES_ORDER as $table => $model) {
            $date = null;

            foreach ($files_grouped[$table] ?? [] as $filename) {
                $from = microtime(true);
                $file_base = explode('.', $filename)[0];

                $parts = explode(MigrationUtils::TABLE_GLUE, $file_base);
                array_shift($parts);
                $date = array_shift($parts);

                // Log migration file
                $this->info('<fg=yellow>Migrating:</> <fg=default>' . $file_base . '</>');

                // Create reader
                $read = new FileBufferUtils();
                $read_opened = $read->open(MigrationUtils::filePath($filename), 'r');

                if (!$read_opened) {
                    $this->info('<fg=red>Cannot read file, aborting.</>');

                    return;
                }

                // Create progress bar
                $bar = null;
                $count = $read->count();

                if ($verbose && $count) {
                    $bar = $this->output->createProgressBar($count);
                    $bar->start();
                }

                // Read line by line
                while ($line = $read->nextLine()) {
                    if ($line === false) {
                        break;
                    }

                    $line_parts = explode(MigrationUtils::DATA_GLUE, $line);
                    $line_index = array_shift($line_parts);
                    $line_data = array_shift($line_parts);

                    $index_parts = explode(MigrationUtils::INDEX_GLUE, $line_index);

                    array_shift($index_parts);

                    $migration = json_decode($line_data, true);
                    $migration_error = !$line_data || json_last_error() !== JSON_ERROR_NONE;

                    // Add or update row in database
                    if ($migration && !$migration_error) {
                        $statements = ['insert' => [], 'values' => [], 'update' => []];

                        foreach (DB::prepareBindings($migration) as $key => $value) {
                            if ($key === 'data') {
                                $value = $value
                                    ? '\'' . str_replace('\'', '\\\'', MigrationUtils::encode($value)) . '\''
                                    : MigrationUtils::encode(null);
                            } else {
                                $value = MigrationUtils::encode($value);
                            }

                            $statements['insert'][] = $key;
                            $statements['values'][] = $value;
                            $statements['update'][] = '`' . $key . '`=' . $value;
                        }

                        $db_batch[] =
                            '
                            INSERT INTO `' .
                            $table .
                            '` (`' .
                            implode('`,`', $statements['insert']) .
                            '`)
                            VALUES (' .
                            implode(',', $statements['values']) .
                            ')
                            ON DUPLICATE KEY UPDATE ' .
                            implode(',', $statements['update']) .
                            ';';

                        if (memory_get_usage() / 1024 / 1024 >= $max) {
                            DB::unprepared(implode('', $db_batch));

                            $db_batch = [];
                        }
                    }

                    // Advance progress bar
                    if (isset($bar)) {
                        $bar->advance();
                    }
                }

                // Close reader
                $read->close();

                // End progress bar
                if (isset($bar)) {
                    $bar->finish();
                    $this->info('');
                    unset($bar);
                }

                // Log migrated file
                $total = round(microtime(true) - $from, 2);

                $this->info(
                    '<fg=green>Migrated: </> <fg=default>' .
                        $file_base .
                        ' (' .
                        ($count ? $total . ' second' . ($total > 1 ? 's' : '') : 'empty') .
                        ')</>'
                );
            }

            // Refresh migrations
            if (!$skip_migrations) {
                MigrationUtils::exportTable($table, $date, $this->output);
            }
        }

        if (count($db_batch)) {
            DB::unprepared(implode('', $db_batch));
        }

        // Log migrated file
        if ($verbose) {
            $totalTime = round(microtime(true) - $from_total, 2);

            $this->info('<fg=green>Migrations done (' . $totalTime . ' second' . ($totalTime > 1 ? 's' : '') . '.</>');
        }
    }
}

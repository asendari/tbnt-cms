<?php

namespace Tbnt\Cms\Commands;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class MySqlDumpCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:mysql-dump
							{--compress= : Gzip backup}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a backup of the database using mysqldump (may export your db without emoji issues)';

    /**
     * Backup directory
     *
     * @var string
     */
    protected $backup_dir = 'backup/mysql';

    /**
     * Backup directory
     *
     * @var string
     */
    protected $file_path = '';

    /**
     * PROCESS
     *
     * @var Process|null
     */
    protected $process = null;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        Storage::makeDirectory($this->backup_dir);

        $this->file_path = storage_path(
            'app/' .
                slash_end($this->backup_dir) .
                str()->slug(config('database.connections.mysql.database') . '-' . to_datetime_string(now())) .
                '.sql'
        );

        $this->process = new Process(
            sprintf(
                '/Applications/MAMP/Library/bin/mysqldump --host=127.0.0.1 --user=%s --password=%s --hex-blob --default-character-set=binary --log-error=mysql-error.log %s > %s',
                config('database.connections.mysql.username'),
                config('database.connections.mysql.password'),
                config('database.connections.mysql.database'),
                $this->file_path
            )
        );
    }

    /**
     * Execute the console command.
     *
     * @return VOID
     */
    public function handle()
    {
        $this->info('Backing up database...');

        try {
            $this->process->mustRun();

            $compress = to_bool($this->optionSafe('compress') ?? true);

            if ($compress === true) {
                copy($this->file_path, 'compress.zlib://' . $this->file_path . '.gz');
                unlink($this->file_path);
            }

            $this->info(
                'Backup successfully created in: ' .
                    str_replace(base_path(), '', $compress === true ? $this->file_path . '.gz' : $this->file_path)
            );
        } catch (ProcessFailedException $exception) {
            $this->error('An error occurred while dumping database.');
        }
    }
}

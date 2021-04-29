<?php

namespace Tbnt\Cms\Commands;

use Exception;
use Tbnt\Cms\Utils\BackupUtils;
use Tbnt\Cms\Utils\MigrationUtils;

class TruncatePostsCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:truncate-posts
							{--skip-backup : Skip database backup}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Truncate posts.';

    /**
     * Backup directory
     *
     * @var string
     */
    protected $backup_folder = 'migrations';

    /**
     * Backup filepath
     *
     * @var string
     */
    protected $backup_file = '';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        // Backing up database
        if (!$this->optionSafe('skip-backup')) {
            try {
                $this->info('<fg=yellow>Backing up database...</>');

                $this->backup_file = BackupUtils::backup($this->backup_folder);

                $this->info('<fg=green>Database backup done in storage/' . $this->backup_file . '.</>');
            } catch (Exception $e) {
                $this->info('<fg=red>Database backup failed, aborting.</>');

                return;
            }
        }

        // Truncate posts
        try {
            MigrationUtils::truncateAll();
        } catch (Exception $e) {
            $this->info("<fg=red>Truncate error: {$e->getMessage()}</>");

            if ($this->backup_file) {
                $this->info(
                    "<fg=yellow>Please use the recent database backup at {$this->backup_file} to revert your database.</>"
                );
            }

            return;
        }

        // Log migrated file
        $this->info('<fg=green>Truncate done.</>');
    }
}

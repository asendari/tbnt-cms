<?php

namespace Tbnt\Cms\Commands;

use Exception;
use Tbnt\Cms\Utils\BackupUtils;

class BackupDatabaseCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:backup-database
							{--folder= : Folder to store the backup}
							{--count= : Clean the folder to keep a maximum of backoup count}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a backup of the database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     * @throws Exception
     */
    public function handle()
    {
        // Prompt for folder
        $folder = $this->optionAsk('folder', 'What is the backup destination folder? (root: /storage/backup/db)', '/');

        if ($folder === null) {
            $this->line('Folder name is empty, aborting...');
            return;
        }

        // Backup database
        BackupUtils::backup($folder);

        // Clean backup folder
        $count = $this->optionAsk('count', 'How many backup do you want to keep? (Press enter to skip)');

        if ($count) {
            BackupUtils::clean($folder, $count);
        }
    }
}

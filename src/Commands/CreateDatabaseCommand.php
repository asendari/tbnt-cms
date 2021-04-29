<?php

namespace Tbnt\Cms\Commands;

use Exception;
use Illuminate\Support\Facades\DB;
use Tbnt\Cms\Utils\BackupUtils;
use Tbnt\Cms\Utils\EnvUtils;

class CreateDatabaseCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:create-database
							{--dummy= : Dummy database name (needed to initialize the database)}
							{--database= : Database name}
							{--migrate= : Do the migrations}
							{--force= : Force the migration}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create database and do migration';

    /**
     * Backup directory
     *
     * @var string
     */
    protected $backup_folder = 'create-database';

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
     */
    public function handle()
    {
        // Check if user know about dummy database
        $this->info(
            'In order to create a database, you must have a working connection to a "dummy" database (like, any database already created you have under the same connection).'
        );

        if ($this->optionSafe('dummy') === null && $this->confirm('Do you want to continue?') === false) {
            return;
        }

        // Set dummy database
        $check = $this->setDummyDatabase();

        // Set database
        if ($check === true) {
            $this->setDatabase();
        }
    }

    /**
     * Execute the console command.
     *
     * @return bool
     */
    public function setDummyDatabase()
    {
        // Prompt for dummy database name
        $name = $this->optionAsk('dummy', 'What is the dummy database name?', 'dummy');

        // Format dummy database name
        $database = str()->snake(strtolower($name));

        if ($name !== $database) {
            $this->info('Dummy database name has been formatted and will be "' . $database . '".');
        }

        if (!$database) {
            $this->line('Dummy database name is empty, aborting...');

            return false;
        }

        // Set DB_DATABASE in ".env"
        if (EnvUtils::set('.env', ['DB_DATABASE' => $database]) === true) {
            $this->info('Dummy database name successfully updated in ".env".');
        } else {
            $this->error('An error occurred while updating dummy database name in ".env".');

            return false;
        }

        // Reload database
        $this->reloadDatabase($database);

        // Check database connection
        try {
            DB::select('SELECT schema_name FROM information_schema.schemata WHERE schema_name = :database', [
                'database' => $database,
            ]);
        } catch (Exception $e) {
            $this->error('An error occurred while checking database connection.');

            return false;
        }

        return true;
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function setDatabase()
    {
        // Prompt for database name
        $name = $this->optionAsk('database', 'What is the new database name?');

        // Format database name
        $database = str()->snake(strtolower($name));

        if ($name !== $database) {
            $this->info('Database name has been formatted and will be "' . $database . '".');
        }

        if (!$database) {
            $this->line('Database name is empty, aborting...');
            return;
        }

        // Set DB_DATABASE in ".env"
        if (EnvUtils::set('.env', ['DB_DATABASE' => $database]) === true) {
            $this->info('Database name successfully updated in ".env".');
        } else {
            $this->error('An error occurred while updating database name in ".env".');
            return;
        }

        // Set DB_DATABASE in ".env.example"
        if (EnvUtils::set('.env.example', ['DB_DATABASE' => $database]) === true) {
            $this->info('Database name successfully updated in ".env.example".');
        } else {
            $this->error('An error occurred while updating database name in ".env.example". Continue...');
        }

        // Create database
        try {
            $schema_names = DB::select('SELECT schema_name FROM information_schema.schemata WHERE schema_name = :database', [
                'database' => $database,
            ]);
        } catch (Exception $e) {
            $this->error('An error occurred while checking database connection.');
            return;
        }

        if (to_bool(count($schema_names)) === true) {
            $this->info('Database already exists.');
        } else {
            $charset = config('database.connections.mysql.charset', 'utf8mb4');
            $collation = config('database.connections.mysql.collation', 'utf8mb4_unicode_ci');

            config(['database.connections.mysql.database' => null]);

            DB::statement("CREATE DATABASE IF NOT EXISTS $database CHARACTER SET $charset COLLATE $collation;");

            $this->info('Database successfully created.');
        }

        // Reload database
        $this->reloadDatabase($database);

        // Do database migrations
        if ($this->optionConfirm('migrate', 'Do you want to refresh the database migrations?') === true) {
            if (
                $this->optionConfirm(
                    'migrate',
                    'This will erase ALL data present in the table "' . $database . '", do you want to proceed?'
                ) === false
            ) {
                return;
            }

            $success = false;

            try {
                $result = DB::select('SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = :database', [
                    'database' => $database,
                ]);

                if (($result[0]->count ?? 1) !== 0) {
                    BackupUtils::backup($this->backup_folder, 0);
                }

                $success = true;
            } catch (Exception $e) {
                report($e);
            }

            if (
                $success === true ||
                $this->optionConfirm(
                    'force',
                    'An error occured while creating a backup of the database. Make sure to backup your database to prevent an accidental erase. Continue?'
                )
            ) {
                $this->call('migrate:fresh');
            }
        }
    }

    /**
     * Execute the console command.
     *
     * @param string|null $database
     * @return void
     */
    public function reloadDatabase($database = null)
    {
        if ($database !== null) {
            config(['database.connections.mysql.database' => $database]);
        }

        DB::connection()
            ->getDoctrineConnection()
            ->close();

        DB::disconnect();
        DB::reconnect();

        $this->info('Database connection reloaded.');
    }
}

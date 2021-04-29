<?php

namespace Tbnt\Cms\Commands;

use Tbnt\Cms\Utils\EnvUtils;

class SetAppNameCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:set-app-name
							{--name= : The app name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set app name

-> set .env/_example "APP_NAME"
-> set package.json "name"
	';

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
        $name = $this->optionAsk('name', 'What is the new project name?');

        if ($name === null) {
            $this->line('App name is empty, aborting...');
            return;
        }

        $app_name = '"' . $name . '"';

        // Set APP_NAME in ".env"
        if (EnvUtils::set('.env', ['APP_NAME' => $app_name]) === true) {
            $this->info('App name successfully updated in ".env".');
        } else {
            $this->error('An error occured while updating app name in ".env".');
        }

        // Set APP_NAME in ".env.example"
        if (EnvUtils::set('.env.example', ['APP_NAME' => $app_name]) === true) {
            $this->info('App name successfully updated in ".env.example".');
        } else {
            $this->error('An error occured while updating app name in ".env.example".');
        }

        // Set APP_NAME in "package.json"
        $filename = base_path('package.json');

        if (file_exists($filename) === false) {
            $this->error('An error occured while updating app name in ".env.example".');
            return;
        }

        $package = json_decode(file_get_contents($filename));
        $package->name = str()->slug($name);

        file_put_contents($filename, json_encode($package, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->info('App name successfully updated in "package.json".');
    }
}

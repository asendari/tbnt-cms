<?php

namespace Tbnt\Cms\Commands;

use Tbnt\Cms\Utils\EnvUtils;

class SetAppKeyCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:set-app-key';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set app key

-> set .env/_example "APP_KEY"
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
        // Generate new APP_KEY
        $this->call('key:generate');

        // Get APP_KEY from ".env"
        $app_key = EnvUtils::get('.env', 'APP_KEY');

        // Set APP_KEY in ".env.example"
        if (EnvUtils::set('.env.example', ['APP_KEY' => $app_key]) === true) {
            $this->info('App key successfully updated in ".env.example".');
        } else {
            $this->error('An error occured while updating app key in ".env.example".');
        }
    }
}

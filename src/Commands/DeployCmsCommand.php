<?php

namespace Tbnt\Cms\Commands;

class DeployCmsCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:deploy-cms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deploy CMS

-> run set-app-key
-> run set-app-name
-> run create-user
-> run set-laravel-passport
-> run set-laravel-passport
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
        // Run "set-app-key"
        $this->comment('### Running "set-app-key"...' . PHP_EOL);
        $this->call('cms:set-app-key');

        // Run "set-app-name"
        $this->comment(PHP_EOL . PHP_EOL . '### Running "set-app-name"...');
        $this->call('cms:set-app-name');

        // Run "create-user"
        $this->comment(PHP_EOL . PHP_EOL . '### Running "create-user"...');
        $this->call('cms:create-user');

        // Run "set-laravel-passport"
        $this->comment(PHP_EOL . PHP_EOL . '### Running "set-laravel-passport"...' . PHP_EOL);
        $this->call('cms:set-laravel-passport');
    }
}

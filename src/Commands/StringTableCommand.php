<?php

namespace Tbnt\Cms\Commands;

class StringTableCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:string-table
							{--string= : String to pluralize}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pluralize string as table name';

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
        // Prompt for string
        $string = $this->optionAsk('string', 'Please enter the string to pluralize:');

        if ($string === null) {
            $this->line('String is empty, aborting...');
            return;
        }

        // Pluralize string
        $string = str_replace('\\', '', str()->snake(str()->plural($string)));

        $this->info('String successfully pluralized:');

        $this->comment($string);
    }
}

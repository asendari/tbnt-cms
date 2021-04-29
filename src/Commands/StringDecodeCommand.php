<?php

namespace Tbnt\Cms\Commands;

class StringDecodeCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:string-decode
							{--string= : String to decode}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Decode string';

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
        $string = $this->optionAsk('string', 'Please enter the string to decode:');

        if ($string === null) {
            $this->line('String is empty, aborting...');
            return;
        }

        // Decode string
        $string = urldecode($string);

        $this->info('String successfully decoded:');

        $this->comment($string);
    }
}

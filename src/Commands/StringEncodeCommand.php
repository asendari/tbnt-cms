<?php

namespace Tbnt\Cms\Commands;

class StringEncodeCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:string-encode
							{--string= : String to encode}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Encode string';

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
        $string = $this->optionAsk('string', 'Please enter the string to encode:');

        if ($string === null) {
            $this->line('String is empty, aborting...');
            return;
        }

        // Encode string
        $string = urlencode($string);

        $this->info('String successfully encoded:');

        $this->comment($string);
    }
}

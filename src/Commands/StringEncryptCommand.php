<?php

namespace Tbnt\Cms\Commands;

class StringEncryptCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:string-encrypt
							{--string= : String to encrypt}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Encrypt string';

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
        $string = $this->optionAsk('string', 'Please enter the string to encrypt:');

        if ($string === null) {
            $this->line('String is empty, aborting...');
            return;
        }

        // Encrypt string
        $string = encrypt($string);

        $this->info('String successfully encrypted:');

        $this->comment($string);
    }
}

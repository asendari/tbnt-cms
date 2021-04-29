<?php

namespace Tbnt\Cms\Commands;

class StringDecryptCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:string-decrypt
							{--string= : String to decrypt}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Decrypt string';

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
        $string = $this->optionAsk('string', 'Please enter the string to decrypt:');

        if ($string === null) {
            $this->line('String is empty, aborting...');
            return;
        }

        // Decrypt string
        $string = decrypt_value($string);

        $this->info('String successfully decrypted:');

        $this->comment($string);
    }
}

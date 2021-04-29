<?php

namespace Tbnt\Cms\Commands;

use Illuminate\Support\Facades\Hash;

class StringHashCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:string-hash
							{--string= : String to hash}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hash string';

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
        $string = $this->optionAsk('string', 'Please enter the string to hash:');

        if ($string === null) {
            $this->line('String is empty, aborting...');
            return;
        }

        // Hash string
        $string = Hash::make($string);

        $this->info('String successfully hashed:');

        $this->comment($string);
    }
}

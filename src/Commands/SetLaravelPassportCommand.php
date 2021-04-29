<?php

namespace Tbnt\Cms\Commands;

use Exception;
use Illuminate\Support\Facades\DB;
use Tbnt\Cms\Utils\EnvUtils;

class SetLaravelPassportCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:set-laravel-passport';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set laravel passport

-> generate keys
-> set .env/_example "PERSONAL_CLIENT_ID"
-> set .env/_example "PERSONAL_CLIENT_SECRET"
-> set .env/_example "PASSWORD_CLIENT_ID"
-> set .env/_example "PASSWORD_CLIENT_SECRET"
-> set storage/oauth-xxx.key files (forced)
-> update "oauth" table
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
        // Truncate oauth tables
        try {
            DB::statement('TRUNCATE TABLE oauth_access_tokens');
            DB::statement('TRUNCATE TABLE oauth_auth_codes');
            DB::statement('TRUNCATE TABLE oauth_clients');
            DB::statement('TRUNCATE TABLE oauth_personal_access_clients');
            DB::statement('TRUNCATE TABLE oauth_refresh_tokens');

            $this->info('Laravel passport tables truncated.');
        } catch (Exception $e) {
            $this->error('An error occurred while updating database oauth tables.');
            return;
        }

        // Install passport
        $this->call('passport:install', ['--force' => 'default']);

        // Get passport keys
        $clients = DB::table('oauth_clients')->get();

        // Set passport keys
        foreach ($clients as $client) {
            $key_id = $client->personal_access_client == 1 ? 'PERSONAL_CLIENT_ID' : 'PASSWORD_CLIENT_ID';
            $key_secret = $client->personal_access_client == 1 ? 'PERSONAL_CLIENT_SECRET' : 'PASSWORD_CLIENT_SECRET';
            $key_name = $client->personal_access_client == 1 ? 'Personal' : 'Password';

            // Set XXX_CLIENT_ID/SECRET in ".env/.example"
            foreach (['.env', '.env.example'] as $file) {
                if (EnvUtils::set($file, [$key_id => $client->id]) === true) {
                    $this->info($key_name . ' client id successfully updated in "' . $file . '".');
                } else {
                    $this->error('An error occured while updating ' . strtolower($key_name) . ' client id in "' . $file . '".');
                }

                if (EnvUtils::set($file, [$key_secret => $client->secret]) === true) {
                    $this->info($key_name . ' client secret successfully updated in "' . $file . '".');
                } else {
                    $this->error(
                        'An error occured while updating ' . strtolower($key_name) . ' client secret in "' . $file . '".'
                    );
                }
            }
        }
    }
}

<?php

namespace Tbnt\Cms\Commands;

use Tbnt\Cms\Utils\MigrationUtils;

class MigrationsCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:migrations
							{--progress : Verbose output}
							{--time-limit=60 : PHP time limit in minutes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create migrations.';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $from = microtime(true);

        $verbose = $this->optionSafe('progress');

        set_time_limit_safe(1 * 60 * ($this->optionSafe('time-limit') || 60));

        if (!$verbose) {
            $this->info('<fg=yellow>Exporting:</> <fg=default>cms database</>');
        }

        MigrationUtils::exportAll(null, $verbose ? $this->output : null);

        if (!$verbose) {
            $total = round(microtime(true) - $from, 2);

            $this->info(
                '<fg=green>Exported: </> <fg=default>cms database (' . $total . ' second' . ($total > 1 ? 's' : '') . ')</>'
            );
        }
    }
}

<?php

namespace Tbnt\Cms\Commands;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateCountriesTableCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:create-countries-table';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create "countries" database.';

    /**
     * The table name.
     *
     * @var string
     */
    protected $table = 'countries';

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
        $this->info('Checking "' . $this->table . '" table...');

        $check = $this->hasTable();

        if ($check === true) {
            if ($this->confirm('The ""' . $this->table . '"" table already exists. Do you want to rebuild it?') === false) {
                return;
            }

            $this->dropTable();
        }

        $this->info('Importing "' . $this->table . '" table...');

        $this->createTable();
        $this->feedTable();

        $this->info('The "' . $this->table . '" table has been successfully created.');
    }

    /**
     * Check table.
     *
     * @return bool
     */
    public function hasTable()
    {
        return Schema::hasTable($this->table);
    }

    /**
     * Drop table.
     *
     * @return void
     */
    public function dropTable()
    {
        Schema::dropIfExists($this->table);
    }

    /**
     * Create table.
     *
     * @return void
     */
    public function createTable()
    {
        Schema::create($this->table, function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 2)->unique();
            $table->string('name', 100)->index();
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });
    }

    /**
     * Feed table.
     *
     * @return void
     */
    public function feedTable()
    {
        $now = date('Y-m-d H:i:s');

        DB::table($this->table)->insert(
            array_map(function ($c) use ($now) {
                return [
                    'code' => $c['code'],
                    'name' => $c['name'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, config('cmscountries.list'))
        );
    }
}

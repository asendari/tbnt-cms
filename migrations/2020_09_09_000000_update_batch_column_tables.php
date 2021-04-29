<?php

use Illuminate\Database\Migrations\Migration;

class UpdateBatchColumnTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     * @throws Exception
     */
    public function up()
    {
        // Update primary columns
        $update_callback = function ($table, $p) {
            DB::table($table)
                ->where('id', $p->id)
                ->update(['batch' => DB::table($table)->max('batch') + 1]);
        };

        $this->cursor('files', $update_callback);
        $this->cursor('posts', $update_callback);
        $this->cursor('post_langs', $update_callback);
        $this->cursor('post_types', $update_callback);
        $this->cursor('post_type_langs', $update_callback);
        $this->cursor('post_type_items', $update_callback);
        $this->cursor('post_type_item_langs', $update_callback);
        $this->cursor('post_type_item_restrictions', $update_callback);
        $this->cursor('post_type_item_conditions', $update_callback);
        $this->cursor('post_items', $update_callback);
        $this->cursor('post_item_langs', $update_callback);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // ...
    }

    /**
     * Chunk and handle each item.
     *
     * @param string $table
     * @param callable $callable
     * @return void
     */
    public function cursor($table, $callable)
    {
        DB::table($table)
            ->where('batch', 0)
            ->orderBy('created_at')
            ->chunk(100, function ($results) use ($table, $callable) {
                foreach ($results as $p) {
                    $callable($table, $p);
                }
            });
    }
}

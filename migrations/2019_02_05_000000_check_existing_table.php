<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CheckExistingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     * @throws Exception
     */
    public function up()
    {
        $tables = [
            'users',
            'user_password_resets',
            'user_types',
            'user_admins',
            'user_crons',
            'user_webs',
            'countries',
            'files',
            'posts',
            'post_langs',
            'post_types',
            'post_type_langs',
            'post_type_items',
            'post_type_item_langs',
            'post_type_item_restrictions',
            'post_type_item_conditions',
            'post_plugins',
            'post_items',
            'post_item_langs',
            'contacts',
        ];

        foreach ($tables as &$table) {
            if (Schema::hasTable($table) === true) {
                throw new Exception("A '{$table}' table already exists.");
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

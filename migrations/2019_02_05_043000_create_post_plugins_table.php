<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostPluginsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_plugins', function (Blueprint $table) {
            $table->unsignedInteger('post_id');
            $table->unsignedInteger('plugin_id');

            $table->unique(['post_id', 'plugin_id'], 'list_udx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_plugins');
    }
}

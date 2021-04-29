<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostLangsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_langs', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('post_id');
            $table->unsignedInteger('lang_id');
            $table->string('url', 191)->nullable();
            $table->string('title', 255)->nullable();
            $table->string('description', 255)->nullable();

            $table->index('post_id', 'post_id_idx');
            $table->index('lang_id', 'lang_id_idx');

            $table->index(['lang_id', 'url'], 'url_idx');

            $table->unique(['post_id', 'lang_id'], 'post_id_lang_id_udx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_langs');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostItemLangsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_item_langs', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('post_item_id');
            $table->unsignedInteger('lang_id');
            $table->text('value')->nullable();

            $table->index('post_item_id', 'post_item_id_idx');
            $table->index('lang_id', 'lang_id_idx');

            $table->unique(['post_item_id', 'lang_id'], 'post_item_id_lang_id_udx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_item_langs');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostTypeLangsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_type_langs', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('post_type_id');
            $table->unsignedInteger('lang_id');
            $table->string('label', 255)->nullable();

            $table->index('post_type_id', 'post_type_id_idx');
            $table->index('lang_id', 'lang_id_idx');

            $table->unique(['post_type_id', 'lang_id'], 'post_type_id_lang_id_udx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_type_langs');
    }
}

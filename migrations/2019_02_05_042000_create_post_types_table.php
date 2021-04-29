<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type', 50);
            $table->string('label', 255);
            $table->text('data')->nullable();
            $table->unsignedTinyInteger('mode');
            $table->unsignedTinyInteger('has_key');
            $table->unsignedTinyInteger('is_page');
            $table->unsignedTinyInteger('is_loaded');
            $table->unsignedTinyInteger('is_active');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();

            $table->index('deleted_at', 'deleted_at_idx');

            $table->index(['is_page', 'deleted_at'], 'is_page_idx');
            $table->index(['is_loaded', 'deleted_at'], 'is_loaded_idx');
            $table->index(['is_active', 'deleted_at'], 'is_active_idx');

            $table->index(['created_at', 'deleted_at'], 'list_idx');
            $table->index(['type', 'is_active', 'created_at', 'deleted_at'], 'list_filters_idx');

            $table->unique(['type', 'deleted_at'], 'type_udx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_types');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostTypeItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_type_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('post_type_id');
            $table->unsignedInteger('post_type_item_id')->nullable();
            $table->string('key', 191);
            $table->string('label', 255);
            $table->string('type', 20);
            $table->text('data')->nullable();
            $table->unsignedInteger('position');
            $table->unsignedTinyInteger('mode');
            $table->unsignedTinyInteger('is_required');
            $table->unsignedTinyInteger('is_translatable');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();

            $table->index(['deleted_at', 'position'], 'deleted_at_idx');

            $table->index(['post_type_id', 'deleted_at', 'position'], 'post_type_id_idx');
            $table->index(['post_type_item_id', 'deleted_at', 'position'], 'post_type_item_id_idx');
            $table->index(['key', 'deleted_at', 'position'], 'key_idx');

            $table->index(['created_at', 'deleted_at', 'position'], 'list_idx');
            $table->index(['post_type_id', 'post_type_item_id', 'created_at', 'deleted_at', 'position'], 'list_filters_idx');

            $table->unique(['post_type_id', 'post_type_item_id', 'key', 'deleted_at'], 'post_type_id_post_type_item_id_key_udx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_type_items');
    }
}

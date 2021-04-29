<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostTypeItemRestrictionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_type_item_restrictions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('post_id');
            $table->unsignedInteger('post_type_item_id');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();

            $table->index('deleted_at', 'deleted_at_idx');

            $table->index(['post_id', 'deleted_at'], 'post_id_idx');
            $table->index(['post_type_item_id', 'deleted_at'], 'post_type_item_id_idx');

            $table->index(['created_at', 'deleted_at'], 'list_idx');
            $table->index(['post_id', 'post_type_item_id', 'created_at', 'deleted_at'], 'list_filters_idx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_type_item_restrictions');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('post_id')->nullable();
            $table->unsignedInteger('post_type_id');
            $table->string('key', 255)->nullable();
            $table->string('reference', 255)->nullable();
            $table->text('data')->nullable();
            $table->unsignedInteger('position');
            $table->unsignedTinyInteger('is_indexable');
            $table->unsignedTinyInteger('is_visible');
            $table->unsignedTinyInteger('is_active');
            $table->dateTime('visible_at')->nullable();
            $table->dateTime('hidden_at')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();

            $table->index(['deleted_at', 'position'], 'deleted_at_idx');

            $table->index(['post_id', 'deleted_at', 'position'], 'post_id_idx');
            $table->index(['post_type_id', 'deleted_at', 'position'], 'post_type_id_idx');
            $table->index(['is_indexable', 'deleted_at', 'position'], 'is_indexable_idx');
            $table->index(['is_visible', 'deleted_at', 'position'], 'is_visible_idx');
            $table->index(['is_active', 'deleted_at', 'position'], 'is_active_idx');

            $table->index(['created_at', 'deleted_at', 'position'], 'list_idx');
            $table->index(
                ['post_id', 'post_type_id', 'is_active', 'visible_at', 'hidden_at', 'created_at', 'deleted_at', 'position'],
                'list_filters_idx'
            );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}

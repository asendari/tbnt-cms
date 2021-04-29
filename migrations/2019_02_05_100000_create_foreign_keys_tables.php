<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForeignKeysTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table
                ->foreign('user_type_id')
                ->references('id')
                ->on('user_types');
        });

        Schema::table('user_admins', function (Blueprint $table) {
            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users');
        });

        Schema::table('user_crons', function (Blueprint $table) {
            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users');
        });

        Schema::table('user_webs', function (Blueprint $table) {
            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users');
            $table
                ->foreign('image_id')
                ->references('id')
                ->on('files');
        });

        Schema::table('user_password_resets', function (Blueprint $table) {
            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts');
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types');
        });

        Schema::table('post_langs', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts');
        });

        Schema::table('post_type_langs', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types');
        });

        Schema::table('post_type_items', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items');
        });

        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items');
        });

        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items');
        });

        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items');
            $table
                ->foreign('post_type_item_id_match')
                ->references('id')
                ->on('post_type_items');
            $table
                ->foreign('post_type_item_id_value')
                ->references('id')
                ->on('post_type_items');
        });

        Schema::table('post_items', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts');
            $table
                ->foreign('post_item_id')
                ->references('id')
                ->on('post_items');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items');
        });

        Schema::table('post_item_langs', function (Blueprint $table) {
            $table
                ->foreign('post_item_id')
                ->references('id')
                ->on('post_items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['user_type_id']);
        });

        Schema::table('user_admins', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('user_crons', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('user_webs', function (Blueprint $table) {
            $table->dropForeign(['user_id', 'image_id']);
        });

        Schema::table('user_password_resets', function (Blueprint $table) {
            $table->dropForeign(['user_id', 'image_id']);
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['post_id', 'post_type_id']);
        });

        Schema::table('post_langs', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
        });

        Schema::table('post_type_langs', function (Blueprint $table) {
            $table->dropForeign(['post_type_id']);
        });

        Schema::table('post_type_items', function (Blueprint $table) {
            $table->dropForeign(['post_type_id', 'post_type_item_id']);
        });

        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table->dropForeign(['post_type_item_id']);
        });

        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table->dropForeign(['post_id', 'post_type_item_id']);
        });

        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table->dropForeign(['post_type_item_id', 'post_type_item_id_match', 'post_type_item_id_value']);
        });

        Schema::table('post_items', function (Blueprint $table) {
            $table->dropForeign(['post_id', 'post_item_id', 'post_type_item_id']);
        });

        Schema::table('post_item_langs', function (Blueprint $table) {
            $table->dropForeign(['post_item_id']);
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_type_id');
            $table->string('username', 191);
            $table->string('password', 255);
            $table->string('remember_token', 255)->nullable();
            $table->unsignedTinyInteger('is_active');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->dateTime('last_login_at')->nullable();
            $table->dateTime('last_connected_at')->nullable();
            $table->softDeletes();

            $table->index('deleted_at', 'deleted_at_idx');

            $table->index(['user_type_id', 'deleted_at'], 'user_type_id_idx');
            $table->index(['username', 'deleted_at'], 'username_idx');
            $table->index(['is_active', 'deleted_at'], 'is_active_idx');

            $table->index(['created_at', 'deleted_at'], 'list_idx');
            $table->index(['user_type_id', 'username', 'is_active', 'created_at', 'deleted_at'], 'list_filters_idx');
        });
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

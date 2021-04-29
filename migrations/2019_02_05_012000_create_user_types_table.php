<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tbnt\Cms\Model\UserType;

class CreateUserTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('key', 191);
            $table->unsignedTinyInteger('is_active');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();

            $table->index('deleted_at', 'deleted_at_idx');

            $table->index(['key', 'deleted_at'], 'key_idx');
            $table->index(['is_active', 'deleted_at'], 'is_active_idx');

            $table->index(['created_at', 'deleted_at'], 'list_idx');
            $table->index(['key', 'created_at', 'deleted_at'], 'list_filters_idx');

            $table->unique(['key', 'deleted_at'], 'key_deleted_at_udx');
        });

        $type = UserType::create();
        $type->key = UserType::ADMIN;
        $type->is_active = true;
        $type->save();

        $type = UserType::create();
        $type->key = UserType::CRON;
        $type->is_active = true;
        $type->save();

        $type = UserType::create();
        $type->key = UserType::WEB;
        $type->is_active = true;
        $type->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_types');
    }
}

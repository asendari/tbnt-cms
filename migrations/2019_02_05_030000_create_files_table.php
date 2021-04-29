<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->increments('id');
            $table->string('filename', 255);
            $table->unsignedTinyInteger('is_image');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();

            $table->index('is_image', 'is_image_idx');
            $table->index('deleted_at', 'deleted_at_idx');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('files');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Ramsey\Uuid\Uuid as RamseyUuid;

class AddUuidForeignKeysTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     * @throws Exception
     */
    public function up()
    {
        set_time_limit_safe(1 * 60 * 30);

        // Update tables
        Schema::table('files', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
        });
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_id');
            $table->unsignedInteger('temp_post_type_id');

            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_type_id']);
        });
        Schema::table('post_langs', function (Blueprint $table) {
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_id');

            $table->dropForeign(['post_id']);
        });
        Schema::table('post_types', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
        });
        Schema::table('post_type_langs', function (Blueprint $table) {
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_type_id');

            $table->dropForeign(['post_type_id']);
        });
        Schema::table('post_type_items', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_type_id');
            $table->unsignedInteger('temp_post_type_item_id');

            $table->dropForeign(['post_type_id']);
            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_type_item_id');

            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_id');
            $table->unsignedInteger('temp_post_type_item_id');

            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_type_item_id');
            $table->unsignedInteger('temp_post_type_item_id_match');
            $table->unsignedInteger('temp_post_type_item_id_value');

            $table->dropForeign(['post_type_item_id']);
            $table->dropForeign(['post_type_item_id_match']);
            $table->dropForeign(['post_type_item_id_value']);
        });
        Schema::table('post_items', function (Blueprint $table) {
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_id');
            $table->unsignedInteger('temp_post_item_id');
            $table->unsignedInteger('temp_post_type_item_id');

            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_item_id']);
            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_item_langs', function (Blueprint $table) {
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->softDeletes();
            $table->unsignedBigInteger('batch')->index();

            $table->unsignedInteger('temp_id');
            $table->unsignedInteger('temp_post_item_id');

            $table->dropForeign(['post_item_id']);
        });
        Schema::table('user_webs', function (Blueprint $table) {
            $table->dropForeign(['image_id']);
        });

        // Backup columns
        DB::table('files')->update([
            'temp_id' => DB::raw('id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('posts')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_id' => DB::raw('post_id'),
            'temp_post_type_id' => DB::raw('post_type_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_langs')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_id' => DB::raw('post_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_types')->update([
            'temp_id' => DB::raw('id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_type_langs')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_type_id' => DB::raw('post_type_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_type_items')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_type_id' => DB::raw('post_type_id'),
            'temp_post_type_item_id' => DB::raw('post_type_item_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_type_item_langs')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_type_item_id' => DB::raw('post_type_item_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_type_item_restrictions')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_id' => DB::raw('post_id'),
            'temp_post_type_item_id' => DB::raw('post_type_item_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_type_item_conditions')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_type_item_id' => DB::raw('post_type_item_id'),
            'temp_post_type_item_id_match' => DB::raw('post_type_item_id_match'),
            'temp_post_type_item_id_value' => DB::raw('post_type_item_id_value'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_items')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_id' => DB::raw('post_id'),
            'temp_post_item_id' => DB::raw('post_item_id'),
            'temp_post_type_item_id' => DB::raw('post_type_item_id'),
            'batch' => DB::raw('id'),
        ]);
        DB::table('post_item_langs')->update([
            'temp_id' => DB::raw('id'),
            'temp_post_item_id' => DB::raw('post_item_id'),
            'batch' => DB::raw('id'),
        ]);

        // Update columns type
        DB::statement('ALTER TABLE files MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE posts MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE posts MODIFY COLUMN post_id CHAR(36)');
        DB::statement('ALTER TABLE posts MODIFY COLUMN post_type_id CHAR(36)');
        DB::statement('ALTER TABLE post_langs MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_langs MODIFY COLUMN post_id CHAR(36)');
        DB::statement('ALTER TABLE post_types MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_type_langs MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_type_langs MODIFY COLUMN post_type_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_items MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_type_items MODIFY COLUMN post_type_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_items MODIFY COLUMN post_type_item_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_langs MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_langs MODIFY COLUMN post_type_item_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_restrictions MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_restrictions MODIFY COLUMN post_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_restrictions MODIFY COLUMN post_type_item_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_conditions MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_conditions MODIFY COLUMN post_type_item_id CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_conditions MODIFY COLUMN post_type_item_id_match CHAR(36)');
        DB::statement('ALTER TABLE post_type_item_conditions MODIFY COLUMN post_type_item_id_value CHAR(36)');
        DB::statement('ALTER TABLE post_items MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_items MODIFY COLUMN post_id CHAR(36)');
        DB::statement('ALTER TABLE post_items MODIFY COLUMN post_item_id CHAR(36)');
        DB::statement('ALTER TABLE post_items MODIFY COLUMN post_type_item_id CHAR(36)');
        DB::statement('ALTER TABLE post_item_langs MODIFY COLUMN id CHAR(36)');
        DB::statement('ALTER TABLE post_item_langs MODIFY COLUMN post_item_id CHAR(36)');
        DB::statement('ALTER TABLE user_webs MODIFY COLUMN image_id CHAR(36)');

        // Create temp foreign keys (except recursive)
        Schema::table('posts', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types')
                ->onUpdate('cascade');
        });
        Schema::table('post_langs', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade');
        });
        Schema::table('post_type_langs', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types')
                ->onUpdate('cascade');
        });
        Schema::table('post_type_items', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types')
                ->onUpdate('cascade');
        });
        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade');
        });
        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade');
        });
        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade');
            $table
                ->foreign('post_type_item_id_match')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade');
            $table
                ->foreign('post_type_item_id_value')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade');
        });
        Schema::table('post_items', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade');
        });
        Schema::table('post_item_langs', function (Blueprint $table) {
            $table
                ->foreign('post_item_id')
                ->references('id')
                ->on('post_items')
                ->onUpdate('cascade');
        });
        Schema::table('user_webs', function (Blueprint $table) {
            $table
                ->foreign('image_id')
                ->references('id')
                ->on('files')
                ->onUpdate('cascade');
        });

        // Update primary columns
        $update = function ($table, $p) {
            DB::table($table)
                ->where('id', $p->id)
                ->update(['id' => RamseyUuid::uuid4()->toString()]);
        };
        $this->cursor('files', $update);
        $this->cursor('posts', $update);
        $this->cursor('post_langs', $update);
        $this->cursor('post_types', $update);
        $this->cursor('post_type_langs', $update);
        $this->cursor('post_type_items', $update);
        $this->cursor('post_type_item_langs', $update);
        $this->cursor('post_type_item_restrictions', $update);
        $this->cursor('post_type_item_conditions', $update);
        $this->cursor('post_items', $update);
        $this->cursor('post_item_langs', $update);

        // Update recursive columns
        $this->cursor('posts', function ($table, $p) {
            DB::table('posts')
                ->where('id', $p->id)
                ->update([
                    'post_id' => optional(
                        DB::table('posts')
                            ->where('temp_id', $p->temp_post_id)
                            ->first()
                    )->id,
                ]);
        });
        $this->cursor('post_type_items', function ($table, $p) {
            DB::table('post_type_items')
                ->where('id', $p->id)
                ->update([
                    'post_type_item_id' => optional(
                        DB::table('post_type_items')
                            ->where('temp_id', $p->temp_post_type_item_id)
                            ->first()
                    )->id,
                ]);
        });
        $this->cursor('post_items', function ($table, $p) {
            DB::table('post_items')
                ->where('id', $p->id)
                ->update([
                    'post_item_id' => optional(
                        DB::table('post_items')
                            ->where('temp_id', $p->temp_post_item_id)
                            ->first()
                    )->id,
                ]);
        });

        // Remove temp columns and foreign keys
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn('temp_id');
        });
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_id');
            $table->dropColumn('temp_post_type_id');

            $table->dropForeign(['post_type_id']);
        });
        Schema::table('post_langs', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_id');

            $table->dropForeign(['post_id']);
        });
        Schema::table('post_types', function (Blueprint $table) {
            $table->dropColumn('temp_id');
        });
        Schema::table('post_type_langs', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_type_id');

            $table->dropForeign(['post_type_id']);
        });
        Schema::table('post_type_items', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_type_id');
            $table->dropColumn('temp_post_type_item_id');

            $table->dropForeign(['post_type_id']);
        });
        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_type_item_id');

            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_id');
            $table->dropColumn('temp_post_type_item_id');

            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_type_item_id');
            $table->dropColumn('temp_post_type_item_id_match');
            $table->dropColumn('temp_post_type_item_id_value');

            $table->dropForeign(['post_type_item_id']);
            $table->dropForeign(['post_type_item_id_match']);
            $table->dropForeign(['post_type_item_id_value']);
        });
        Schema::table('post_items', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_id');
            $table->dropColumn('temp_post_item_id');
            $table->dropColumn('temp_post_type_item_id');

            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_type_item_id']);
        });
        Schema::table('post_item_langs', function (Blueprint $table) {
            $table->dropColumn('temp_id');
            $table->dropColumn('temp_post_item_id');

            $table->dropForeign(['post_item_id']);
        });
        Schema::table('user_webs', function (Blueprint $table) {
            $table->dropForeign(['image_id']);
        });

        // Recreate foreign keys
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
        Schema::table('user_webs', function (Blueprint $table) {
            $table
                ->foreign('image_id')
                ->references('id')
                ->on('files');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // ...
    }

    /**
     * Chunk and handle each item.
     *
     * @param string $table
     * @param callable $callable
     * @return void
     */
    public function cursor(string $table, callable $callable)
    {
        DB::table($table)
            ->orderBy('batch')
            ->chunk(100, function ($results) use ($table, $callable) {
                foreach ($results as $p) {
                    $callable($table, $p);
                }
            });
    }
}

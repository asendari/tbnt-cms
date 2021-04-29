<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUuidForeignKeysTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     * @throws Exception
     */
    public function up()
    {
        // Remove foreign keys (unsync)
        $this->removeForeignKeys();

        // Remove indexes
        $this->removeIndexes();

        // // Add foreign keys (sync)
        // $this->addForeignKeys();
        //
        // // Update primary columns
        // $update_callback = function ($table, $p) {
        //     usleep(1);
        //
        //     DB::table($table)
        //         ->where('id', $p->id)
        //         ->update(['id' => crc64(RamseyUuid::uuid4()->toString(), '%u')]);
        // };
        //
        // $this->cursor('files', $update_callback);
        // $this->cursor('posts', $update_callback);
        // $this->cursor('post_langs', $update_callback);
        // $this->cursor('post_types', $update_callback);
        // $this->cursor('post_type_langs', $update_callback);
        // $this->cursor('post_type_items', $update_callback);
        // $this->cursor('post_type_item_langs', $update_callback);
        // $this->cursor('post_type_item_restrictions', $update_callback);
        // $this->cursor('post_type_item_conditions', $update_callback);
        // $this->cursor('post_items', $update_callback);
        // $this->cursor('post_item_langs', $update_callback);
        //
        // // Remove foreign keys (unsync)
        // $this->removeForeignKeys();
        //
        // // Update columns
        // $update = function ($table, $columns) {
        //     // Add temp columns
        //     foreach ($columns as $column) {
        //         Schema::table($table, function (Blueprint $table) use ($column) {
        //             $table->string('temp_' . $column);
        //         });
        //
        //         DB::table($table)->update([
        //             'temp_' . $column => DB::raw($column),
        //         ]);
        //     }
        //
        //     // Re-create relation columns
        //     foreach (array_reverse($columns) as $column) {
        //         if ($column === 'id') {
        //             continue;
        //         }
        //
        //         Schema::table($table, function (Blueprint $table) use ($column) {
        //             $table->dropColumn($column);
        //         });
        //
        //         Schema::table($table, function (Blueprint $table) use ($column) {
        //             $table
        //                 ->unsignedBigInteger($column)
        //                 ->unsigned()
        //                 ->nullable()
        //                 ->after('id');
        //         });
        //
        //         DB::table($table)->update([
        //             $column => DB::raw('temp_' . $column),
        //         ]);
        //     }
        //
        //     // Re-create primary column
        //     if (in_array('id', $columns)) {
        //         Schema::table($table, function (Blueprint $table) {
        //             $table->dropPrimary();
        //         });
        //
        //         Schema::table($table, function (Blueprint $table) {
        //             $table->dropColumn('id');
        //         });
        //
        //         Schema::table($table, function (Blueprint $table) {
        //             $table
        //                 ->unsignedBigInteger('id')
        //                 ->unsigned()
        //                 ->primary()
        //                 ->first();
        //         });
        //
        //         DB::table($table)->update([
        //             'id' => DB::raw('temp_id'),
        //         ]);
        //     }
        //
        //     // Drop temp columns
        //     Schema::table($table, function (Blueprint $table) use ($columns) {
        //         foreach ($columns as $column) {
        //             $table->dropColumn('temp_' . $column);
        //         }
        //     });
        // };
        //
        // $update('files', ['id']);
        // $update('posts', ['id', 'post_id', 'post_type_id']);
        // $update('post_langs', ['id', 'post_id']);
        // $update('post_types', ['id']);
        // $update('post_type_langs', ['id', 'post_type_id']);
        // $update('post_type_items', ['id', 'post_type_id', 'post_type_item_id']);
        // $update('post_type_item_langs', ['id', 'post_type_item_id']);
        // $update('post_type_item_restrictions', ['id', 'post_id', 'post_type_item_id']);
        // $update('post_type_item_conditions', ['id', 'post_type_item_id', 'post_type_item_id_match', 'post_type_item_id_value']);
        // $update('post_items', ['id', 'post_id', 'post_item_id', 'post_type_item_id']);
        // $update('post_item_langs', ['id', 'post_item_id']);
        // $update('user_webs', ['image_id']);

        // Add indexes
        $this->addIndexes();

        // Add foreign keys (sync)
        $this->addForeignKeys();
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
     * @return void
     */
    public function addIndexes()
    {
        Schema::table('files', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            // $table->index(['post_id', 'position'], 'post_id_idx');
            // $table->index(['post_type_id', 'position'], 'post_type_id_idx');

            $table->index(['post_id', 'post_type_id', 'visible_at', 'hidden_at', 'position'], 'list_filters_idx');
        });

        Schema::table('post_langs', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            $table->unique(['post_id', 'lang_id', 'deleted_at'], 'post_id_lang_id_udx');
        });

        Schema::table('post_items', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            // $table->index(['post_id', 'position'], 'post_id_idx');
            // $table->index(['post_item_id', 'position'], 'post_item_id_idx');
            // $table->index(['post_type_item_id', 'position'], 'post_type_item_id_idx');

            $table->index(['post_id', 'post_item_id', 'post_type_item_id', 'position'], 'list_filters_idx');
        });

        Schema::table('post_item_langs', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            $table->unique(['post_item_id', 'lang_id', 'deleted_at'], 'post_item_id_lang_id_udx');
        });

        Schema::table('post_types', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            $table->unique(['type', 'deleted_at'], 'type_udx');
        });

        Schema::table('post_type_langs', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            $table->unique(['post_type_id', 'lang_id', 'deleted_at'], 'post_type_id_lang_id_udx');
        });

        Schema::table('post_type_items', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            // $table->index(['post_type_id', 'position'], 'post_type_id_idx');
            // $table->index(['post_type_item_id', 'position'], 'post_type_item_id_idx');
            // $table->index(['key', 'position'], 'key_idx');

            $table->index(['post_type_id', 'post_type_item_id', 'key', 'position'], 'list_filters_idx');

            $table->unique(['post_type_id', 'post_type_item_id', 'key', 'deleted_at'], 'post_type_id_post_type_item_id_key_udx');
        });

        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            $table->unique(['post_type_item_id', 'lang_id', 'deleted_at'], 'post_type_item_id_lang_id_udx');
        });

        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            // $table->index(['post_id'], 'post_id_idx');
            // $table->index(['post_type_item_id'], 'post_type_item_id_idx');

            $table->index(['post_id', 'post_type_item_id'], 'list_filters_idx');
        });

        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table->index('batch', 'batch_idx');

            // $table->index(['post_type_item_id'], 'post_type_item_id_idx');
            // $table->index(['post_type_item_id_match'], 'post_type_item_id_match_idx');
            // $table->index(['post_type_item_id_value'], 'post_type_item_id_value_idx');

            $table->index(['post_type_item_id', 'post_type_item_id_match', 'post_type_item_id_value'], 'list_filters_idx');
        });
    }

    /**
     * @return void
     */
    public function removeIndexes()
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropIndex('is_image_idx');
            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('files_batch_index');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex('post_id_idx');
            $table->dropIndex('post_type_id_idx');

            $table->dropIndex('is_indexable_idx');
            $table->dropIndex('is_visible_idx');
            $table->dropIndex('is_active_idx');
            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('posts_batch_index');

            $table->dropIndex('list_idx');
            $table->dropIndex('list_filters_idx');
        });

        Schema::table('post_langs', function (Blueprint $table) {
            $table->dropIndex('post_id_idx');
            $table->dropIndex('lang_id_idx');

            $table->dropIndex('url_idx');
            $table->dropIndex('post_langs_batch_index');

            $table->dropUnique('post_id_lang_id_udx');
        });

        Schema::table('post_items', function (Blueprint $table) {
            $table->dropIndex('post_id_idx');
            $table->dropIndex('post_item_id_idx');
            $table->dropIndex('post_type_item_id_idx');

            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('post_items_batch_index');

            $table->dropIndex('list_idx');
            $table->dropIndex('list_filters_idx');
        });

        Schema::table('post_item_langs', function (Blueprint $table) {
            $table->dropIndex('post_item_id_idx');
            $table->dropIndex('lang_id_idx');

            $table->dropIndex('post_item_langs_batch_index');

            $table->dropUnique('post_item_id_lang_id_udx');
        });

        Schema::table('post_types', function (Blueprint $table) {
            $table->dropIndex('is_page_idx');
            $table->dropIndex('is_loaded_idx');
            $table->dropIndex('is_active_idx');
            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('post_types_batch_index');

            $table->dropIndex('list_idx');
            $table->dropIndex('list_filters_idx');

            $table->dropUnique('type_udx');
        });

        Schema::table('post_type_langs', function (Blueprint $table) {
            $table->dropIndex('post_type_id_idx');
            $table->dropIndex('lang_id_idx');

            $table->dropIndex('post_type_langs_batch_index');

            $table->dropUnique('post_type_id_lang_id_udx');
        });

        Schema::table('post_type_items', function (Blueprint $table) {
            $table->dropIndex('post_type_id_idx');
            $table->dropIndex('post_type_item_id_idx');

            $table->dropIndex('key_idx');
            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('post_type_items_batch_index');

            $table->dropIndex('list_idx');
            $table->dropIndex('list_filters_idx');

            $table->dropUnique('post_type_id_post_type_item_id_key_udx');
        });

        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table->dropIndex('post_type_item_id_idx');
            $table->dropIndex('lang_id_idx');

            $table->dropIndex('post_type_item_langs_batch_index');

            $table->dropUnique('post_type_item_id_lang_id_udx');
        });

        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table->dropIndex('post_id_idx');
            $table->dropIndex('post_type_item_id_idx');

            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('post_type_item_restrictions_batch_index');

            $table->dropIndex('list_idx');
            $table->dropIndex('list_filters_idx');
        });

        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table->dropIndex('post_type_item_id_idx');
            $table->dropIndex('post_type_item_id_match_idx');
            $table->dropIndex('post_type_item_id_value_idx');

            $table->dropIndex('deleted_at_idx');
            $table->dropIndex('post_type_item_conditions_batch_index');

            $table->dropIndex('list_idx');
            $table->dropIndex('list_filters_idx');
        });

        Schema::table('user_webs', function (Blueprint $table) {
            $table->dropIndex('image_id_idx');
        });
    }

    /**
     * @return void
     */
    public function addForeignKeys()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_langs', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_items', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table
                ->foreign('post_item_id')
                ->references('id')
                ->on('post_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_item_langs', function (Blueprint $table) {
            $table
                ->foreign('post_item_id')
                ->references('id')
                ->on('post_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_type_langs', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_type_items', function (Blueprint $table) {
            $table
                ->foreign('post_type_id')
                ->references('id')
                ->on('post_types')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table
                ->foreign('post_id')
                ->references('id')
                ->on('posts')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table
                ->foreign('post_type_item_id')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table
                ->foreign('post_type_item_id_match')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table
                ->foreign('post_type_item_id_value')
                ->references('id')
                ->on('post_type_items')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        Schema::table('user_webs', function (Blueprint $table) {
            $table
                ->foreign('image_id')
                ->references('id')
                ->on('files')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * @return void
     */
    public function removeForeignKeys()
    {
        // Drop foreign keys
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_type_id']);
        });

        Schema::table('post_langs', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
        });

        Schema::table('post_items', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_item_id']);
            $table->dropForeign(['post_type_item_id']);
        });

        Schema::table('post_item_langs', function (Blueprint $table) {
            $table->dropForeign(['post_item_id']);
        });

        Schema::table('post_type_langs', function (Blueprint $table) {
            $table->dropForeign(['post_type_id']);
        });

        Schema::table('post_type_items', function (Blueprint $table) {
            $table->dropForeign(['post_type_id']);
            $table->dropForeign(['post_type_item_id']);
        });

        Schema::table('post_type_item_langs', function (Blueprint $table) {
            $table->dropForeign(['post_type_item_id']);
        });

        Schema::table('post_type_item_restrictions', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropForeign(['post_type_item_id']);
        });

        Schema::table('post_type_item_conditions', function (Blueprint $table) {
            $table->dropForeign(['post_type_item_id']);
            $table->dropForeign(['post_type_item_id_match']);
            $table->dropForeign(['post_type_item_id_value']);
        });

        Schema::table('user_webs', function (Blueprint $table) {
            $table->dropForeign(['image_id']);
        });
    }

    /**
     * Chunk and handle each item.
     *
     * @param string $table
     * @param callable $callable
     * @return void
     */
    public function cursor($table, $callable)
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

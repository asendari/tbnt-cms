<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\LangTrait;

/**
 * Tbnt\Cms\Model\PostLang
 *
 * @property string $id
 * @property string|null $post_id
 * @property int $lang_id
 * @property string|null $url
 * @property string|null $title
 * @property string|null $description
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read string $lang_code
 * @property-read Post|null $post
 * @method static Builder|PostLang hasCurrentDefaultValue($key, $value)
 * @method static Builder|PostLang isCurrentDefaultLang()
 * @method static Builder|PostLang isCurrentLang()
 * @method static Builder|PostLang isDefaultLang()
 * @method static Builder|PostLang isLang($lang = null)
 * @method static Builder|PostLang isLangCode($lang_code = null)
 * @method static Builder|PostLang isLangId($lang_id = null)
 * @method static Builder|PostLang searchCurrentDefaultValues($fields, $searches, $multiple = true)
 * @method static Builder|PostLang whereBatch($value)
 * @method static Builder|PostLang whereCreatedAt($value)
 * @method static Builder|PostLang whereDeletedAt($value)
 * @method static Builder|PostLang whereDescription($value)
 * @method static Builder|PostLang whereId($value)
 * @method static Builder|PostLang whereLangId($value)
 * @method static Builder|PostLang wherePostId($value)
 * @method static Builder|PostLang whereTitle($value)
 * @method static Builder|PostLang whereUpdatedAt($value)
 * @method static Builder|PostLang whereUrl($value)
 */
class PostLang extends BaseModelPost
{
    use LangTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_langs';

    /**
     * All of the relationships to be touched.
     *
     * @var array
     */
    protected $touches = ['post'];

    /**
     * The array of translatable columns.
     *
     * @var array
     */
    public $attributes_lang = ['url', 'title', 'description'];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "migratable".
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeMigratable($query)
    {
        return $query->whereHas('post', function ($query) {
            return $query->migratable();
        });
    }

    /****************************************************************
     * Mutators
     ***************************************************************/

    /**
     * Set "url" attribute
     *
     * @param string $value
     * @return void
     */
    public function setUrlAttribute(string $value)
    {
        $this->attributes['url'] = $this->formatUrl($value);
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Post relation
     *
     * @return BelongsTo|Post
     */
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Return the migration status.
     *
     * @return bool
     */
    public function isMigratable()
    {
        return $this->post->isMigratable();
    }

    /**
     * Update url
     *
     * @param string $url Url
     * @return string
     */
    public function formatUrl(string $url)
    {
        $slug = implode(
            '/',
            array_map(function ($part) {
                return str()->slug(trim($part));
            }, explode('/', trim($url)))
        );

        if ($slug === '') {
            return '';
        }

        $slugs = self::where('id', '!=', $this->id)
            ->where('lang_id', $this->lang_id)
            ->whereHas('post', function ($query) {
                $query->where('post_id', $this->post->post_id);
            })
            ->search('url', $slug)
            ->get()
            ->pluck('url');

        $orig_slug = $slug;
        $last_suffix_tested = 1;

        while ($slugs->contains($slug) === true) {
            $slug = $orig_slug . '-' . $last_suffix_tested;
            $last_suffix_tested++;
        }

        return $slug;
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, ['title', 'description', 'url']);
    }
}

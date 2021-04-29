<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Mail;
use Tbnt\Cms\Mail\AccountActivatedMail;
use Tbnt\Cms\Mail\ForgotPasswordMail;
use Tbnt\Cms\Mail\NewPasswordMail;
use Tbnt\Cms\Model\Traits\HasFileTrait;

/**
 * Tbnt\Cms\Model\UserWeb
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $image_id
 * @property string $firstname
 * @property string $lastname
 * @property-read string $email
 * @property-read string $name
 * @property-read User $user
 * @property-read File|null $image
 * @method static Builder|UserWeb hasSearch($searches)
 * @method static Builder|UserWeb isOrdered($order)
 * @method static Builder|UserWeb whereFirstname($value)
 * @method static Builder|UserWeb whereId($value)
 * @method static Builder|UserWeb whereImageId($value)
 * @method static Builder|UserWeb whereLastname($value)
 * @method static Builder|UserWeb whereUserId($value)
 */
class UserWeb extends UserProfile
{
    use HasFileTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_webs';

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "isOrdered"
     *
     * @param Builder|static $query
     * @param string $order Order
     * @return Builder|static
     */
    public function scopeIsOrdered($query, string $order)
    {
        if (!$order) {
            return $query;
        }

        $order_type = explode('-', $order)[0];
        $order_direction = intval(explode('-', $order)[1] ?? 0) === 0 ? 'ASC' : 'DESC';

        return $query->orderBy($this->tableCol($order_type), $order_direction);
    }

    /**
     * Scope "hasSearch"
     *
     * @param Builder|static $query
     * @param string|array $searches Search string
     * @return Builder|static
     */
    public function scopeHasSearch($query, $searches)
    {
        return $query->search(['firstname', 'lastname'], $searches);
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Get "email" attribute
     *
     * @return string
     */
    public function getEmailAttribute()
    {
        return optional($this->user)->username;
    }

    /**
     * Get "name" attribute
     *
     * @return string
     */
    public function getNameAttribute()
    {
        return implode(' ', [$this->firstname, $this->lastname]);
    }

    /****************************************************************
     * Mutators
     ***************************************************************/

    /**
     * Set "firstname" attribute
     *
     * @param string $value
     * @return void
     */
    public function setFirstnameAttribute(string $value)
    {
        $this->attributes['firstname'] = str()->title($value);
    }

    /**
     * Set "lastname" attribute
     *
     * @param string $value
     * @return void
     */
    public function setLastnameAttribute(string $value)
    {
        $this->attributes['lastname'] = str()->title($value);
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Image relation
     */
    public function image()
    {
        return $this->belongsTo(File::class, 'image_id');
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, ['firstname', 'lastname']);

        if (isset($data['image']) === true) {
            $this->updateDataImage($data['image']);
        }
    }

    /**
     * Update image
     *
     * @param UploadedFile|string $image Image
     * @return void
     */
    public function updateDataImage($image)
    {
        $this->updateFile('image', $image, ['path' => $this->user->getUploadDir()]);
    }

    /**
     * Send mail account activated
     *
     * @param string $token Forgot password token
     * @return bool
     */
    public function sendMailAccountActivated(string $token)
    {
        return Mail::to($this->email)->send(new AccountActivatedMail(['user' => $this->user, 'token' => $token]));
    }

    /**
     * Send mail reset password
     *
     * @param string $token Forgot password token
     * @return bool
     */
    public function sendMailResetPassword(string $token)
    {
        return Mail::to($this->email)->send(new ForgotPasswordMail(['user' => $this->user, 'token' => $token]));
    }

    /**
     * Send mail new password
     *
     * @param string $password Password
     * @return bool
     */
    public function sendMailNewPassword(string $password)
    {
        return Mail::to($this->email)->send(new NewPasswordMail(['user' => $this->user, 'password' => $password]));
    }
}

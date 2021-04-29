<?php

namespace Tbnt\Cms\Utils;

use Exception;
use Illuminate\Mail\Mailable;
use Log;
use Mail as AppMail;

class MailUtils
{
    /**
     * Send mail
     *
     * @param string $email
     * @param Mailable $mailable
     * @return bool
     */
    public static function send(string $email, Mailable $mailable)
    {
        try {
            AppMail::to($email)->send($mailable);
        } catch (Exception $e) {
            Log::critical('CUSTOM ERROR: send email error', [
                'code' => $e->getCode(),
                'message' => $e->getMessage(),
                // 'file' => $e->getFile(),
                // 'line' => $e->getLine(),
            ]);

            return false;
        }

        return true;
    }
}

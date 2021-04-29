<?php

namespace Tbnt\Cms\Http\Controllers\Api\Web;

use Illuminate\Http\Request;
use Mail;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Mail\ContactContactMail;
use Tbnt\Cms\Mail\ContactCopyMail;
use Tbnt\Cms\Model\Contact;

class ContactController extends BaseController
{
    /**
     * Contact form
     *
     * @param Request $request
     * @param array|null $fields
     * @return void
     */
    public function send(Request $request, $fields = null)
    {
        $this->validate([
            'email' => 'required|email',
        ]);

        // Create contact
        $contact = new Contact();

        // Update contact
        $contact->updateData([
            'email' => $request->input('email'),
            'content' => $fields === null ? $request->except('email') : $request->only($fields),
        ]);

        // Send emails
        Mail::to(config('mail.default_to.address'))->send(new ContactContactMail($contact));
        Mail::to($request->input('email'))->send(new ContactCopyMail($contact));
    }
}

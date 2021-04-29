<?php

namespace Tbnt\Cms\Http\Middleware\Web;

use Closure;
use Illuminate\Http\Request;

class LangMiddleware
{
    /**
     * Browser language code session key.
     *
     * @var string
     */
    const SESSION_NAME = 'pref_lang_code';

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $lang_segment =
            $request->hasHeader('X-App-Lang') === true
                ? $request->header('X-App-Lang')
                : $request->query('app_lang', $request->segment(1));

        $lang_nav = $this->get($request);

        if ($lang_segment !== null) {
            if (lang()->codeExists($lang_segment) === true) {
                $lang_nav = $lang_segment;
            } elseif (lang()->canBeEmpty() === true) {
                $lang_nav = lang()->getDefaultCode();
            } else {
                abort(404);
            }

            $this->put($request, $lang_nav);

            return $next($request);
        }

        if (lang()->canBeEmpty() === true || lang()->codeExists($lang_nav) === false) {
            $lang_nav = lang()->getDefaultCode();
        }

        $this->put($request, $lang_nav);

        if (lang()->canBeEmpty() === true) {
            return $next($request);
        }

        $request->session()->save();

        return redirect(implode('?', array_filter([$lang_nav, parse_url($request->fullUrl())['query'] ?? ''])));
    }

    /**
     * Get browser language code session.
     *
     * @param Request $request
     * @return string
     */
    public function get(Request $request)
    {
        return $request->session()->has(self::SESSION_NAME) === true
            ? $request->session()->get(self::SESSION_NAME)
            : $request->getPreferredLanguage(lang()->allCodes());
    }

    /**
     * Put browser language code session.
     *
     * @param Request $request
     * @param string $lang_code
     * @return void
     */
    public function put(Request $request, string $lang_code)
    {
        lang()->setCurrent($lang_code);

        $request->session()->put(self::SESSION_NAME, lang()->getCurrentCode());
    }
}

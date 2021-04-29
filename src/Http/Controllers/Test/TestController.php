<?php

namespace Tbnt\Cms\Http\Controllers\Test;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Utils\BackupUtils;

class TestController extends BaseController
{
    /**
     * test
     *
     * @return Response
     */
    public function test()
    {
        return response('ok');
    }

    /**
     * test
     *
     * @return Response
     */
    public function config()
    {
        return response([
            'auth.guards.passport' => config('auth.guards.passport'),
            'cms.lang.langs' => config('cmslang.langs'),
            'cms.project.user' => config('cms.user'),
            'database.connections.mysql.strict' => config('database.connections.mysql.strict'),
            'filesystems.disks.uploads.root' => config('filesystems.disks.uploads.root'),
            'image.driver' => config('image.driver'),
            'mail.default_to.address' => config('mail.default_to.address'),
            'services.google' => config('services.google'),
        ]);
    }

    /**
     * test
     *
     * @return void
     * @throws Exception
     */
    public function backup()
    {
        BackupUtils::backup('test');
    }

    /**
     * test
     *
     * @param Request $request
     * @return Response
     */
    public function upload(Request $request)
    {
        $this->validate([
            'test' => 'required|file',
        ]);

        $filename = media()->upload(null, $request->file('test'), ['path' => 'test/0', 'name' => 'test']);

        return response($filename);
    }

    /**
     * test
     *
     * @return Response
     */
    public function makeUrl()
    {
        return response([
            make_url(['']),
            make_url(['/']),
            make_url(['fr']),
            make_url(['/fr']),
            make_url(['/', 'fr']),
            make_url(['/', '/fr']),
            make_url(['/', '/', 'fr']),
            make_url(['/', '/', '/fr']),
            make_url(['/', '/', '/', 'fr']),
            make_url(['/', '/', '/', '/fr']),
            make_url(['http:/domain.com', '/fr', 'pas-slash']),
            make_url(['http://domain.com', '/fr', 'pas-slash']),
            make_url(['http:///domain.com', '/fr', 'pas-slash']),
            make_url(['http:////domain.com', '/fr', 'pas-slash']),
            make_url(['', '', 'chose']),
            make_url(['fr', '', 'chose']),
            make_url(['', 'truc', 'chose']),
            make_url(['fr', 'truc', 'chose']),
            make_url(['', 'truc/truc', 'chose']),
            make_url(['fr', 'truc/truc', 'chose']),
            make_url(['fr', '/truc/truc', 'chose']),
            make_url(['fr', '/truc/truc', '/chose']),
            make_url(['fr', 'truc/truc/', 'chose']),
            make_url(['fr', 'truc/truc/', '/chose']),
            make_url(['fr', '/truc/truc/', 'chose']),
            make_url(['fr', '/truc/truc/', '/chose']),
            make_url(['fr', '//truc/truc/', '/chose']),
            make_url(['fr', '//truc//truc/', '/chose']),
            make_url(['fr', '//truc//truc//', '/chose']),
        ]);
    }

    /**
     * test
     *
     * @return Response
     */
    public function responses()
    {
        // throw new \Exception();
        // throw new \Exception('test');
        // throw new \Symfony\Component\HttpKernel\Exception\HttpException(413);

        // throw new \Tbnt\Cms\Exceptions\HttpException('test', null, 413);
        // throw new \Tbnt\Cms\Exceptions\PageNotFoundException();
        // throw new \Tbnt\Cms\Exceptions\MethodNotAllowedException();
        // throw new \Tbnt\Cms\Exceptions\ValidateException('');

        // throw new \Tbnt\Cms\Exceptions\ValidateException('test');
        // throw new \Tbnt\Cms\Exceptions\ValidateException('test', lang_errors('file_valid'));
        // throw new \Tbnt\Cms\Exceptions\ValidateException('test', ['file_valid']);

        // throw new \Illuminate\Http\Exceptions\PostTooLargeException();

        // throw new \Illuminate\Session\TokenMismatchException();

        // throw new \Illuminate\Http\Exceptions\ThrottleRequestsException();

        // abort(200);
        // abort(200, 'test');

        // abort(400);
        // abort(400, 'test');

        // abort(401);
        // abort(401, 'test');

        // abort(404);
        // abort(404, 'test');

        // abort(405);
        // abort(405, 'test');

        // abort(413);
        // abort(413, 'test');

        // abort(419);
        // abort(419, 'test');

        // abort(422);
        // abort(422, 'test');

        // abort(429);
        // abort(429, 'test');

        // abort(500);
        // abort(500, 'test');

        // abort(503);
        // abort(503, 'test');

        return response('ok');
    }
}

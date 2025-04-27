<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Index');
    }

    public function downloadVideos(): Response
    {
        $videos = session('videos', []);
        $username = session('username', null);
        return Inertia::render('downloadvideos', [
            'videos' => $videos,
            'username' => $username,
        ]);
    }
    public function downloadVideo(): Response
    {
        $data = session()->get('video') ?? null;
        return Inertia::render('downloadvideo', [
            'video' => $data,
        ]);
    }
}



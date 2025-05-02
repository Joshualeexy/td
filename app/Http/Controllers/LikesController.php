<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LikesController extends Controller
{
    public function fetchLikes(Request $request)
    {
        $videoUrl = $request->validate([
            'url' => 'required|url'
        ]);

        $response = Http::retry(3)->post('http://localhost:3001/api/likers', [
            'videoUrl' => $videoUrl['url'],
        ]);

        if ($response->json()) {
            $status = 'success';
            $likes = $response->json();
        }

        return redirect()->route('view-likes')->with([
            'likes' => $likes,
        ]);

    }
    public function viewLikes()
    {
        $likes = session('likes');
        return Inertia::render('Viewlikes', [
            'likes' => $likes,
        ]);

    }
}

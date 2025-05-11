<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\RedirectResponse;

class DownloadController extends Controller
{
    public function fetchSingle(Request $request): RedirectResponse
    {
        session()->forget('video');
        $request->validate(['url' => 'required|url|min:12']);

        try {
            $response = Http::withOptions(['verify' => false])
                ->get('https://www.tikwm.com/api/', [
                    'url' => $request->url,
                    'hd' => '1',
                ]);
            $data = $response->json()['data'] ?? null;

        } catch (Exception $e) {
            Log::error('TikTok API request failed: ' . $e->getMessage());
            return redirect()->back()->with(['url' => 'Failed to fetch video.']);
        }


        session()->put('video', [
            'url' => $data['hdplay'] ?? $data['play'],
            'thumbnail' => $data['cover'],
            'caption' => $data['title'],
            'sound' => $data['music_info']['title'] ?? null,
            'duration' => $data['duration'] ?? null, // in seconds
            'size' => $data['size'] ?? null,     // optional, might be in bytes
        ]);

        return redirect()->route('downloadvideo')->with([
            'video' => session('video') ?? null,
        ]);
    }

    public function fetchUser(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:30',
            'count' => 'nullable|integer|min:5|max:60',
        ]);

        $username = $request->input('username');

        $response = Http::withOptions(['verify' => false])->get('https://www.tikwm.com/api/user/posts', [
            'unique_id' => $username,
            'count' => 60,
        ]);

        if ($response->failed() || !$response->json('data')) {
            return back()->withErrors(['username' => 'Could not fetch videos for that username.']);
        }

        $allVideos = collect($response->json('data')['videos'])->map(function ($video) {
            return [
                'url' => $video['hdplay'] ?? $video['play'],
                'thumbnail' => $video['cover'],
                'caption' => $video['title'],
                'sound' => $video['music_info']['title'] ?? null,
                'duration' => $video['duration'] ?? null,
                'size' => $video['size'] ?? null,
            ];
        });



        return redirect()->route('downloadvideos')->with([
            'videos' => $allVideos,
            'username' => $username,
        ]);
    }



    public function proxyVideo(Request $request)
    {
        $url = $request->query('url');

        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            abort(400, 'Invalid or missing video URL.');
        }

        // Fetch the remote video as a stream
        $remote = Http::withOptions([
            'stream' => true,
            'verify' => false,
        ])->get($url);

        if ($remote->failed()) {
            abort(502, 'Failed to fetch remote video.');
        }

        // Grab the upstream Content-Length (if present)
        $length = $remote->header('Content-Length');

        // Stream it back to the browser, forwarding Content-Length
        return response()->stream(function () use ($remote) {
            echo $remote->body();
        }, 200, array_filter([
                'Content-Type' => 'video/mp4',
                'Content-Disposition' => 'inline; filename="video.mp4"',
                'Content-Length' => $length,
            ]));
    }

    public function proxymedia(Request $request)
    {
        $url = $request->query('url');

        if (!$url) {
            abort(400, 'Missing URL.');
        }

        $response = Http::withHeaders([
            'Referer' => 'https://www.instagram.com/',
            'Origin' => 'https://www.instagram.com',
        ])->get($url);

        if (!$response->successful()) {
            abort(404, 'Media not found.');
        }

        return response($response->body(), 200)
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Content-Disposition', 'inline; filename="media"');

    }

}

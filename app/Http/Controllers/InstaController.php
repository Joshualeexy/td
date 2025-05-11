<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class InstaController extends Controller
{
    public function fetchInstaMedias(Request $request)
    {
        $token = env('APIFY_TOKEN');
        if (!$token) {
            return redirect()->back()->with('error', 'Server error: API token missing. Please check configuration.');
        }
        $validated = $request->validate([
            'url' => ['required', 'url'],
        ]);

        $url = trim($validated['url']);

        $payload = [
            'directUrls' => [$url],
        ];

        $response = Http::withToken($token)
            ->post('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items', $payload);

        if ($response->successful()) {
            // dd($response->json());
            $rawItems = $response->json();
            $videos = [];

            foreach ($rawItems as $item) {
                // Handle sidecar (carousel)
                if ($item['type'] === 'Sidecar' && isset($item['childPosts'])) {
                    foreach ($item['childPosts'] as $child) {
                        $videos[] = [
                            'url' => !empty($child['isVideo']) ? ($child['videoUrl'] ?? '') : ($child['displayUrl'] ?? ''),
                            'thumbnail' => $child['displayUrl'] ?? '',
                            'caption' => $item['caption'] ?? '',
                            'sound' => null,
                            'duration' => null,
                            'size' => null,
                        ];
                    }
                } else {
                    // Single post (photo or video)
                    $videos[] = [
                        'url' => $item['type'] === 'Video' ? ($item['videoUrl'] ?? '') : ($item['displayUrl'] ?? ''),
                        'thumbnail' => $item['displayUrl'] ?? '',
                        'caption' => $item['caption'] ?? '',
                        'sound' => null,
                        'duration' => null,
                        'size' => null,
                    ];
                }
            }
            // dd($videos);

            return to_route('show-insta-medias')->with([
                'insta' => $videos,
            ]);
        }


        return redirect()->back()->with(['error' => 'Failed to fetch Instagram data']);
    }

    public function showhInstaMedias()
    {
        $data = session('insta') ?? [];
        return Inertia::render('Showinsta', [
            'data' => $data,
        ]);
    }

public function fetchUserInstaMedias(){
    return;
}


}

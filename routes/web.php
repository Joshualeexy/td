<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikesController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\InstaController;


Route::get('/', [HomeController::class, 'index'])->name('index');
Route::get('/likes', [HomeController::class, 'likes'])->name('likes');
Route::get('/insta', action: [HomeController::class, 'insta'])->name('insta');
Route::get('/download-video', [HomeController::class, 'downloadVideo'])->name('downloadvideo');
Route::get('/view-likes', [LikesController::class, 'viewLikes'])->name('view-likes');
Route::get('/download-user-videos', [HomeController::class, 'downloadVideos'])->name('downloadvideos');
Route::get('/proxy-video', [DownloadController::class, 'proxyVideo']);
Route::get('/proxy-media', [DownloadController::class, 'proxymedia'])->name('proxy.media');



Route::post('/fetch-video', [DownloadController::class, 'fetchSingle'])->name('fetch-video');
Route::post('/fetch-user-videos', [DownloadController::class, 'fetchUser'])->name('fetch-user-videos');
Route::post('/fetch-likes', [LikesController::class, 'fetchLikes'])->name('fetch-likes');



Route::post('fetch-insta-medias', [InstaController::class, 'fetchInstaMedias'])->name('fetch-insta-medias');
Route::get('show-insta-medias', [InstaController::class, 'showhInstaMedias'])->name('show-insta-medias');
Route::post('fetch-user-insta-medias', [InstaController::class, 'fetchUserInstaMedias'])->name('fetch-user-insta-medias');
Route::get('show-user-insta-medias', [InstaController::class, 'showhUserInstaMedias'])->name('show-user-insta-medias');

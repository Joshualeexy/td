<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikesController;
use App\Http\Controllers\DownloadController;

Route::get('/', [HomeController::class, 'index'])->name('index');
Route::get('/likes', [HomeController::class, 'likes'])->name('likes');
Route::get('/download-video', [HomeController::class, 'downloadVideo'])->name('downloadvideo');
Route::get('/view-likes',[LikesController::class, 'viewLikes'])->name('view-likes');
Route::get('/download-user-videos', [HomeController::class, 'downloadVideos'])->name('downloadvideos');
Route::get('/proxy-video', [DownloadController::class, 'proxyVideo']);


Route::post('/fetch-video', [DownloadController::class, 'fetchSingle'])->name('fetch-video');
Route::post('/fetch-user-videos', [DownloadController::class, 'fetchUser'])->name('fetch-user-videos');
Route::post('/fetch-likes', [LikesController::class, 'fetchLikes'])->name('fetch-likes');


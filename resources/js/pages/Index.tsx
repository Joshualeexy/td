import { useForm, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EasyLayout from '@/layouts/EasyLayout';
const Index = ({ }) => {
    const [mode, setMode] = useState<'url' | 'username'>('url');

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        url: '',
        username: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();

        if (mode === 'url') {
            if (!data.url.trim()) {
                toast.error('TikTok URL is required');
                return;
            }

            post(route('fetch-video'), {
                onSuccess: () => {
                    toast.dismiss();
                    !wasSuccessful ? toast.error('Unable To load Video!') : toast.success('Video loaded successfully!');
                },
                onError: (errors) => {
                    toast.dismiss();
                    if (errors?.url) {
                        toast.error(errors.url); // from Laravel validation
                    } else if (errors?.message) {
                        toast.error(errors.message);
                    } else {
                        toast.error('An error occurred while fetching the video.');
                    }
                },
            });


        } else if (mode === 'username') {
            if (!data.username.trim()) {
                toast.error('TikTok username is required');
                return;
            }


            post(route('fetch-user-videos'), {
                onSuccess: () => {
                    toast.dismiss();
                    toast.success('Videos loaded successfully!');
                },
                onError: (errors) => {
                    if (errors?.username) {
                        toast.error(errors.username);
                    } else if (errors?.message) {
                        toast.error(errors.message); // server-side custom message
                    } else {
                        toast.error('An error occurred while fetching user videos.');
                    }
                }
            });
        }
    };


    return (
      <>
        <EasyLayout/>
        <div className="bg-black sm:h-screen h-svh w-screen flex justify-center items-center ">
            <div className="w-11/12 sm:w-4/12 p-6 bg-white shadow-lg rounded-lg">
                <ToastContainer />

                <Head title="TikTok Video Downloader" />
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">TikTok Video Downloader</h1>

                <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
                    <div>
                        <label htmlFor="mode" className="block text-sm font-medium mb-1">Select download type:</label>
                        <select
                            id="mode"
                            value={mode}
                            onChange={(e) => setMode(e.target.value as 'url' | 'username')}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="url">Single Video (URL)</option>
                            <option value="username">Multiple Videos (Username)</option>
                        </select>
                    </div>

                    {mode === 'url' && (
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium mb-1">TikTok Video URL:</label>
                            <input
                                type="text"
                                id="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="https://www.tiktok.com/..."
                            />
                            {errors.url && <div className="text-red-500 text-sm mt-1">{errors.url}</div>}
                        </div>
                    )}

                    {mode === 'username' && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1">TikTok Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="e.g. charlidamelio"
                            />
                            {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-black text-white font-semibold py-2 rounded hover:bg-yellow-600 transition"
                        disabled={processing}
                    >
                        {processing && <span className="loader">Loading...</span>}
                        {!processing && <span>{mode === 'url' ? 'Fetch Video' : 'Fetch Videos'} </span>}
                    </button>
                </form>
            </div>
        </div>
      </>
    );
}

export default Index


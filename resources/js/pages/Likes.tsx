import { useForm, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EasyLayout from '@/layouts/EasyLayout';
const Likes = () => {

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        url: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();

            if (!data.url.trim()) {
                toast.error('TikTok Video URL is required');
                return;
            }

            post(route('fetch-likes'), {
                onSuccess: () => {
                    toast.dismiss();
                    !wasSuccessful ? toast.error('Unable To load Video Likes!') : toast.success('Video Likes loaded successfully!');
                },
                onError: (errors) => {
                    toast.dismiss();
                    if (errors?.url) {
                        toast.error(errors.url); // from Laravel validation
                    } else if (errors?.message) {
                        toast.error(errors.message);
                    } else {
                        toast.error('An error occurred while fetching the video likes.');
                    }
                },
            });
        }


    return (
      <>
        <EasyLayout/>
        <div className="bg-black sm:h-screen h-svh w-screen flex justify-center items-center ">
            <div className="w-11/12 sm:w-4/12 p-6 bg-white shadow-lg rounded-lg">
                <ToastContainer />

                <Head title="TikTok Video Downloader" />
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">TikTok Likes Viewer</h1>

                <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">

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



                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-black text-white font-semibold py-2 rounded hover:bg-yellow-600 transition"
                        disabled={processing}
                    >
                        {processing && <span className="loader">Loading...</span>}
                        {!processing && <span>Fetch Likes </span> }
                    </button>
                </form>
            </div>
        </div>
      </>
    );
}

export default Likes


import { Head, Link } from '@inertiajs/react';
import DownloadIcon from '@/components/Icon/DownloadIcon';
import { Card, CardContent } from '@/components/ui/card';
import Index from '.';
import { useState } from 'react';
import CloseIcon from '@/components/Icon/CloseIcon';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import MovableButton from '@/components/movableButton';
type VideoData = {
    url: string;
    thumbnail: string;
    caption: string;
    sound: string | null;
    duration?: number; // in seconds
    size?: number;
};

type PageProps = {
    video: VideoData | null;
};


export default function DownloadVideo({ video }: PageProps) {
    const [cacheVideo, setCacheVideo] = useState<VideoData>()
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (video) {
            localStorage.setItem('video', JSON.stringify(video));
            setCacheVideo(video);
        } else {
            const cachedVideo = localStorage.getItem('video');
            if (cachedVideo) {
                const parsedVideo = JSON.parse(cachedVideo);
                setCacheVideo(parsedVideo);
            }
        }


    }, [video]);
    const [showForm, setShowForm] = useState(false)

    const handleDownloadAgain = () => {
        setShowForm((prev) => !prev);
    };

    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => alert('Copied to clipboard!'))
                .catch(() => toast.error('Failed to copy text'));
        } else {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;

                // Hide the textarea off-screen
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();

                const success = document.execCommand('copy');
                document.body.removeChild(textarea);

                success
                    ? alert('Copied to clipboard!')
                    : toast.error('Copy not supported in this browser');
            } catch (err) {
                console.error('Clipboard fallback error:', err);
                toast.error('alert failed.');
            }
        }
    };

    const handleDownload = async () => {
        if (!cacheVideo) return;

        try {
            toast.dismiss();
            const toastId = toast.loading('Starting download...');

            const response = await fetch(cacheVideo?.url);

            const contentLength = response.headers.get('Content-Length');
            if (!response.body || !contentLength) {
                throw new Error('Unable to determine file size.');
            }

            const total = parseInt(contentLength, 10);
            let received = 0;
            const reader = response.body.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value);
                    received += value.length;

                    const percent = Math.floor((received / total) * 100);
                    toast.update(toastId, {
                        render: `Downloading... ${percent}%`,
                        isLoading: true,
                    });
                }
            }

            const blob = new Blob(chunks, { type: 'video/mp4' });

            // Extract filename

            const fileName = cacheVideo?.caption

            // Download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            const mb = (blob.size / (1024 * 1024)).toFixed(2);
            toast.update(toastId, {
                render: `Download complete (${mb} MB)`,
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error('Download failed. Please try again.');
        }
    };



    if (!video && !cacheVideo) {
        return (
            <div className="text-center mt-20 text-red-600">
                <Head title="Error Unable to get video" />
                <p>No video found. Please try again from the homepage.</p>
                <br />
                <Link href='/' as='button' className=" text-gray-900 underline cursor-pointer py-2 px-4 rounded hover:bg-yellow-500 transition">
                    go back
                </Link>
            </div>
        );
    }
    if (showForm) {
        return (
            <>
                <div className="relative">
                    <Index />
                </div>
                <div className="absolute top-0 right-0 px-4 z-50">
                    <button
                        onClick={handleDownloadAgain}
                        className=" font-bold block  text-sm px-4 mt-4 py-2 rounded-mdx` transition"
                    >
                        <CloseIcon className='text-red-600 cursor-pointer' />
                    </button>
                </div>
            </>
        )
    }
    return (
        <>
            <Head title="Download TikTok Video" />
            <ToastContainer />

            <div className="w-11/12 sm:w-5/12 mx-auto min-h-screen h-max my-8 flex items-center justify-center">
                <Card className=''>
                    <h1 className="text-2xl font-bold text-center text-black">TikTok Video Downloader</h1>
                    <CardContent className="flex gap-4 sm:flex-row flex-col">
                        <img
                            src={cacheVideo?.thumbnail}
                            alt="TikTok thumbnail"
                            className="h-full rounded-lg shadow w-6/12 mx-auto"
                        />
                        <div className="">
                            <div>
                                <p className="font-medium">Caption:</p>
                                <p className="text-sm text-muted-foreground mb-2" onDoubleClick={() => { copyToClipboard(cacheVideo?.caption || '') }}>{cacheVideo?.caption}</p>
                            </div>

                            {cacheVideo?.sound && (
                                <div>
                                    <p className="font-medium">Sound:</p>
                                    <p className="text-sm text-muted-foreground" onDoubleClick={() => { copyToClipboard(cacheVideo?.sound || '') }}>{cacheVideo?.sound}</p>
                                </div>
                            )}
                            <div className="flex justify-between mt-4">
                                {cacheVideo?.duration && (
                                    <div>
                                        <p className="font-medium">Duration:</p>
                                        <p className="text-sm text-muted-foreground">
                                            {Math.floor(cacheVideo?.duration / 60)}:{(cacheVideo?.duration % 60).toString().padStart(2, '0')} minutes
                                        </p>
                                    </div>
                                )}

                                {cacheVideo?.size && (
                                    <div>
                                        <p className="font-medium">File Size:</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(cacheVideo?.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleDownload}
                                className="cursor-pointer bg-black text-white flex justify-between items-center w-full   text-sm px-4 mt-4 py-2 rounded-md hover:bg-yellow-500 transition font-bold"
                            >
                                <span>Download Video</span> <DownloadIcon />
                            </button>

                            <MovableButton onClick={handleDownloadAgain} text="GO BACK" className='fixed z-50 right-0 mr-4 sm:right-[13%] top-5 sm:top-10 w-3/12 sm:w-max'/>

                        </div>

                    </CardContent>
                </Card>
            </div>
        </>
    );
}

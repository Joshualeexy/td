import React, { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import Index from '.';
import CloseIcon from '@/components/Icon/CloseIcon';
import MovableButton from '@/components/movableButton';


type Video = {
    url: string;
    thumbnail: string;
    caption: string;
    sound: string | null;
    duration?: number;
    size?: number;
};


type PageProps = {
    videos: Video[];
    username: string;
};
type VideoListProps = {
    url: string;
    caption: string;
}
const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-100 rounded-lg h-40 w-full" ></div>
);

const localKey = 'download-user-videos';

export default function downloadvideos() {
    const {
        videos: serverVideos,
        username: serverUsername,
    } = usePage<PageProps>().props;
    const [showForm, setShowForm] = useState(false)
    const [videoList, setVideoList] = useState<Video[]>([]);
    const [username, setUsername] = useState('');
    const [selected, setSelected] = useState<VideoListProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [imgLoaded, setImgLoaded] = useState(false); // 🔐 Image loading state



    useEffect(() => {
        if (serverVideos.length > 0) {
            setVideoList(serverVideos);
            localStorage.setItem(
                localKey,
                JSON.stringify({
                    videos: serverVideos,
                    username: serverUsername,
                })
            );
        } else {
            const cached = localStorage.getItem(localKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                setVideoList(parsed.videos);
                setUsername(parsed.username);

            }
        }
        setLoading(false)


    }, [serverVideos, serverUsername]);

    const toggleSelection = (url: string, caption: string) => {
        setSelected((prevSelected) => {
            const alreadySelected = prevSelected.some((item) => item.url === url);

            if (alreadySelected) {
                // Remove it
                return prevSelected.filter((item) => item.url !== url);
            } else {
                // Add it
                return [...prevSelected, { url, caption }];
            }
        });
    };


    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
                .writeText(text)
                .then(() => alert('Copied to clipboard!'))
                .catch(() => toast.error('Failed to copy text'));
        } else {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
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
                toast.error('Copy failed.');
            }
        }
    };

    const handleBatchDownload = async () => {
        if (selected.length === 0) return;

        try {
        for (let i = 0; i < selected.length; i++) {
            const video = selected[i];
            const toastId = toast.loading(`Downloading video ${i + 1} of ${selected.length}`);
                const response = await fetch(`/proxy-video?url=${encodeURIComponent(video.url)}`);
                const contentType = response.headers.get('Content-Type');

                if (!contentType || !contentType.includes('video')) {
                    throw new Error('Not a valid video file.');
                }

                const blob = await response.blob();

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${video.caption}.mp4`.trim() || `video-${i + 1}.mp4`.trim();
                link.click();
                URL.revokeObjectURL(link.href);


                toast.dismiss(toastId);
            }
            } catch (err) {
                console.error(`Error on video err`, err);
            }
     };


    const changePage = (newPage: number) => {
        router.get(
            route('downloadvideos'),
            { username, page: newPage },
            { preserveScroll: true, preserveState: true }
        );
    };
    const handleDownloadAgain = () => {
        setShowForm((prev) => !prev);
    };

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
            <ToastContainer />
            <Head title={`Videos from ${username}`} />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">User: {username}</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Showing  <span className="font-medium">{ }</span>  {`1`} - {videoList.length} videos
                        </p>
                    </div>
                    <MovableButton onClick={handleDownloadAgain} text="GO BACK" className='fixed z-50 right-0 mr-4 sm:right-[13%] top-10 w-3/12 sm:w-max' />



                    {selected.length > 0 && (

                        <MovableButton onClick={handleBatchDownload} text={`DOWNLOAD VIDEOS (${selected.length})`} className='fixed z-50 left-0 ml-4 mr-20 sm:left-[13%] top-20 w-3/12 sm:w-max' />

                    )}
                </div>

                {!videoList.length && (
                    <div className="text-center mt-20 text-red-600">
                        <Head title="Error Unable to get video" />
                        <p>No video found. Please try again from the homepage.</p>
                        <br />
                        <Link href='/' as='button' className=" text-gray-900 underline cursor-pointer py-2 px-4 rounded hover:bg-yellow-500 transition">
                            go back
                        </Link>

                    </div>
                )
                }
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Array.from({ length: videoList.length }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                        {videoList.map((video, i) => {

                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleSelection(video.url, video.caption)}
                                    onDoubleClick={() => copyToClipboard(video.caption)}
                                    className="border rounded-xl p-3 flex flex-col gap-2 shadow relative"
                                >
                                    {!imgLoaded && (
                                        <div className="absolute inset-0 z-10 animate-pulse">
                                            <SkeletonCard />
                                        </div>
                                    )}

                                    <img
                                        src={video.thumbnail}
                                        alt="video thumbnail"
                                        onLoad={() => setImgLoaded(true)}
                                        className={`rounded w-full transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    />

                                    <p className="text-sm text-muted-foreground line-clamp-2">{video.caption}</p>

                                    <label className="inline-flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={selected.some((item) => item.url === video.url)}
                                            onChange={() => toggleSelection(video.url, video.caption)}
                                        />
                                        Select
                                    </label>
                                </div>
                            );
                        })}

                    </div>
                )}


            </div>
        </>
    );
}

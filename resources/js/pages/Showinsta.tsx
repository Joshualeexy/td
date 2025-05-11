import React, { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import Insta from './Insta';
import CloseIcon from '@/components/Icon/CloseIcon';
import MovableButton from '@/components/movableButton';


type Media = {
    url: string;        // videoUrl (if video) or displayUrl (if photo)
    thumbnail: string;  // always a photo preview
    caption: string;
    sound: string | null;
    duration?: number;
    size?: number;
};


type PageProps = {
    data: Media[];
};

const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-100 rounded-lg h-40 w-full" ></div>
);

const localKey = 'download-user-videos';

export default function downloadvideos({ data }: PageProps) {
    const [showForm, setShowForm] = useState(false)
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [selected, setSelected] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [imgLoaded, setImgLoaded] = useState(false); //Image loading state
    useEffect(() => {
        setLoading(true)
        if (data.length > 0) {
            setMediaList(data);
            localStorage.setItem(
                localKey,
                JSON.stringify({
                    videos: data,
                })
            );
        } else {
            const cached = localStorage.getItem(localKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                setMediaList(parsed.videos);
            }
        }
        setLoading(false)
    }, [data])


        const toggleSelection = (url: string, caption: string) => {
            setSelected((prevSelected: Media[]) => {
              const alreadySelected = prevSelected.some((item) => item.url === url);

              if (alreadySelected) {
                return prevSelected.filter((item) => item.url !== url);
              } else {
                return [...prevSelected, { url, thumbnail: '', caption, sound: null }];
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
                const toastId = toast.loading(`Downloading file ${i + 1} of ${selected.length}...`);

                const response = await fetch(`/proxy-media?url=${encodeURIComponent(video.url)}`);

                const contentType = response.headers.get('Content-Type');
                if (!response.ok || !contentType) {
                    throw new Error('Failed to fetch file or unknown type.');
                }

                let extension = '';
                if (contentType.includes('image')) {
                    extension = '.jpg';
                } else if (contentType.includes('video')) {
                    extension = '.mp4';
                } else {
                    extension = ''; // fallback, but it should not happen
                }

                const blob = await response.blob();

                const safeCaption = video.caption ? video.caption.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() : `file_${i + 1}`;
                const filename = `${safeCaption}${extension}`;

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);

                toast.update(toastId, {
                    render: `Downloaded: ${filename}`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
        } catch (err) {
            console.error('Download error:', err);
            toast.error('Download failed. Please try again.');
        }
    };




    const handleCheckAll = (checked: boolean) => {
        if (checked) {
            setSelected(mediaList);
        } else {
            setSelected([]);
        }
    };

    const handleDownloadAgain = () => {
        setShowForm((prev) => !prev);
    };

    if (showForm) {
        return (
            <>
                <div className="relative">
                    <Insta />
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
            <Head title={`Download Instagram Video}`} />
            <div className="max-w-5xl mx-auto px-4 py-8">
            <p className="text-sm text-muted-foreground line-clamp-2" onDoubleClick={()=> copyToClipboard(mediaList[0].caption)}><strong>CAPTIONS: </strong>{mediaList[0]?.caption}</p>
            <label className="inline-flex mt-8 items-center gap-2 text-sm font-semibold mb-4">
                <input
                    type="checkbox"
                    checked={selected.length === mediaList.length && mediaList.length > 0}
                    onChange={(e) => { handleCheckAll(e.target.checked) }}
                />
                Select All
            </label>
                <div className="flex justify-between">
                    <MovableButton onClick={handleDownloadAgain} text="GO BACK" className='fixed z-50 right-0 mr-4 sm:right-[13%] top-15 w-3/12 sm:w-max' />
                    {selected.length > 0 && (
                        <MovableButton onClick={handleBatchDownload} text={`DOWNLOAD (${selected.length}) MEDIA`} className='fixed z-50 left-0 ml-4 mr-20 sm:left-[13%] top-20 w-3/12 sm:w-max' />
                    )}
                </div>

                {!mediaList.length && (
                    <div className="text-center mt-20 text-red-600">
                        <Head title="Error Unable to get video" />
                        <p>No Media found. Paste Instagram Video/Photo link and try again.</p>
                        <br />
                        <Link href={route('insta')} as='button' className=" text-gray-900 underline cursor-pointer py-2 px-4 rounded hover:bg-yellow-500 transition">
                            go back
                        </Link>

                    </div>
                )
                }
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                        {mediaList.map((media, i) => {

                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleSelection(media.url, media.caption)}
                                    onDoubleClick={() => copyToClipboard(media.caption)}
                                    className="border rounded-xl p-3 flex flex-col gap-2 shadow relative"
                                >
                                    {!imgLoaded && (
                                        <div className="absolute inset-0 z-10 animate-pulse">
                                            <SkeletonCard />
                                        </div>
                                    )}
                                    <img
                                        src={`/proxy-media?url=${encodeURIComponent(media.thumbnail)}`}
                                        alt="media thumbnail"
                                        onLoad={() => setImgLoaded(true)}
                                        className={`rounded w-full transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    />


                                    <label className="inline-flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={selected.some((item) => item.url === media.url)}
                                            onChange={() => toggleSelection(media.url, media.caption)}
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

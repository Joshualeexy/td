import { useRef, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

type pageProps = {
    onClick: () => void;
    className?: string;
    text: string;
    icon?: string;
}
const MovableButton: React.FC<pageProps> = ({ onClick, className, text, icon }) => {
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const [wasDragged, setWasDragged] = useState(false);

    useEffect(() => {
        const el = buttonRef.current;
        if (!el) return;

        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const startDrag = (x: number, y: number) => {
            dragging = true;
            setWasDragged(false);
            const rect = el.getBoundingClientRect();
            offsetX = x - rect.left;
            offsetY = y - rect.top;
            el.style.transition = 'none';
            el.style.cursor = 'grabbing';
        };

        const onMove = (x: number, y: number) => {
            if (!dragging) return;
            setWasDragged(true);
            const newX = x - offsetX;
            const newY = y - offsetY;
            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;
        };

        const stopDrag = () => {
            if (!dragging) return;
            dragging = false;
            el.style.cursor = 'grab';
            el.style.transition = 'left 0.2s ease';

            const screenWidth = window.innerWidth;
            const elWidth = el.offsetWidth;
            const currentLeft = el.getBoundingClientRect().left;

            if (currentLeft + elWidth / 2 < screenWidth / 2) {
                el.style.left = `10px`;
            } else {
                el.style.left = `${screenWidth - elWidth - 10}px`;
            }
        };

        // Desktop
        const onMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
        const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
        const onMouseUp = () => stopDrag();

        // Mobile
        const onTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (touch) startDrag(touch.clientX, touch.clientY);
        };

        const onTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (touch) onMove(touch.clientX, touch.clientY);
        };

        const onTouchEnd = () => stopDrag();

        el.style.cursor = 'grab';
        el.style.touchAction = 'none'; // Important for mobile drag

        el.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        el.addEventListener('touchstart', onTouchStart, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            el.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, []);

    const handleClick = () => {
        if (!wasDragged) {
            onClick();
        }
    };

    return (
        <div
            ref={buttonRef}
            className={className}
        >
            <button
                onClick={handleClick}
                className={`bg-green-600 shadow-inner shadow-black text-black cursor-pointer font-bold flex justify-between items-center w-full text-[10px] px-3 mt-4 py-2 rounded-sm hover:bg-yellow-500 transition `}
            >
                <span>{text}</span>
                <ArrowLeft className="text-[5px]!" />
            </button>
        </div>
    );
};

export default MovableButton;

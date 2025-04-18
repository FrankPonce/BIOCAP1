import { useEffect, useRef, useState } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setVideoError(true);
    };

    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="absolute inset-0 -top-20 w-full h-[calc(80vh+5rem)]">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#ffffff]/0 via-[#ffffff]/35 to-[#ffffff]/100 dark:from-[#E6F7F4]/0 dark:via-[#001a23]/35 dark:to-[#001a23]/100" />
      {!videoError && (
        <div className="absolute inset-0 z-5">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src="/biocap.mp4"
              type="video/mp4" 
            />
          </video>
        </div>
      )}
    </div>
  );
}

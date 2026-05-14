import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ImageData {
  id: string;
  src: string;
  thumbnail: string;
  caption: string;
  prompt: string;
  alt: string;
  downloadName: string;
}

interface GalleryProps {
  images: ImageData[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const getImageIndexFromUrl = useCallback(() => {
    if (typeof window === "undefined") return -1;
    const imageId = new URL(window.location.href).searchParams.get("image");
    if (!imageId) return -1;
    return images.findIndex((image) => image.id === imageId);
  }, [images]);

  const getImageUrl = useCallback(
    (index: number) => {
      if (typeof window === "undefined") return "";
      const url = new URL(window.location.href);
      url.searchParams.set("image", images[index].id);
      url.hash = "";
      return url.toString();
    },
    [images],
  );

  const clearImageUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("image");
    window.history.replaceState({}, "", url);
  }, []);

  const setImageUrl = useCallback(
    (index: number) => {
      const url = getImageUrl(index);
      if (!url) return;
      window.history.replaceState({}, "", url);
    },
    [getImageUrl],
  );

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      document.body.classList.remove("is-preload");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }
  }, [isOpen]);

  useEffect(() => {
    const openImageFromUrl = () => {
      const index = getImageIndexFromUrl();
      if (index === -1) return;
      setCurrentIndex(index);
      setIsOpen(true);
      setLoading(true);
    };

    openImageFromUrl();
    window.addEventListener("popstate", openImageFromUrl);
    return () => window.removeEventListener("popstate", openImageFromUrl);
  }, [getImageIndexFromUrl]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setLoading(true);
    setImageUrl(index);
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    clearImageUrl();
  }, [clearImageUrl]);

  const navigateNext = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      if (e && "stopPropagation" in e) e.stopPropagation();
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        setImageUrl(next);
        return next;
      });
      setLoading(true);
    },
    [images.length, setImageUrl],
  );

  const navigatePrev = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      if (e && "stopPropagation" in e) e.stopPropagation();
      setCurrentIndex((prev) => {
        const next = (prev - 1 + images.length) % images.length;
        setImageUrl(next);
        return next;
      });
      setLoading(true);
    },
    [images.length, setImageUrl],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateNext(e);
      if (e.key === "ArrowLeft") navigatePrev(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, navigateNext, navigatePrev, closeLightbox]);

  const Lightbox = () => {
    const currentImage = images[currentIndex];
    const imageRef = useRef<HTMLImageElement>(null);
    const touchStartX = useRef<number | null>(null);

    const handleImageLoad = () => {
      setLoading(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      if (diff > 50) {
        navigateNext();
      } else if (diff < -50) {
        navigatePrev();
      }
      touchStartX.current = null;
    };

    return (
      <div className="poptrox-overlay">
        <button
          type="button"
          className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent"
          onClick={closeLightbox}
          aria-label="Close"
        />
        <div
          className={`poptrox-popup ${loading ? "loading" : ""}`}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
          tabIndex={-1}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="pic">
            <img
              ref={imageRef}
              src={currentImage.src}
              alt={currentImage.alt}
              className="lightbox-img"
              style={{
                opacity: loading ? 0 : 1,
              }}
              onLoad={handleImageLoad}
            />
          </div>

          {loading && <div className="loader" />}

          {!loading && (
            <>
              <div className="lightbox-details">
                <div>
                  <h2>{currentImage.caption}</h2>
                  <p>{currentImage.prompt}</p>
                </div>
                <div className="lightbox-actions">
                  <a
                    className="download-button"
                    href={currentImage.src}
                    download={currentImage.downloadName}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Download ${currentImage.caption}`}
                  >
                    Download
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="closer"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                aria-label="Close"
              />
              <button
                type="button"
                className="nav-previous"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePrev();
                }}
                aria-label="Previous"
              />
              <button
                type="button"
                className="nav-next"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateNext();
                }}
                aria-label="Next"
              />
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="site-intro" aria-label="Site information">
        <h1>aimages</h1>
        <p>AI-generated images using flux2-klein-4b model.</p>
      </header>

      <div id="main">
        {images.map((img, index) => (
          <article className="thumb" key={img.src}>
            <a
              className="image"
              href={img.src}
              onClick={(e) => {
                e.preventDefault();
                openLightbox(index);
              }}
              style={{
                backgroundImage: `url(${img.thumbnail})`,
              }}
            >
              <img src={img.thumbnail} alt={img.alt} className="thumb-img" />
              <span className="thumb-details">
                <strong>{img.caption}</strong>
              </span>
            </a>
          </article>
        ))}
      </div>

      {isOpen && isMounted && createPortal(<Lightbox />, document.body)}
    </>
  );
};

export default Gallery;

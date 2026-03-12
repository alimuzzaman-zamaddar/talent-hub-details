"use client";

import { useState } from "react";

type MediaItem = {
  id: number;
  file_type?: "image" | "video";
  file_path?: string;
};

export default function MediaSection({ media }: { media: MediaItem[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const baseUrl = ""; // add base url if needed

  const items = media || [];

  return (
    <>
      {/* ================= GALLERY ================= */}
      <section className="mt-16 mx-auto my-12 max-w-272.75 px px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold text-black mb-4">Gallery</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden">
              {item.file_type === "image" ? (
                <img
                  src={`${baseUrl}${item.file_path}`}
                  alt="media"
                  onClick={() =>
                    setSelectedImage(`${baseUrl}${item.file_path}`)
                  }
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition duration-300"
                />
              ) : (
                <video
                  controls
                  src={`${baseUrl}${item.file_path}`}
                  className="w-full h-48 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= FULLSCREEN MODAL ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl font-bold"
            >
              ×
            </button>

            <img
              src={selectedImage}
              alt="Full View"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
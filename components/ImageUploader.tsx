import React, { useState, ChangeEvent, useRef } from 'react';

const MAX_IMAGES = 4;

interface ImageUploaderProps {
  onImagesUpload: (images: { base64: string; mimeType: string }[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [images, setImages] = useState<{ preview: string; data: { base64: string; mimeType: string; } }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesToProcess = Array.from(files).slice(0, MAX_IMAGES - images.length);
    if (images.length + files.length > MAX_IMAGES) {
      alert(`Anda hanya dapat mengunggah maksimal ${MAX_IMAGES} foto.`);
    }

    // FIX: Explicitly type `file` as `File` to resolve type errors.
    filesToProcess.forEach((file: File) => {
      if(file.size > 4 * 1024 * 1024) {
          alert(`Ukuran file "${file.name}" terlalu besar. Maksimal adalah 4MB.`);
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        const newImage = {
          preview: reader.result as string,
          data: { base64: base64String, mimeType: file.type }
        };
        
        setImages(prevImages => {
          const updatedImages = [...prevImages, newImage];
          onImagesUpload(updatedImages.map(img => img.data));
          return updatedImages;
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prevImages => {
      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
      onImagesUpload(updatedImages.map(img => img.data));
      return updatedImages;
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">Foto Lembaga (Maksimal {MAX_IMAGES} foto, Opsional)</label>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img src={image.preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs leading-none hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label={`Hapus foto ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8L36 16m0 0v12m0-12h8m-4-4l4 4m0 0l-4 4m-8 4v-8m-4 4h.01M16 20h.01M12 24h.01M12 16h.01M20 12h.01M16 12h.01M20 24h.01M20 16h.01M24 20h.01M24 16h.01M12 20h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                <span>Unggah file ({MAX_IMAGES - images.length} tersisa)</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} multiple />
              </label>
              <p className="pl-1">atau seret dan lepas</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, WEBP hingga 4MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
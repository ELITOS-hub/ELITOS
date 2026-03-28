import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Link } from 'lucide-react';
import { uploadAPI } from '../services/api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

const ImageUpload = ({ value, onChange, label, className = '', aspectRatio = 'square' }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Upload file to Cloudinary via backend
  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Try Cloudinary upload first
      const result = await uploadAPI.uploadImage(file);
      onChange(result.url);
    } catch (err) {
      console.log('Cloudinary upload failed, using base64 fallback');
      // Fallback to base64 for local/demo mode
      try {
        const base64 = await fileToBase64(file);
        onChange(base64);
      } catch {
        setError('Failed to upload image');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Convert file to base64 (fallback)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          uploadFile(file);
          break;
        }
      }
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Handle URL submit
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'min-h-[150px]',
  }[aspectRatio];

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        className={`
          relative ${aspectClass} border-2 border-dashed rounded-xl overflow-hidden
          transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-elitos-orange
          ${isDragging 
            ? 'border-elitos-orange bg-elitos-orange/10' 
            : value 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-300 bg-gray-50 hover:border-elitos-orange hover:bg-elitos-orange/5'
          }
        `}
        onClick={() => !value && !showUrlInput && inputRef.current?.click()}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
            <Loader2 className="w-8 h-8 text-elitos-orange animate-spin mb-2" />
            <p className="text-xs text-gray-500">Uploading...</p>
          </div>
        ) : value ? (
          <div className="relative w-full h-full group">
            <img 
              src={value} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
              onError={() => setError('Failed to load image')}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                title="Replace image"
              >
                <Upload size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                title="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : showUrlInput ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
            <input
              type="text"
              placeholder="Paste image URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:outline-none mb-2"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleUrlSubmit(); }}
                className="px-3 py-1 bg-elitos-orange text-white text-xs rounded-lg hover:bg-elitos-red"
              >
                Add
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowUrlInput(false); setUrlInput(''); }}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-4 text-center">
            <div className={`
              w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 md:mb-3
              ${isDragging ? 'bg-elitos-orange text-white' : 'bg-gray-100 text-gray-400'}
            `}>
              {isDragging ? <Upload size={20} /> : <ImageIcon size={20} />}
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">
              {isDragging ? 'Drop image here' : 'Click to upload'}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 mb-2 hidden md:block">
              Drag & drop • Ctrl+V to paste
            </p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowUrlInput(true); }}
              className="flex items-center gap-1 text-xs text-elitos-orange hover:text-elitos-red"
            >
              <Link size={12} />
              Use URL instead
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;

"use client";

import { Image as ImageIcon, Cookie, Calendar1, MessageSquare, Camera, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useUser } from '../../context/UserContext';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

interface GalleryImage {
  id: string;
  url: string;
  uploadedAt: Timestamp | null;
  uploaderId: string;
  uploaderName: string;
  fileName: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, userData } = useUser();
  const [deleting, setDeleting] = useState(false);

  // Fetch images from Firestore
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images: GalleryImage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setGalleryImages(images);
    });
    return () => unsubscribe();
  }, []);

  // Step 2: Upload file to Firebase Storage
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (!file || !user) return;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `gallery/${user.uid}/${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log('Uploaded file URL:', url);
      // Save url and metadata to Firestore
      await addDoc(collection(db, 'gallery'), {
        url,
        uploadedAt: serverTimestamp(),
        uploaderId: user.uid,
        uploaderName: user.displayName || user.email || 'Unknown',
        fileName: file.name,
      });
      setSelectedFile(null); // Clear file after upload
      alert('Billede uploadet!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Delete image (admin only)
  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    setDeleting(true);
    try {
      // Delete from Storage
      // Extract storage path from URL
      const url = selectedImage.url;
      const match = url.match(/\/o\/(.+)\?/);
      const path = match ? decodeURIComponent(match[1]) : null;
      if (path) {
        await deleteObject(ref(storage, path));
      }
      // Delete Firestore doc
      await deleteDoc(doc(db, 'gallery', selectedImage.id));
      setShowDeleteConfirm(false);
      setSelectedImage(null);
    } catch (err) {
      alert('Kunne ikke slette billede. Prøv igen.');
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] pb-[72px]">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[var(--accent)]" />
          <h1 className="text-xl font-semibold">KlarParat</h1>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <ImageIcon className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg">Galleri</h2>
        </div>
      </header>

      {/* Gallery Content */}
      <main className="flex-1 p-4 bg-[var(--gallery-bg)]">
        <div className="grid grid-cols-2 gap-4 pb-[72px]">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative rounded-lg overflow-hidden bg-[var(--background)] shadow-sm cursor-pointer active:opacity-90"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square relative">
                {image.url ? (
                  <img src={image.url} alt={image.fileName} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <span className="text-sm font-medium text-gray-600">
                  {image.uploadedAt?.toDate ? image.uploadedAt.toDate().toLocaleDateString('da-DK', { month: 'short', day: 'numeric' }).toUpperCase() : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Upload Button */}
      <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-[var(--background)]">
        <button
          className="w-full bg-[var(--accent)] text-white rounded-full py-3 px-4 flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="w-5 h-5" />
          <span>{uploading ? 'Uploader...' : 'Upload Nyt Billede'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {/* Optionally show selected file name for debugging */}
        {selectedFile && !uploading && (
          <div className="mt-2 text-center text-sm text-gray-600">Valgt fil: {selectedFile.name}</div>
        )}
        {uploading && (
          <div className="mt-2 text-center text-sm text-gray-600">Uploader billede...</div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t">
        <div className="flex justify-around p-4">
          <Link href="/" className="flex flex-col items-center text-gray-500">
            <Calendar1 className="w-6 h-6" />
            <span className="text-sm mt-1">Kalender</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center text-gray-500">
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm mt-1">Chat</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-[var(--accent)]">
            <ImageIcon className="w-6 h-6" />
            <span className="text-sm mt-1">Galleri</span>
          </Link>
        </div>
      </nav>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/40 z-50 p-4 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImage(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-[var(--background)] rounded-2xl overflow-hidden">
            {/* Image container */}
            <div
              className="w-full aspect-square relative bg-[var(--background)] p-4"
              onClick={() => setSelectedImage(null)}
            >
              {selectedImage.url ? (
                <img src={selectedImage.url} alt={selectedImage.fileName} className="absolute inset-0 w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Image date and delete button */}
            <div className="p-4 border-t flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                {selectedImage.uploadedAt?.toDate ? selectedImage.uploadedAt.toDate().toLocaleDateString('da-DK', { month: 'short', day: 'numeric' }).toUpperCase() : ''}
              </span>
              {/* Only show delete button for admin */}
              {userData?.role === 'admin' && (
                <button
                  className="text-red-500 p-1 hover:bg-red-50 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  disabled={deleting}
                  title="Slet billede"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] p-4 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteConfirm(false);
          }}
        >
          <div className="bg-[var(--background)] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Slet billede</h3>
            <p className="text-gray-600 mb-6">Er du sikker på, at du vil slette dette billede? Dette kan ikke fortrydes.</p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 px-4 rounded-full border border-gray-200 text-gray-600"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Annuller
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-full bg-red-500 text-white"
                onClick={handleDeleteImage}
                disabled={deleting}
              >
                {deleting ? 'Sletter...' : 'Slet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
import { Image as ImageIcon, Cookie, Calendar1, MessageSquare, Camera } from "lucide-react";
import Link from "next/link";


interface GalleryImage {
  src: string;
  date: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/food1.jpg",
    date: "MAJ 12"
  },
  {
    src: "/food2.jpg",
    date: "MAJ 12"
  },
  {
    src: "/food3.jpg",
    date: "MAJ 12"
  },
  {
    src: "/food4.jpg",
    date: "MAJ 12"
  },
  {
    src: "/food5.jpg",
    date: "MAJ 11"
  },
  {
    src: "/food6.jpg",
    date: "MAJ 11"
  },
  {
    src: "/food7.jpg",
    date: "MAJ 11"
  },
  {
    src: "/food8.jpg",
    date: "MAJ 11"
  },
  {
    src: "/food9.jpg",
    date: "MAJ 10"
  },
  {
    src: "/food10.jpg",
    date: "MAJ 10"
  },
  {
    src: "/food11.jpg",
    date: "MAJ 10"
  },
  {
    src: "/food12.jpg",
    date: "MAJ 10"
  }
];

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-[72px]">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[#C4A484]" />
          <h1 className="text-xl font-semibold">KlarParat</h1>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <ImageIcon className="w-5 h-5 text-[#C4A484]" />
          <h2 className="text-lg">Galleri</h2>
        </div>
      </header>

      {/* Gallery Content */}
      <main className="flex-1 p-4 bg-[#FDF5E6]/30">
        <div className="grid grid-cols-2 gap-4 pb-[72px]">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                {/* Image would be here when we have actual images */}
              </div>
              <div className="p-2">
                <span className="text-sm font-medium text-gray-600">{image.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Upload Button */}
      <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-white">
        <button className="w-full bg-[#C4A484] text-white rounded-full py-3 px-4 flex items-center justify-center gap-2">
          <Camera className="w-5 h-5" />
          <span>Upload Nyt Billede</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around p-4">
          <Link href="/" className="flex flex-col items-center text-gray-500">
            <Calendar1 className="w-6 h-6" />
            <span className="text-sm mt-1">Kalender</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center text-gray-500">
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm mt-1">Chat</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-[#C4A484]">
            <ImageIcon className="w-6 h-6" />
            <span className="text-sm mt-1">Galleri</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 
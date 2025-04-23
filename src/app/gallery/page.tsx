import { Image as ImageIcon, Cookie, Calendar1, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
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
      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Gallery content will go here */}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t">
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
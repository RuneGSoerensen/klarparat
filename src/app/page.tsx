import { Calendar1, MessageSquare, Image, ChevronLeft, ChevronRight, Cookie } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[#C4A484]" />
          <h1 className="text-xl font-semibold">KlarParat</h1>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Calendar1 className="w-5 h-5 text-[#C4A484]" />
          <h2 className="text-lg">Kalender</h2>
        </div>
      </header>

      {/* Calendar */}
      <main className="flex-1 p-4">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-medium">April 2025</h2>
          <button className="p-2">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week days */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 1; // Adjust for April starting on the second cell
            return (
              <div
                key={i}
                className={`h-14 p-2 flex flex-col items-center ${
                  day === 7 ? 'bg-[#FDF5E6]' : ''
                } ${day < 0 || day >= 30 ? 'text-gray-300' : ''}`}
              >
                <span>{day + 1}</span>
                {[7, 8, 9, 16, 18, 21, 22, 23].includes(day) && (
                  <div className="flex gap-0.5 mt-1">
                    <div className="w-1 h-1 rounded-full bg-[#C4A484]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t">
        <div className="flex justify-around p-4">
          <Link href="/" className="flex flex-col items-center text-[#C4A484]">
            <Calendar1 className="w-6 h-6" />
            <span className="text-sm mt-1">Kalender</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center text-gray-500">
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm mt-1">Chat</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-gray-500">
            <Image className="w-6 h-6" />
            <span className="text-sm mt-1">Galleri</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

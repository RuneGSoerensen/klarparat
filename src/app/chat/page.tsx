import { MessageSquare, Cookie, Send, Calendar1, Image } from "lucide-react";
import Link from "next/link";

interface Message {
  sender: string;
  content: string;
  time: string;
}

const messages: Message[] = [
  {
    sender: "Louise",
    content: "Er der nogen der har bestilt varer til imorgen, egentlig? Jeg har nemlig glemt det.",
    time: "9:23"
  },
  {
    sender: "Søren",
    content: "Bare rolig, Louise. Det er gjort, og varene skulle gerne kommer imorgen tidligt! :)",
    time: "2:26"
  },
  {
    sender: "Sarah",
    content: "Fedt! Jeg kommer ind tidligt og hjælper.",
    time: "9:30"
  }
];

export default function Chat() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-[72px]">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[#C4A484]" />
          <h1 className="text-xl font-semibold">KlarParat</h1>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <MessageSquare className="w-5 h-5 text-[#C4A484]" />
          <h2 className="text-lg">Team Chat</h2>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 p-4 bg-[#FDF5E6]/30 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{message.sender}:</span>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-800">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message Input */}
      <div className="fixed bottom-[72px] left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#C4A484]"
          />
          <button className="p-3 text-[#C4A484] hover:bg-[#FDF5E6]/50 rounded-full">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around p-4">
          <Link href="/" className="flex flex-col items-center text-gray-500">
            <Calendar1 className="w-6 h-6" />
            <span className="text-sm mt-1">Kalender</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center text-[#C4A484]">
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
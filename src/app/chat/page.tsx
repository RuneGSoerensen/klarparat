"use client";

import { MessageSquare, Send, Calendar1, Image } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useUser } from "@/context/UserContext";
import Header from "@/components/Header";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  timestamp: Timestamp;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, userData } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    if (!mainRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageList.push({
          id: doc.id,
          sender: data.sender,
          content: data.content,
          time: new Date(data.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: data.timestamp
        });
      });
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !userData) return;

    try {
      await addDoc(collection(db, "messages"), {
        sender: userData.name,
        content: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
      setShouldAutoScroll(true); // Re-enable auto-scroll when sending a message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const isOwnMessage = (sender: string) => {
    return userData?.name === sender;
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <Header logoSrc="/klarparatlogo.png" logoAlt="KlarParat Logo" logoWidth={40} logoHeight={40} logoClassName="h-7 w-auto" title="KlarParat" />

      {/* Page Title - below header, not in white box */}
      <div className="flex items-center gap-2 px-4 py-4 bg-[var(--gallery-bg)]">
        <MessageSquare className="w-5 h-5 text-[var(--accent)]" strokeWidth={3} />
        <h2 className="text-lg font-bold">Team Chat</h2>
      </div>

      {/* Chat Messages */}
      <main 
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-[var(--gallery-bg)]"
      >
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((message) => {
            const ownMessage = isOwnMessage(message.sender);
            return (
              <div 
                key={message.id} 
                className={`flex flex-col gap-1 ${ownMessage ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-2 ${ownMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="font-medium">{message.sender}</span>
                  <span className="text-sm text-[var(--foreground)]">{message.time}</span>
                </div>
                <div 
                  className={`p-4 rounded-lg shadow-[var(--shadow)] max-w-[80%] bg-[var(--background)]`}
                >
                  <p className="text-[var(--foreground)]">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <div className="flex-none border-t bg-[var(--background)] p-4">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv din besked..."
            className="flex-1 p-3 rounded-full border border-[var(--input-border)] focus:outline-none focus:border-[var(--input-focus)]"
          />
          <button 
            type="submit"
            className="p-3 text-[var(--accent)] hover:bg-[var(--gallery-bg)] rounded-full"
            disabled={!user || !userData}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-none border-t bg-[var(--background)]">
        <div className="flex justify-around p-4">
          <Link href="/" className="flex flex-col items-center text-[var(--foreground)]">
            <Calendar1 className="w-6 h-6" />
            <span className="text-sm mt-1">Kalender</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center text-[var(--accent)]">
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm mt-1">Chat</span>
          </Link>
          <Link href="/gallery" className="flex flex-col items-center text-[var(--foreground)]">
            <Image className="w-6 h-6" />
            <span className="text-sm mt-1">Galleri</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 
"use client";

import { Calendar1, MessageSquare, Image, ChevronLeft, ChevronRight, Cookie } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const monthNames = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December"
];

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Convert to timestamp for URL
    const timestamp = selectedDate.getTime();
    window.location.href = `/day/${timestamp}`;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-14 p-2 flex flex-col items-center text-gray-300">
          <span>{getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)) - firstDayOfMonth + i + 1}</span>
        </div>
      );
    }

    // Add cells for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() && 
                     new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-14 p-2 flex flex-col items-center w-full ${
            isToday ? 'bg-[#FDF5E6]' : ''
          } hover:bg-gray-50 active:bg-gray-100`}
        >
          <span>{day}</span>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-[72px]">
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
          <button 
            className="p-2"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            className="p-2"
            onClick={handleNextMonth}
          >
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
          {renderCalendarDays()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
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

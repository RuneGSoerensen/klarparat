"use client";

import { Calendar1, MessageSquare, Image, ChevronLeft, ChevronRight, Cookie } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const monthNames = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December"
];

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysWithTasks, setDaysWithTasks] = useState<Set<string>>(new Set());

  // Fetch tasks for the current month
  useEffect(() => {
    const fetchTasksForMonth = async () => {
      // Get start and end of month timestamps
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime().toString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getTime().toString();
      
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, 
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth)
      );

      try {
        const querySnapshot = await getDocs(q);
        const tasksPerDay = new Set<string>();
        querySnapshot.forEach(doc => {
          const taskData = doc.data();
          if (taskData.date) {
            tasksPerDay.add(taskData.date);
          }
        });
        setDaysWithTasks(tasksPerDay);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasksForMonth();
  }, [currentDate]);

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
        <div key={`empty-${i}`} className="h-14 p-2 flex flex-col items-center text-gray-300 bg-white rounded-lg shadow-sm border border-gray-100">
          <span>{getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)) - firstDayOfMonth + i + 1}</span>
        </div>
      );
    }

    // Add cells for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const timestamp = currentDayDate.getTime().toString();
      const hasTasks = daysWithTasks.has(timestamp);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() && 
                     new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-14 p-2 flex flex-col items-center w-full rounded-lg shadow-sm border border-gray-100 ${isToday ? 'bg-[var(--calendar-today)]' : ''} hover:bg-[var(--gallery-bg)] active:bg-[var(--calendar-today)]`}
        >
          <span>{day}</span>
          {hasTasks && (
            <div className="flex gap-0.5 mt-1">
              <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
              <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
              <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--gallery-bg)] text-[var(--foreground)] pb-[72px]">
      {/* Header */}
      <header className="p-4 bg-white border-b flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[var(--accent)]" />
          <h1 className="text-xl font-semibold">KlarParat</h1>
        </div>
      </header>

      {/* Section Title - below header, not in white box */}
      <div className="flex items-center gap-2 px-4 py-4 bg-[var(--gallery-bg)]">
        <Calendar1 className="w-5 h-5 text-[var(--accent)]" strokeWidth={3} />
        <h2 className="text-lg font-bold">Kalender</h2>
      </div>

      {/* Calendar */}
      <main className="flex-1 p-0">
        <div className="mx-4 bg-white rounded-xl border-t border-b border-gray-200 shadow-sm p-4">
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
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={day + idx} className="h-8 flex items-center justify-center text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {renderCalendarDays()}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around p-4">
          <Link href="/" className="flex flex-col items-center text-[var(--accent)]">
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

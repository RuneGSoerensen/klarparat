"use client";

import { Calendar1, CheckSquare, Square, Plus, SquareCheckBig } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function DayView({ params }: { params: { date: string } }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Modtag varer og pak korrekt", completed: true },
    { id: "2", text: "Sauce skal reduceres og monteres", completed: false },
    { id: "3", text: "Salat bar til morgen skal laves", completed: true },
    { id: "4", text: "Forberedelse før bryllup menu", completed: true }
  ]);

  const date = new Date(parseInt(params.date));
  const monthNames = [
    "Januar", "Februar", "Marts", "April", "Maj", "Juni",
    "Juli", "August", "September", "Oktober", "November", "December"
  ];
  const dayNames = [
    "Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"
  ];

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNewTask = () => {
    // Implementation for adding new task
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SquareCheckBig className="w-5 h-5 text-[#C4A484]" />
            <span className="text-lg">To-do liste</span>
          </div>
        </div>
        <Link href="/" className="text-[#C4A484] flex flex-col items-center">
          <Calendar1 className="w-5 h-5" />
          <span className="text-sm">Kalender</span>
        </Link>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="mb-4">
          <h2 className="text-lg">{dayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate()}</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Gæste antal:</span>
            <span>65</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Beskrivelse:</label>
          <div className="p-4 bg-white rounded-lg border">
            <p>Vi har et bryllup på torsdag. Der skal laves ret meget til det. Skriv hvis der er spørgsmål. :)</p>
          </div>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <button
              key={task.id}
              className="w-full p-4 bg-white border rounded-lg flex items-center gap-3 text-left"
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-[#C4A484]" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className={task.completed ? "line-through text-gray-400" : ""}>
                {task.text}
              </span>
            </button>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 my-8">
            Ingen opgaver tilføjet idag
          </div>
        )}

        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <button 
            className="bg-[#C4A484] text-white rounded-lg py-2 px-4 flex items-center gap-2 mx-4"
            onClick={addNewTask}
          >
            <Plus className="w-5 h-5" />
            <span>Ny Opgave</span>
          </button>
        </div>
      </main>
    </div>
  );
} 
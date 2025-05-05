"use client";

import { Calendar1, CheckSquare, Square, Plus, SquareCheckBig, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use, useRef } from "react";
import { useUser } from '../../../context/UserContext';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { createOrUpdateDay } from '@/lib/dayManagement';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function DayView({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const { isAdmin, user, isLoading: userLoading } = useUser();
  const auth = getAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [showTaskInput, setShowTaskInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dateObj = new Date(parseInt(date));
  const monthNames = [
    "Januar", "Februar", "Marts", "April", "Maj", "Juni",
    "Juli", "August", "September", "Oktober", "November", "December"
  ];
  const dayNames = [
    "Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"
  ];

  // Add auto-resize effect for textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  // Load day data
  useEffect(() => {
    if (!user) return;
    
    const dayRef = doc(db, 'days', date);
    const unsubscribe = onSnapshot(dayRef, (snapshot) => {
      if (snapshot.exists()) {
        const dayData = snapshot.data();
        setDescription(dayData.description || "");
        setGuestCount(dayData.guestCount || 0);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching day data:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [date, user]);

  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    console.log('User authenticated:', user.uid);
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('date', '==', date));
    const tasksUnsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tasksList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(tasksList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    );
    return () => tasksUnsubscribe();
  }, [user, userLoading, router, date]);

  // Handle description update
  const handleDescriptionChange = async (newDescription: string) => {
    if (!user || !isAdmin) return;
    
    setDescription(newDescription);
    try {
      await createOrUpdateDay(date, {
        description: newDescription
      }, user.uid);
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!auth.currentUser) {
      console.error('No authenticated user');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateDoc(taskRef, {
          completed: !task.completed,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const addNewTask = async () => {
    if (!auth.currentUser) {
      console.error('No authenticated user');
      return;
    }

    if (newTaskText.trim()) {
      try {
        const tasksRef = collection(db, 'tasks');
        await addDoc(tasksRef, {
          text: newTaskText,
          completed: false,
          userId: auth.currentUser.uid,
          date: date,
          createdAt: new Date().toISOString()
        });
        setNewTaskText('');
        setShowTaskInput(false);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!auth.currentUser) {
      console.error('No authenticated user');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (userLoading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SquareCheckBig className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-lg">To-do liste</span>
          </div>
        </div>
        <Link href="/" className="text-[var(--accent)] flex flex-col items-center">
          <Calendar1 className="w-5 h-5" />
          <span className="text-sm">Kalender</span>
        </Link>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="mb-4">
          <h2 className="text-lg">{dayNames[dateObj.getDay()]}, {monthNames[dateObj.getMonth()]} {dateObj.getDate()}</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Gæste antal:</span>
            {isAdmin ? (
              <input
                type="number"
                min="0"
                value={guestCount || ''}
                onChange={async (e) => {
                  if (!user) return;
                  const value = e.target.value;
                  // If empty, set to 0
                  const newCount = value === '' ? 0 : parseInt(value);
                  // Only update if it's a valid number
                  if (!isNaN(newCount)) {
                    setGuestCount(newCount);
                    try {
                      await createOrUpdateDay(date, {
                        guestCount: newCount
                      }, user.uid);
                    } catch (error) {
                      console.error('Error updating guest count:', error);
                    }
                  }
                }}
                className="border rounded p-1 w-20"
              />
            ) : (
              <span>{guestCount}</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Beskrivelse:</label>
          {isAdmin ? (
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Ingen beskrivelse endnu.."
              className="w-full p-4 bg-[var(--background)] rounded-lg border min-h-[100px] overflow-hidden text-[var(--foreground)]"
              style={{ resize: 'none' }}
            />
          ) : (
            <div className="p-4 bg-[var(--background)] rounded-lg border whitespace-pre-wrap break-words min-h-[100px] text-[var(--foreground)]">
              <p>{description || "Ingen beskrivelse endnu.."}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <button
              key={task.id}
              className="w-full p-4 bg-[var(--background)] border rounded-lg flex items-center gap-3 text-left"
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-[var(--accent)]" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className={task.completed ? "line-through text-gray-400" : ""}>
                {task.text}
              </span>
              {isAdmin && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="ml-auto text-red-500 cursor-pointer"
                >
                  Delete
                </span>
              )}
            </button>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 my-8">
            Ingen opgaver tilføjet idag
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 flex justify-center">
            <button 
              className="bg-[var(--accent)] text-white rounded-lg py-2 px-4 flex items-center gap-2"
              onClick={() => setShowTaskInput(true)}
            >
              <Plus className="w-5 h-5" />
              <span>Ny Opgave</span>
            </button>
            {showTaskInput && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="bg-[var(--background)] p-4 rounded-lg">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Ny opgave"
                    className="border rounded p-2 mb-2"
                  />
                  <div className="flex justify-center">
                    <button 
                      className="bg-[var(--accent)] text-white rounded-lg py-2 px-4 flex items-center gap-2"
                      onClick={() => {
                        addNewTask();
                        setShowTaskInput(false);
                      }}
                    >
                      <Check className="w-5 h-5" />
                      <span>Tilføj opgave</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 
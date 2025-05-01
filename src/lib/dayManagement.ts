import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { DayData, Task } from './types';

// Day Management
export const getDayData = async (date: string): Promise<DayData | null> => {
  const dayRef = doc(db, 'days', date);
  const daySnap = await getDoc(dayRef);
  
  if (daySnap.exists()) {
    return { id: daySnap.id, ...daySnap.data() } as DayData;
  }
  return null;
};

export const createOrUpdateDay = async (date: string, data: Partial<DayData>, userId: string): Promise<void> => {
  const dayRef = doc(db, 'days', date);
  const daySnap = await getDoc(dayRef);
  
  if (daySnap.exists()) {
    await updateDoc(dayRef, {
      ...data,
      updatedAt: new Date().toISOString(),
      userId
    });
  } else {
    await setDoc(dayRef, {
      date,
      guestCount: data.guestCount || 0,
      description: data.description || '',
      createdAt: new Date().toISOString(),
      userId
    });
  }
};

// Task Management
export const getTasksForDate = async (date: string): Promise<Task[]> => {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('date', '==', date));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Task[];
};

export const createTask = async (date: string, text: string, userId: string): Promise<void> => {
  const tasksRef = collection(db, 'tasks');
  await setDoc(doc(tasksRef), {
    text,
    completed: false,
    date,
    userId,
    createdAt: new Date().toISOString()
  });
};

export const updateTask = async (taskId: string, data: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}; 
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  date: string; // Add date to associate tasks with specific days
}

export interface DayData {
  id: string;
  date: string;
  guestCount: number;
  description: string;
  createdAt: string;
  updatedAt?: string;
  userId: string; // ID of user who last modified the day
} 
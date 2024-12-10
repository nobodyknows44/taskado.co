'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query, 
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { Task } from '@/types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeTasks = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const tasksRef = collection(db, 'tasks');
        const q = query(
          tasksRef,
          where('userId', '==', user.uid)
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedTasks = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? 
                  data.createdAt.toDate() : 
                  new Date(data.createdAt),
                updatedAt: data.updatedAt instanceof Timestamp ? 
                  data.updatedAt.toDate() : 
                  new Date(data.updatedAt),
                completedAt: data.completedAt ? 
                  (data.completedAt instanceof Timestamp ? 
                    data.completedAt.toDate() : 
                    new Date(data.completedAt)) 
                  : null
              } as Task;
            });
            
            const sortedTasks = fetchedTasks.sort((a, b) => 
              b.createdAt.getTime() - a.createdAt.getTime()
            );
            
            setTasks(sortedTasks);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching tasks:', err);
            setError(err as Error);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error initializing tasks:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    initializeTasks();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'userId'>) => {
    if (!user) {
      const newTask = {
        ...taskData,
        userId: 'session',
        id: `temp-${Date.now()}`,
        createdAt: taskData.createdAt || new Date(),
        updatedAt: new Date(),
      } as Task;
      
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }

    try {
      const tasksRef = collection(db, 'tasks');
      
      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        ...taskData,
        id: tempId,
        userId: user.uid,
        createdAt: taskData.createdAt || new Date(),
        updatedAt: new Date(),
      } as Task;
      
      setTasks(prev => [tempTask, ...prev]);

      const docRef = await addDoc(tasksRef, {
        ...taskData,
        userId: user.uid,
        createdAt: Timestamp.fromDate(taskData.createdAt || new Date()),
        updatedAt: serverTimestamp(),
      });

      return {
        ...tempTask,
        id: docRef.id,
      } as Task;
    } catch (error) {
      setTasks(prev => prev.filter(t => t.id !== `temp-${Date.now()}`));
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskData: Task) => {
    if (!user) {
      // For non-logged in users, update in local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskData.id ? { ...taskData, updatedAt: new Date() } : task
        )
      );
      return taskData;
    }

    try {
      const taskRef = doc(db, 'tasks', taskData.id);
      
      // Optimistic update
      setTasks(prev => 
        prev.map(task => 
          task.id === taskData.id ? { ...taskData, updatedAt: new Date() } : task
        )
      );

      // Update in Firebase
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp(),
      });

      return taskData;
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert optimistic update on error
      setTasks(prev => 
        prev.map(task => 
          task.id === taskData.id ? { ...task } : task
        )
      );
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) {
      // For non-logged in users, remove from local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      
      // Optimistic delete
      setTasks(prev => prev.filter(task => task.id !== taskId));

      // Delete from Firebase
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const markAsComplete = async (taskId: string) => {
    if (!user) {
      // For non-logged in users, update in local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed', completedAt: new Date() } 
            : task
        )
      );
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      
      // Optimistic update
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed', completedAt: new Date() } 
            : task
        )
      );

      // Update in Firebase
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking task as complete:', error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    markAsComplete,
    isAuthenticated: !!user
  };
} 
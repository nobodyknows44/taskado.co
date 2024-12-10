'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) {
      // Load notes from Firestore for logged-in users
      loadNotesFromFirestore();
    } else {
      // Load notes from localStorage for non-logged-in users
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
  }, [user]);

  // Save notes to localStorage for non-logged-in users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('notes', notes);
    }
  }, [notes, user]);

  // Clear localStorage when window is closed (for non-logged-in users)
  useEffect(() => {
    if (!user) {
      const handleBeforeUnload = () => {
        localStorage.removeItem('notes');
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user]);

  const loadNotesFromFirestore = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'notes', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNotes(docSnap.data().content);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const updateNotes = async (newNotes: string) => {
    console.log('Updating notes:', newNotes);
    setNotes(newNotes);
    
    if (user) {
      console.log('User is logged in, saving to Firestore');
      try {
        await setDoc(doc(db, 'notes', user.uid), {
          content: newNotes,
          updatedAt: new Date(),
        });
        console.log('Notes saved successfully');
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    } else {
      console.log('User is not logged in, not saving to Firestore');
    }
  };

  return {
    notes,
    updateNotes,
  };
} 
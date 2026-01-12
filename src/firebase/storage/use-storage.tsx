'use client';
import { useFirebase } from '../provider';
import { FirebaseStorage } from 'firebase/storage';

/** Hook to access Firebase Storage instance. */
export const useStorage = (): FirebaseStorage => {
  const { storage } = useFirebase();
  return storage;
};

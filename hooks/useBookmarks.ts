import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Job } from '@/types';

// Web implementation using localStorage
const webStorage = {
  getBookmarks: (): Job[] => {
    try {
      const data = localStorage.getItem('bookmarks');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  
  saveBookmarks: (bookmarks: Job[]) => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  },
};

// Native implementation using SQLite
const createNativeStorage = () => {
  // Only create database instance on native platforms
  if (Platform.OS === 'web') {
    return null;
  }

  const db = SQLite.openDatabase('bookmarks.db');
  
  return {
    db,
    init() {
      return new Promise<void>((resolve) => {
        this.db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY, data TEXT);',
            [],
            () => resolve()
          );
        });
      });
    },

    getBookmarks(): Promise<Job[]> {
      return new Promise((resolve) => {
        this.db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM bookmarks',
            [],
            (_, { rows: { _array } }) => {
              resolve(_array.map(row => JSON.parse(row.data)));
            }
          );
        });
      });
    },

    addBookmark(job: Job) {
      return new Promise<void>((resolve) => {
        this.db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO bookmarks (id, data) VALUES (?, ?)',
            [job.id, JSON.stringify(job)],
            () => resolve()
          );
        });
      });
    },

    removeBookmark(id: number) {
      return new Promise<void>((resolve) => {
        this.db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM bookmarks WHERE id = ?',
            [id],
            () => resolve()
          );
        });
      });
    },
  };
};

// Create storage instance based on platform
const nativeStorage = createNativeStorage();
const isNativePlatform = Platform.OS !== 'web';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        if (isNativePlatform && nativeStorage) {
          await nativeStorage.init();
        }
        await loadBookmarks();
      } catch (error) {
        console.error('Error initializing storage:', error);
      }
    };

    initializeStorage();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadBookmarks = useCallback(async () => {
    try {
      const data = isNativePlatform && nativeStorage
        ? await nativeStorage.getBookmarks()
        : webStorage.getBookmarks();

      if (isMounted.current) {
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      if (isMounted.current) {
        setBookmarks([]);
      }
    }
  }, []);

  const isBookmarked = useCallback((id: number) => {
    return bookmarks.some(bookmark => bookmark.id === id);
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (job: Job) => {
    try {
      if (isBookmarked(job.id)) {
        if (isNativePlatform && nativeStorage) {
          await nativeStorage.removeBookmark(job.id);
        } else {
          const newBookmarks = bookmarks.filter(bookmark => bookmark.id !== job.id);
          webStorage.saveBookmarks(newBookmarks);
          if (isMounted.current) {
            setBookmarks(newBookmarks);
          }
        }
      } else {
        if (isNativePlatform && nativeStorage) {
          await nativeStorage.addBookmark(job);
        } else {
          const newBookmarks = [...bookmarks, job];
          webStorage.saveBookmarks(newBookmarks);
          if (isMounted.current) {
            setBookmarks(newBookmarks);
          }
        }
      }

      // Update state for native platforms after DB operation
      if (isNativePlatform && isMounted.current) {
        setBookmarks(prev => 
          isBookmarked(job.id)
            ? prev.filter(bookmark => bookmark.id !== job.id)
            : [...prev, job]
        );
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [bookmarks, isBookmarked]);

  return { bookmarks, isBookmarked, toggleBookmark };
}
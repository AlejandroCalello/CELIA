
import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem, ProductAnalysis } from '../types';

const HISTORY_KEY = 'celia-ia-history';
const MAX_HISTORY_ITEMS = 10;

type AddToHistoryArgs = {
  type: 'single' | 'comparison' | 'image';
  data: ProductAnalysis | ProductAnalysis[];
  query: string;
};

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history to localStorage', error);
    }
  };

  const addToHistory = useCallback(({ type, data, query }: AddToHistoryArgs) => {
    const isComparison = Array.isArray(data);
    
    const newItemQuery = isComparison 
      ? query 
      : (data as ProductAnalysis).productName || query;

    const newItem: HistoryItem = {
      id: `${Date.now()}-${newItemQuery}`,
      type,
      query: newItemQuery,
      data,
      timestamp: Date.now(),
    };
    
    setHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(item => item.query.toLowerCase() !== newItem.query.toLowerCase());
      const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      saveHistory(updatedHistory);
      return updatedHistory;
    });

  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history from localStorage', error);
    }
  }, []);

  return { history, addToHistory, clearHistory };
};

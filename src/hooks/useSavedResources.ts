import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = '@charmius/saved-resources/v1';
export function useSavedResources() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const mounted = useRef(true);
  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const value: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(value) || !value.every(id => typeof id === 'string')) {
        throw new Error('Invalid saved resources');
      }
      if (mounted.current) {
        setSavedIds(value);
        setReady(true);
        setError(null);
      }
    } catch {
      if (mounted.current) {
        setError('Saved resources could not be loaded. Try again.');
      }
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);
  async function toggle(id: string) {
    if (!ready || locked.current) {
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const next = savedIds.includes(id)
        ? savedIds.filter(value => value !== id)
        : [...savedIds, id];
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      if (mounted.current) {
        setSavedIds(next);
        setError(null);
      }
    } catch {
      if (mounted.current) {
        setError('Your change was not saved. Please try again.');
      }
    } finally {
      locked.current = false;
      if (mounted.current) {
        setBusy(false);
      }
    }
  }
  return { savedIds, ready, error, busy, toggle, reload: load };
}

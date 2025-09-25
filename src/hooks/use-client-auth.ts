'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'skjp.client.auth';
const AUTH_EVENT = 'skjp-auth-change';

const readAuthState = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === 'true';
};

export const useClientAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const syncState = useCallback(() => {
    setIsAuthenticated(readAuthState());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    syncState();
    setIsLoading(false);

    const handleChange = () => {
      syncState();
    };

    window.addEventListener('storage', handleChange);
    window.addEventListener(AUTH_EVENT, handleChange);

    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener(AUTH_EVENT, handleChange);
    };
  }, [syncState]);

  const login = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, 'true');
    setIsAuthenticated(true);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const logout = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

export const CLIENT_AUTH_EVENT = AUTH_EVENT;
export const CLIENT_AUTH_STORAGE_KEY = STORAGE_KEY;

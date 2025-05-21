
"use client";

import { useState, useEffect } from 'react';
import { isSameDay, subDays, startOfDay } from 'date-fns';

const LAST_LOGIN_KEY = 'taskifyProLastLogin';
const STREAK_COUNT_KEY = 'taskifyProStreakCount';

export function useDailyStreak() {
  const [streak, setStreak] = useState(0);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);

  useEffect(() => {
    // Ensure this code only runs on the client
    if (typeof window !== 'undefined') {
      const today = startOfDay(new Date());
      const lastLoginDateStr = localStorage.getItem(LAST_LOGIN_KEY);
      const currentStreakStr = localStorage.getItem(STREAK_COUNT_KEY);

      let updatedStreak = 0;

      if (lastLoginDateStr) {
        const lastLoginDate = startOfDay(new Date(lastLoginDateStr));
        const previousStreak = parseInt(currentStreakStr || '0', 10);

        if (isSameDay(lastLoginDate, subDays(today, 1))) {
          // Logged in yesterday, continue streak
          updatedStreak = previousStreak + 1;
        } else if (isSameDay(lastLoginDate, today)) {
          // Logged in today already, streak remains the same
          updatedStreak = previousStreak > 0 ? previousStreak : 1; // Ensure streak is at least 1 if logged in today
        } else {
          // Missed a day or more, or date is in future (should not happen)
          updatedStreak = 1; // Reset to 1 for today's login
        }
      } else {
        // First login or localStorage cleared
        updatedStreak = 1;
      }

      localStorage.setItem(LAST_LOGIN_KEY, today.toISOString());
      localStorage.setItem(STREAK_COUNT_KEY, updatedStreak.toString());
      setStreak(updatedStreak);
    }
    setIsLoadingStreak(false);
  }, []);

  return { streak, isLoadingStreak };
}

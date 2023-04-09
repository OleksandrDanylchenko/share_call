import { useEffect, useState } from 'react';

import { DateTime } from 'luxon';

export const useDuration = (start: Date, end?: Date | null): string => {
  const [duration, setDuration] = useState('');
  useEffect(() => {
    const updateDuration = (): void => {
      const startDate = DateTime.fromJSDate(start);
      const endDate = end ? DateTime.fromJSDate(end) : DateTime.local();
      const duration = endDate.diff(startDate, ['hours', 'minutes', 'seconds']);
      setDuration(
        duration.toFormat(duration.minutes > 1 ? 'hh:mm' : 'hh:mm:ss'),
      );
    };
    updateDuration();

    if (end) return; // No need for live updates

    const minuteInterval = setInterval(updateDuration, 1000);
    return () => clearInterval(minuteInterval);
  }, [start, end]);

  return duration;
};

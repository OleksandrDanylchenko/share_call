import { useEffect, useState } from 'react';

import { DateTime } from 'luxon';

export const useDuration = (
  start: Date | DateTime,
  end?: Date | DateTime | null,
  formatting: 'auto' | 'full' = 'auto',
): string => {
  const [duration, setDuration] = useState('');
  useEffect(() => {
    const updateDuration = (): void => {
      const startDate =
        start instanceof DateTime ? start : DateTime.fromJSDate(start);

      const endDate = end
        ? end instanceof DateTime
          ? end
          : DateTime.fromJSDate(end)
        : DateTime.local();

      const duration = endDate.diff(startDate, ['hours', 'minutes', 'seconds']);
      setDuration(
        duration.toFormat(
          formatting === 'auto' && duration.minutes > 1 ? 'hh:mm' : 'hh:mm:ss',
        ),
      );
    };
    updateDuration();

    if (end) return; // No need for live updates

    const minuteInterval = setInterval(updateDuration, 1000);
    return () => clearInterval(minuteInterval);
  }, [start, end, formatting]);

  return duration;
};

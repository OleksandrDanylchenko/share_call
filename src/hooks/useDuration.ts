import { useEffect, useState } from 'react';

import { DateTime } from 'luxon';

export const useDuration = (start: Date): string => {
  const [duration, setDuration] = useState('');
  useEffect(() => {
    const updateDuration = (): void => {
      const startDate = DateTime.fromJSDate(start);
      const duration = DateTime.local().diff(startDate, ['hours', 'minutes']);
      setDuration(duration.toFormat('hh:mm'));
    };

    updateDuration();
    const minuteInterval = setInterval(updateDuration, 1000);

    return () => clearInterval(minuteInterval);
  }, [start]);

  return duration;
};

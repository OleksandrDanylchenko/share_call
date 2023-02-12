import { FC } from 'react';

import { Badge, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import bell from '@/assets/bell.svg';
import compareScale from '@/assets/compare-scale.svg';
import heart from '@/assets/heart.svg';

const Reminders: FC = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      <Badge badgeContent={4} color="primary">
        <Link href="/account#favorite">
          <Image src={heart} alt="" />
        </Link>
      </Badge>
      <Badge badgeContent={6} color="primary">
        <Link href="/account#compare">
          <Image src={compareScale} alt="" />
        </Link>
      </Badge>
      <Badge badgeContent={6} color="primary">
        <Image src={bell} alt="" />
      </Badge>
    </Stack>
  );
};

export default Reminders;

import React, { FC } from 'react';

import { Typography } from '@mui/material';

import StringsRotator from '@/components/StringsRotator';
import { fullWidth } from '@/styles/mixins';

const Catchphrase: FC = () => (
  <Typography
    css={fullWidth}
    variant="h1"
    fontSize="11rem"
    fontWeight={400}
    textAlign={{ md: 'center', lg: 'left' }}
    flex={{ md: 0, lg: 1 }}
  >
    Let&apos;s
    <br />
    <StringsRotator strings={['chat', 'babble', 'give voice', 'share']} />
  </Typography>
);

export default Catchphrase;

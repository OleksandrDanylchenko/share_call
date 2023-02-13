import { FC } from 'react';

import { Container, Stack } from '@mui/material';

import {
  doubleColorGradient,
  fullHeight,
  viewportHeight,
} from '@/styles/mixins';

const Preview: FC = () => (
  <main css={[viewportHeight, doubleColorGradient]}>
    <Container css={fullHeight}>
      <Stack css={fullHeight} alignItems="center" justifyContent="center">
        Hello
      </Stack>
    </Container>
  </main>
);

export default Preview;

import React, { FC, Fragment } from 'react';

import { Divider, ListItem, Skeleton, Stack } from '@mui/material';
import { range } from 'lodash';

import { fullWidth } from '@/styles/mixins';

const RoomsListPlaceholder: FC = () => (
  <Stack pl={1} gap={2} width="20%" minWidth={230}>
    {range(0, 5).map((_, index, arr) => (
      <Fragment key={index}>
        <ListItem disablePadding>
          <Skeleton css={fullWidth} height={100} sx={{ transform: 'none' }} />
        </ListItem>
        {index !== arr.length - 1 && (
          <Divider
            variant="middle"
            css={fullWidth}
            sx={{ marginTop: 2, marginBottom: 2 }}
          />
        )}
      </Fragment>
    ))}
  </Stack>
);

export default RoomsListPlaceholder;

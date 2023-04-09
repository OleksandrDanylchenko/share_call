import React, { FC, Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ClassNames } from '@emotion/react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { range } from 'lodash';

import {
  fullHeight,
  fullWidth,
  lightBackgroundContainer,
  lineClamp,
} from '@/styles/mixins';
import { api, RouterOutputs } from '@/utils/api';

interface Props {
  activeRoomId: string;
}

const RoomSessionsList: FC<Props> = (props) => {
  const { activeRoomId } = props;

  const { data: sessions, isLoading: isSessionsLoading } =
    api.rooms.getRoomSession.useQuery({ id: activeRoomId });

  return (
    <Stack pl={1} gap={2} flex={1}>
      <Typography variant="h5">Calls history:</Typography>
      <Box css={fullHeight}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <>
              {isSessionsLoading ? (
                <ListPlaceholder />
              ) : (
                <List sx={{ height, overflowY: 'auto' }}>
                  {sessions?.map((session, index, arr) => (
                    <Fragment key={session.id}>
                      <ListSessionItem session={session} />
                      {index !== arr.length - 1 && <ListDivider />}
                    </Fragment>
                  ))}
                </List>
              )}
            </>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
};

const ListSessionItem: FC<{
  session: RouterOutputs['rooms']['getRoomSession'][number];
}> = (props) => {
  const { session } = props;

  return (
    <ListItemButton
      sx={{ borderRadius: 6 }}
      css={(theme) => lightBackgroundContainer(theme)}
    >
      <ClassNames>
        {({ css }) => (
          <ListItemText
            classes={{
              primary: css`
                ${lineClamp()}
              `,
              secondary: css`
                ${lineClamp(3)}
              `,
            }}
            primary={'Hello'}
          />
        )}
      </ClassNames>
    </ListItemButton>
  );
};

const ListPlaceholder: FC = () => (
  <List>
    {range(0, 5).map((_, index, arr) => (
      <Fragment key={index}>
        <ListItem disablePadding>
          <Skeleton css={fullWidth} height={60} sx={{ transform: 'none' }} />
        </ListItem>
        {index !== arr.length - 1 && <ListDivider />}
      </Fragment>
    ))}
  </List>
);

const ListDivider: FC = () => (
  <Divider
    variant="middle"
    sx={{ width: '95%', marginTop: 2, marginBottom: 2 }}
  />
);

export default RoomSessionsList;

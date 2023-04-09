import React, { FC, Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ClassNames } from '@emotion/react';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PeopleIcon from '@mui/icons-material/People';
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

import { useDuration } from '@/hooks/useDuration';
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
                      <ListSessionItem
                        session={session}
                        serialNumber={arr.length - index - 1} // Count from the end
                      />
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
  serialNumber: number;
}> = (props) => {
  const {
    session: { startedAt, finishedAt, participants },
    serialNumber,
  } = props;

  const duration = useDuration(startedAt, finishedAt);
  const participantsCount = participants.length;

  console.log({ participants });

  return (
    <ListItemButton
      sx={{ borderRadius: 6, gap: 1.45 }}
      css={(theme) => lightBackgroundContainer(theme)}
    >
      <ClassNames>
        {({ css }) => (
          <ListItemText
            classes={{}}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            Call {serialNumber}
            <Stack direction="row" gap={1}>
              <Stack direction="row" gap={1} mt={0.5}>
                <AccessTimeFilledIcon fontSize="small" />
                {duration}
              </Stack>
              <Stack direction="row" gap={1} mt={0.5}>
                <PeopleIcon fontSize="small" />
                {participantsCount}
              </Stack>
            </Stack>
          </ListItemText>
        )}
      </ClassNames>
      <ArrowForwardIosIcon />
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

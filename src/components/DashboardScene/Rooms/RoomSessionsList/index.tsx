import React, { FC, Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PeopleIcon from '@mui/icons-material/People';
import {
  Avatar,
  AvatarGroup,
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
import Image from 'next/image';

import BlinkingCircle from '@/components/BlinkingCircle';
import { AVATAR_SIZE } from '@/constants/index';
import { useDuration } from '@/hooks/useDuration';
import {
  fullHeight,
  fullWidth,
  lightBackgroundContainer,
} from '@/styles/mixins';
import { api, RouterOutputs } from '@/utils/api';
import { getImageLoader } from '@/utils/files';

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

  const duration = useDuration(startedAt, finishedAt, 'full');

  return (
    <ListItemButton
      sx={{ borderRadius: 6, gap: 1 }}
      css={(theme) => lightBackgroundContainer(theme)}
    >
      <ListItemText classes={{}} sx={{ display: 'flex', alignItems: 'center' }}>
        Call {serialNumber}
        <Stack direction="row" gap={1}>
          <Stack direction="row" gap={1} mt={0.5}>
            <AccessTimeFilledIcon fontSize="small" />
            {duration}
          </Stack>
          <Stack direction="row" gap={1} mt={0.5}>
            <PeopleIcon fontSize="small" />
            {participants.length}
          </Stack>
        </Stack>
      </ListItemText>
      <AvatarGroup max={5}>
        {participants.map(({ user: { id, name, image } }) => (
          <Avatar key={id}>
            <Image
              alt={name!}
              src={image!}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              quality={80}
              loader={getImageLoader(image!)}
            />
          </Avatar>
        ))}
      </AvatarGroup>
      {!finishedAt && <BlinkingCircle />}
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

import React, { FC, Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PeopleIcon from '@mui/icons-material/People';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
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
import { DateTime } from 'luxon';
import Image from 'next/image';
import { useToggle } from 'usehooks-ts';

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

const dateFormat = {
  dateStyle: 'medium',
  timeStyle: 'short',
} as const;

const ListSessionItem: FC<{
  session: RouterOutputs['rooms']['getRoomSession'][number];
  serialNumber: number;
}> = (props) => {
  const {
    session: { startedAt, finishedAt, participants },
    serialNumber,
  } = props;

  const startedAtFormatted =
    DateTime.fromJSDate(startedAt).toLocaleString(dateFormat);
  const finishedAtFormatted = finishedAt
    ? DateTime.fromJSDate(finishedAt).toLocaleString(dateFormat)
    : null;
  const duration = useDuration(startedAt, finishedAt, 'full');

  const totalParticipantsNum = participants.length;

  const [showDetails, toggleShowDetails] = useToggle(true);

  return (
    <ListItemButton
      sx={{
        borderRadius: 6,
        gap: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
      css={(theme) => lightBackgroundContainer(theme)}
      onClick={toggleShowDetails}
    >
      <Stack
        direction="row"
        alignItems="center"
        flex={1}
        gap={1.5}
        borderRadius="inherit"
        ml={-1}
        mr={-1}
        pl={2}
        pr={2}
        css={(theme) =>
          showDetails && lightBackgroundContainer(theme, { active: true })
        }
      >
        <ListItemText>
          Call {serialNumber} — {startedAtFormatted}
          <Stack direction="row" gap={2} mt={0.5}>
            <Stack direction="row" gap={1}>
              <AccessTimeFilledIcon fontSize="small" sx={{ mt: 0.1 }} />
              {duration}
            </Stack>
            <Stack direction="row" gap={1}>
              <PeopleIcon fontSize="small" sx={{ mt: 0.1 }} />
              {participants.length}
            </Stack>
            <Stack direction="row" gap={1}>
              <TextSnippetIcon fontSize="small" sx={{ mt: 0.1 }} />
              ??
            </Stack>
          </Stack>
        </ListItemText>
        {!showDetails && (
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
        )}

        {!finishedAt && <BlinkingCircle />}
        <ArrowForwardIosIcon
          sx={{ transform: `rotate(${showDetails ? '90deg' : 0})` }}
        />
      </Stack>
      {showDetails && (
        <Stack direction="row" gap={4}>
          <Stack gap={1}>
            <Typography>Started at: {startedAtFormatted}</Typography>
            <Typography
              color={finishedAtFormatted ? 'inherit' : 'warning.main'}
            >
              Finished at: {finishedAtFormatted || 'In Progress'}
            </Typography>
            <Typography>Duration: {duration}</Typography>
          </Stack>
          <Stack gap={1}>
            <Typography>
              Total participants number: {totalParticipantsNum}
            </Typography>
            {!finishedAt && (
              <Typography>
                Active participants number: {totalParticipantsNum}
              </Typography>
            )}
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
          </Stack>
        </Stack>
      )}
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

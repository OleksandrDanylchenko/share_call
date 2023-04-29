import React, { FC, Fragment } from 'react';

import { ClassNames } from '@emotion/react';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PeopleIcon from '@mui/icons-material/People';
import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Tooltip,
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
      <>
        {isSessionsLoading ? (
          <ListPlaceholder />
        ) : (
          <List>
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
    </Stack>
  );
};

const dateTimeFormat = {
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

  const [showDetails, toggleShowDetails] = useToggle(false);

  const startedAtInstance = DateTime.fromJSDate(startedAt);
  const finishedAtInstance = finishedAt
    ? DateTime.fromJSDate(finishedAt)
    : undefined;

  const duration = useDuration(startedAtInstance, finishedAtInstance, 'full');

  return (
    <ListItemButton
      sx={{
        borderRadius: 6,
        gap: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
      css={(theme) => lightBackgroundContainer(theme, { active: showDetails })}
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
      >
        <ListItemText>
          <Typography component="span" fontWeight={showDetails ? 700 : 400}>
            Call {serialNumber}
          </Typography>
          {!showDetails && (
            <>
              {' '}
              — {startedAtInstance.toLocaleString(dateTimeFormat)}
              <Stack direction="row" gap={2} mt={0.5}>
                {!showDetails && (
                  <Stack direction="row" gap={1}>
                    <AccessTimeFilledIcon fontSize="small" sx={{ mt: 0.1 }} />
                    {duration}
                  </Stack>
                )}
                <Stack direction="row" gap={1}>
                  <PeopleIcon fontSize="small" sx={{ mt: 0.1 }} />
                  {participants.length}
                </Stack>
              </Stack>
            </>
          )}
        </ListItemText>
        {!showDetails && <ParticipantsList participants={participants} />}
        {!finishedAt && <BlinkingCircle />}
        <ArrowForwardIosIcon
          sx={{ transform: `rotate(${showDetails ? '90deg' : 0})` }}
        />
      </Stack>
      {showDetails && (
        <Stack ml={-1} mr={-1} pl={2} pr={2} gap={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
          >
            <CallTimeInfo
              startedAt={startedAtInstance}
              finishedAt={finishedAtInstance}
            />
            <ParticipantsInfo participants={participants} />
          </Stack>
          <NotesInfo />
        </Stack>
      )}
    </ListItemButton>
  );
};

const CallTimeInfo: FC<{ startedAt: DateTime; finishedAt?: DateTime }> = ({
  startedAt,
  finishedAt,
}) => {
  const startDate = startedAt.toLocaleString({ dateStyle: 'medium' });
  const startTime = startedAt.toLocaleString({ timeStyle: 'short' });
  const finishedTime = finishedAt
    ? finishedAt.toLocaleString({ timeStyle: 'short' })
    : 'present';

  const duration = useDuration(startedAt, finishedAt, 'full');

  return (
    <Stack direction="row" gap={1}>
      <AccessTimeFilledIcon fontSize="small" sx={{ mt: 0.1 }} />
      {startDate} {startTime} — {finishedTime} ({duration})
    </Stack>
  );
};

const ParticipantsInfo: FC<{
  participants: RouterOutputs['rooms']['getRoomSession'][number]['participants'];
}> = ({ participants }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Stack direction="row" gap={1}>
        <PeopleIcon fontSize="small" sx={{ mt: 0.1 }} />
        {participants.length}
      </Stack>
      <ParticipantsList participants={participants} showPlaceholder />
    </Stack>
  );
};

const ParticipantsList: FC<{
  participants: RouterOutputs['rooms']['getRoomSession'][number]['participants'];
  showPlaceholder?: boolean;
}> = (props) => {
  const { participants, showPlaceholder = false } = props;
  return (
    <ClassNames>
      {({ css, theme }) => (
        <Tooltip
          classes={{
            tooltip: css`
              background-color: ${theme.palette.background.paper};
              border-radius: ${theme.spacing(3)};
              min-width: ${theme.spacing(45)};
            `,
          }}
          placement="right-start"
          title={
            <List>
              {participants.map(({ user: { id, name, email, image } }) => (
                <ListItem key={id}>
                  <ListItemAvatar>
                    <Avatar>
                      <Image
                        alt={name!}
                        src={image!}
                        width={AVATAR_SIZE}
                        height={AVATAR_SIZE}
                        quality={80}
                        loader={getImageLoader(image!)}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={name} secondary={email} />
                </ListItem>
              ))}
            </List>
          }
        >
          <AvatarGroup
            max={5}
            sx={{ borderRadius: 6, minWidth: showPlaceholder ? 190 : 'auto' }}
            css={(theme) => lightBackgroundContainer(theme, { active: false })}
          >
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
        </Tooltip>
      )}
    </ClassNames>
  );
};

const NotesInfo: FC = () => {
  return <Stack>Notes will be here!</Stack>;
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

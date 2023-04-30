import { FC, Fragment } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, List, Stack, Typography } from '@mui/material';
import { first } from 'lodash';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

import BlinkingCircle from '@/components/BlinkingCircle';
import { DashboardSceneType } from '@/components/DashboardScene';
import {
  dateTimeFormat,
  ListDivider,
} from '@/components/DashboardScene/Rooms/RoomSessionsList';
import RoomNotesGrid from '@/components/NotesGrid';
import { lightBackgroundContainer } from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

import { goToDashboardScene } from '@/routing/index';

interface Props {
  notesGroups: RouterOutputs['notes']['getGroupedRoomNotes'];
  showDetailsLink?: boolean;
  onViewNote: (noteId: string) => void;
}

const NotesGroupsList: FC<Props> = (props) => {
  const { notesGroups, showDetailsLink, onViewNote } = props;

  return (
    <List>
      {notesGroups?.map((notesGroup, index, arr) => (
        <Fragment key={`${notesGroup.sessionId}_${index}`}>
          <RoomNotesGroup
            notesGroup={notesGroup}
            showDetailsLink={showDetailsLink}
            onViewNote={onViewNote}
          />
          {index !== arr.length - 1 && <ListDivider />}
        </Fragment>
      ))}
    </List>
  );
};

const RoomNotesGroup: FC<{
  notesGroup: RouterOutputs['notes']['getGroupedRoomNotes'][number];
  showDetailsLink?: boolean;
  onViewNote: (noteId: string) => void;
}> = (props) => {
  const { notesGroup, showDetailsLink, onViewNote } = props;

  const router = useRouter();

  const session = first(notesGroup.notes)?.roomSession;
  const startedAtInstance = session
    ? DateTime.fromJSDate(session?.startedAt)
    : null;

  const handleCallDetailsClick = async (): Promise<boolean> =>
    goToDashboardScene(DashboardSceneType.Rooms, {
      ...router.query,
      session_id: session?.id,
    });

  return (
    <Stack
      css={(theme) => lightBackgroundContainer(theme)}
      p={2}
      borderRadius={6}
      gap={1.5}
    >
      {session && startedAtInstance ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <span>
            Call N — {startedAtInstance.toLocaleString(dateTimeFormat)}
          </span>
          <Stack direction="row" gap={1}>
            {session && !session.finishedAt && <BlinkingCircle />}
            {showDetailsLink && (
              <Button
                color="inherit"
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ px: 2, py: 0.5 }}
                css={lightBackgroundContainer}
                onClick={handleCallDetailsClick}
              >
                call details
              </Button>
            )}
          </Stack>
        </Stack>
      ) : (
        <Typography component="span">Beyond the call</Typography>
      )}

      <RoomNotesGrid notes={notesGroup.notes} onViewNote={onViewNote} />
    </Stack>
  );
};

export default NotesGroupsList;

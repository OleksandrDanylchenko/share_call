import { FC, Fragment } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, List, Stack, Typography } from '@mui/material';
import { first } from 'lodash';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import {
  dateTimeFormat,
  ListDivider,
} from '@/components/DashboardScene/Rooms/RoomSessionsList';
import RoomNotesGrid from '@/components/NotesGrid';
import { lightBackgroundContainer } from '@/styles/mixins';
import { api, RouterOutputs } from '@/utils/api';

import { goToDashboardScene } from '@/routing/index';

interface Props {
  activeRoomId: string;
  onCreateNote: () => void;
  onViewNote: (noteId: string) => void;
}

const RoomNotesList: FC<Props> = (props) => {
  const { activeRoomId, onCreateNote, onViewNote } = props;

  const { data: notesGroups, isLoading: isNotesLoading } =
    api.notes.getGroupedRoomNotes.useQuery({
      roomId: activeRoomId,
    });

  if (isNotesLoading) return null;
  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Notes:</Typography>
        <Button
          color="inherit"
          startIcon={<AddCircleOutlineIcon fontSize="small" />}
          sx={{ px: 2, py: 0.5 }}
          css={(theme) => lightBackgroundContainer(theme, { active: true })}
          onClick={onCreateNote}
        >
          new note
        </Button>
      </Stack>
      <List>
        {notesGroups?.map((notesGroup, index, arr) => (
          <Fragment key={`${notesGroup.sessionId}_${index}`}>
            <RoomNotesGroup notesGroup={notesGroup} onViewNote={onViewNote} />
            {index !== arr.length - 1 && <ListDivider />}
          </Fragment>
        ))}
      </List>
    </Stack>
  );
};

const RoomNotesGroup: FC<{
  notesGroup: RouterOutputs['notes']['getGroupedRoomNotes'][number];
  onViewNote: (noteId: string) => void;
}> = (props) => {
  const { notesGroup, onViewNote } = props;

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
          <Button
            color="inherit"
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
            sx={{ px: 2, py: 0.5 }}
            css={lightBackgroundContainer}
            onClick={handleCallDetailsClick}
          >
            call details
          </Button>
        </Stack>
      ) : (
        <Typography component="span">Beyond the call</Typography>
      )}

      <RoomNotesGrid notes={notesGroup.notes} onViewNote={onViewNote} />
    </Stack>
  );
};

export default RoomNotesList;

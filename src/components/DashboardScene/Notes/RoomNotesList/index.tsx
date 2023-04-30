import { FC } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Stack, Typography } from '@mui/material';

import NotesGroupsList from '@/components/NotesGroupsList';
import { lightBackgroundContainer } from '@/styles/mixins';
import { api } from '@/utils/api';

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
      {notesGroups && (
        <NotesGroupsList notesGroups={notesGroups} onViewNote={onViewNote} />
      )}
    </Stack>
  );
};

export default RoomNotesList;

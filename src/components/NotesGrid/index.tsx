import { FC } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import NotePreview from '@/components/NotePreview';
import { RouterOutputs } from '@/utils/api';

export type Notes =
  | RouterOutputs['notes']['getGroupedRoomNotes'][number]['notes']
  | RouterOutputs['notes']['getSessionNotes'];

interface Props {
  notes: Notes;
  onViewNote: (noteId: string) => void;
}

const RoomNotesGrid: FC<Props> = (props) => {
  const { notes, onViewNote } = props;
  return (
    <Grid container spacing={2}>
      {notes.map((note) => (
        <Grid key={note.id}>
          <NotePreview note={note} onViewNote={onViewNote} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RoomNotesGrid;

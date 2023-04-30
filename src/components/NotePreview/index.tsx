import { FC } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { lightBackgroundContainer, lineClamp } from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

interface Props {
  note: RouterOutputs['notes']['getGroupedRoomNotes'][number]['notes'][number];
  onViewNote: (noteId: string) => void;
}

const NotePreview: FC<Props> = (props) => {
  const { note, onViewNote } = props;
  const { content } = note;

  const [firstLine] = content.split('\n');

  return (
    <Button
      sx={{
        width: 200,
        flexDirection: 'column',
        p: 1,
        gap: 1,
        borderRadius: 2,
      }}
      color="inherit"
      onClick={() => onViewNote(note.id)}
    >
      <Box
        css={lightBackgroundContainer}
        p={1}
        borderRadius={3}
        height={150}
        overflow="hidden"
        fontSize={9}
      >
        {content}
      </Box>
      <Typography css={lineClamp(1)} fontSize={12} textAlign="center">
        {firstLine}
      </Typography>
    </Button>
  );
};

export default NotePreview;

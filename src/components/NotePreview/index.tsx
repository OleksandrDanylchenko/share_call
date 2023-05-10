import { FC } from 'react';

import { Box, Button, Typography, Stack } from '@mui/material';
import { DateTime } from 'luxon';

import {
  fullWidth,
  lightBackgroundContainer,
  lineClamp,
} from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

interface Props {
  note: RouterOutputs['notes']['getGroupedRoomNotes'][number]['notes'][number];
  onViewNote: (noteId: string) => void;
}

const NotePreview: FC<Props> = (props) => {
  const { note, onViewNote } = props;
  const { content, createdAt } = note;

  const [firstLine] = content.split('\n');
  const createdAtDateTime = DateTime.fromJSDate(createdAt).toLocaleString(
    DateTime.DATETIME_SHORT,
  );

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
        css={[fullWidth, lightBackgroundContainer]}
        p={1}
        borderRadius={3}
        height={150}
        overflow="hidden"
        fontSize={9}
        fontWeight="normal"
        textAlign="left"
        whiteSpace="pre-wrap"
      >
        {content}
      </Box>
      <Stack gap={0.4}>
        <Typography css={lineClamp(1)} fontSize={12} textAlign="center">
          {firstLine}
        </Typography>
        <Typography
          css={lineClamp(1)}
          fontSize={11}
          textAlign="center"
          color="grey.500"
        >
          {createdAtDateTime}
        </Typography>
      </Stack>
    </Button>
  );
};

export default NotePreview;

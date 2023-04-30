import { FC } from 'react';

import { Stack, Box, Typography } from '@mui/material';

import { lightBackgroundContainer, lineClamp } from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

interface Props {
  note: RouterOutputs['notes']['getGroupedRoomNotes'][number]['notes'][number];
}

const NotePreview: FC<Props> = (props) => {
  const { note } = props;
  const { content } = note;

  const [firstLine] = content.split('\n');

  return (
    <Stack alignItems="center" justifyContent="center" gap={1} width={200}>
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
    </Stack>
  );
};

export default NotePreview;

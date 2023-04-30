import React, { FC, useState } from 'react';

import { ClassNames } from '@emotion/react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Button, Drawer, IconButton, Stack } from '@mui/material';
import { useToggle } from 'usehooks-ts';

import RoomNotesGrid from '@/components/NotesGrid';
import {
  blurBackgroundContainer,
  fullHeight,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const CallSidebarNotes: FC<Props> = (props) => {
  const { roomId } = props;

  const [showInfo, toggleShowInfo] = useToggle(false);

  const { data: targetRoom } = api.rooms.getRoom.useQuery(
    { id: roomId },
    { retry: 1 },
  );

  const lastSessionId = targetRoom?.lastSession?.id;
  const { data: notes } = api.notes.getSessionNotes.useQuery(
    { sessionId: lastSessionId! },
    { enabled: !!lastSessionId },
  );

  const [editingNoteId, setEditingNoteId] = useState<string | undefined | null>(
    null,
  );
  const handleCreateNote = async (): Promise<void> =>
    setEditingNoteId(undefined);

  const handleViewNote = async (noteId: string): Promise<void> =>
    setEditingNoteId(noteId);
  const handleClose = (): void => {
    setEditingNoteId(null);
  };

  return (
    <>
      <IconButton
        css={(theme) =>
          shadowBorder(theme, {
            blurRadius: '16px',
            color: theme.palette.warning.main,
          })
        }
        size="medium"
        onClick={toggleShowInfo}
      >
        <TextSnippetIcon />
      </IconButton>
      <ClassNames>
        {({ css, theme }) => (
          <Drawer
            anchor="right"
            open={showInfo}
            onClose={toggleShowInfo}
            PaperProps={{
              sx: {
                width: 420,
                padding: 4,
              },
              className: css(
                shadowBorder(theme, { color: theme.palette.warning.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            {targetRoom && (
              <Stack css={fullHeight} justifyContent="space-between">
                <Box>Here will be the notes!</Box>
              </Stack>
            )}
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};
export default CallSidebarNotes;

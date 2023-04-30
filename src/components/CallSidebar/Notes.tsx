import React, { FC, useState } from 'react';

import { ClassNames } from '@emotion/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useToggle } from 'usehooks-ts';

import NoteEditor from '@/components/NoteEditor';
import NotesGroupsList from '@/components/NotesGroupsList';
import {
  blurBackgroundContainer,
  fullHeight,
  lightBackgroundContainer,
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

  const { data: notesGroups } = api.notes.getGroupedRoomNotes.useQuery({
    roomId,
  });

  const [editingNoteId, setEditingNoteId] = useState<string | undefined | null>(
    null,
  );
  const handleCreateNote = async (): Promise<void> =>
    setEditingNoteId(undefined);
  const handleViewNote = async (noteId: string): Promise<void> =>
    setEditingNoteId(noteId);
  const handleNoteEditorClose = (): void => {
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
                width: 512,
                padding: 4,
              },
              className: css(
                shadowBorder(theme, { color: theme.palette.warning.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            {targetRoom && notesGroups && (
              <Stack css={fullHeight} justifyContent="space-between" gap={2}>
                {editingNoteId === null ? (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h5">Notes:</Typography>
                      <Button
                        color="inherit"
                        startIcon={<AddCircleOutlineIcon fontSize="small" />}
                        sx={{ px: 2, py: 0.5 }}
                        css={(theme) =>
                          lightBackgroundContainer(theme, { active: true })
                        }
                        onClick={handleCreateNote}
                      >
                        new note
                      </Button>
                    </Stack>
                    {notesGroups && (
                      <NotesGroupsList
                        notesGroups={notesGroups}
                        onViewNote={handleViewNote}
                        showDetailsLink={false}
                      />
                    )}
                    <Button
                      color="inherit"
                      sx={{ width: '30%', alignSelf: 'flex-end' }}
                      endIcon={<ArrowForwardIosIcon />}
                      onClick={toggleShowInfo}
                    >
                      Close
                    </Button>
                  </>
                ) : (
                  <NoteEditor
                    activeRoomId={roomId}
                    noteId={editingNoteId}
                    onClose={handleNoteEditorClose}
                  />
                )}
              </Stack>
            )}
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};
export default CallSidebarNotes;

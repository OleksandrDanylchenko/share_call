import React, { FC, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { ClassNames } from '@emotion/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';

import {
  blurBackgroundContainer,
  fullHeight,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  activeRoomId: string;
  noteId?: string;
  onClose: () => void;
}

const NoteEditor: FC<Props> = (props) => {
  const { activeRoomId, noteId: propNoteId, onClose } = props;

  const [noteId, setNoteId] = useState(propNoteId);

  const { data: note } = api.notes.getNote.useQuery(
    { id: noteId! },
    { enabled: !!noteId },
  );

  const contentFormContext = useForm({
    values: { content: note?.content || '' },
  });

  const apiUtils = api.useContext();
  const { mutate: createNote, isLoading: creatingRoom } =
    api.notes.createNote.useMutation({
      async onSuccess({ id }) {
        setNoteId(id);
        await apiUtils.notes.getGroupedRoomNotes.invalidate();
      },
    });
  const { mutate: updateNote, isLoading: updatingRoom } =
    api.notes.updateNote.useMutation({
      async onMutate({ id, ...updated }) {
        apiUtils.notes.getNote.setData({ id }, (prevNote) => ({
          ...prevNote!,
          ...updated,
        }));
      },
      async onSuccess({ id }) {
        setNoteId(id);
        await apiUtils.notes.getGroupedRoomNotes.invalidate();
      },
    });

  const handleContentSubmit = async ({
    content,
  }: {
    content: string;
  }): Promise<void> => {
    if (!note) {
      createNote({ roomId: activeRoomId, content });
    } else {
      updateNote({ id: note.id, content });
    }
  };

  return (
    <Stack css={fullHeight} gap={1} pb={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Typography variant="h3">
          {noteId ? 'Update' : 'Create'} your note
        </Typography>
        {noteId && <NoteDeleteButton noteId={noteId} onClose={onClose} />}
      </Stack>
      <ClassNames>
        {({ css, theme }) => (
          <FormContainer
            formContext={contentFormContext}
            onSuccess={handleContentSubmit}
            FormProps={{
              className: css`
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                gap: ${theme.spacing(2)};
              `,
            }}
          >
            <TextFieldElement
              css={fullHeight}
              id="content-field"
              name="content"
              variant="standard"
              fullWidth
              required
              hiddenLabel
              multiline
              disabled={creatingRoom || updatingRoom}
              InputProps={{
                className: css`
                  align-items: flex-start;
                  height: 100%;
                `,
              }}
            />
            <Stack direction="row" justifyContent="flex-end" gap={1}>
              <Button
                color="inherit"
                sx={{ width: 'fit-content' }}
                startIcon={<ArrowBackIosIcon />}
                onClick={onClose}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.common.white })
                }
                variant="outlined"
                color="inherit"
                loading={creatingRoom || updatingRoom}
              >
                <span>Save</span>
              </LoadingButton>
            </Stack>
          </FormContainer>
        )}
      </ClassNames>
    </Stack>
  );
};

const NoteDeleteButton: FC<{ noteId: string; onClose: () => void }> = (
  props,
) => {
  const { noteId, onClose } = props;

  const dialogState = usePopupState({ variant: 'dialog' });
  const { close } = dialogState;

  const apiUtils = api.useContext();
  const { mutate: deleteNote, isLoading: deletingRoom } =
    api.notes.deleteNote.useMutation({
      async onMutate() {
        await apiUtils.notes.getNote.reset({ id: noteId });
        close();
      },
      async onSettled() {
        await apiUtils.notes.getGroupedRoomNotes.invalidate();
        onClose();
      },
    });

  return (
    <>
      <IconButton
        css={(theme) =>
          shadowBorder(theme, {
            blurRadius: '10px',
            color: theme.palette.error.main,
          })
        }
        aria-label="Delete a note"
        {...bindTrigger(dialogState)}
      >
        <DeleteOutlineIcon fontSize="medium" />
      </IconButton>
      <ClassNames>
        {({ css, theme }) => (
          <Dialog
            {...bindDialog(dialogState)}
            aria-labelledby="note-delete-alert-title"
            PaperProps={{
              sx: { p: 3 },
              className: css(
                shadowBorder(theme, { color: theme.palette.error.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            <DialogTitle id="note-delete-alert-title">
              Are you sure you want to delete this room?
            </DialogTitle>
            <DialogActions>
              <Button color="inherit" disabled={deletingRoom} onClick={close}>
                Nope!
              </Button>
              <LoadingButton
                color="inherit"
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.primary.main })
                }
                loading={deletingRoom}
                onClick={() => deleteNote({ id: noteId })}
              >
                Yes, I&apos;m sure!
              </LoadingButton>
            </DialogActions>
          </Dialog>
        )}
      </ClassNames>
    </>
  );
};

export default NoteEditor;

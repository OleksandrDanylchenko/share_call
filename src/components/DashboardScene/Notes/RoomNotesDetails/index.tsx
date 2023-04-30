import { FC, useState } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import RoomNotesList from '@/components/DashboardScene/Notes/RoomNotesList';
import NoteEditor from '@/components/NoteEditor';
import { lightBackgroundContainer } from '@/styles/mixins';
import { api } from '@/utils/api';

import { goToDashboardScene } from '@/routing/index';

interface Props {
  activeRoomId?: string;
}

const RoomNotesDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

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
    <Stack flex={1} gap={2} overflow="auto">
      {editingNoteId === null ? (
        <>
          <RoomInfo activeRoomId={activeRoomId} />
          <RoomNotesList
            activeRoomId={activeRoomId}
            onCreateNote={handleCreateNote}
            onViewNote={handleViewNote}
          />
        </>
      ) : (
        <NoteEditor
          activeRoomId={activeRoomId}
          noteId={editingNoteId}
          onClose={handleClose}
        />
      )}
    </Stack>
  );
};

const RoomInfo: FC<{ activeRoomId: string }> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();

  const { data: activeRoom } = api.rooms.getRoom.useQuery({ id: activeRoomId });

  const handleRoomDetailsClick = async (): Promise<boolean> =>
    goToDashboardScene(DashboardSceneType.Rooms, {
      ...router.query,
      room_id: activeRoomId,
      session_id: undefined,
    });

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack gap={1}>
        <Typography variant="h4">{activeRoom?.name}</Typography>
        <Typography variant="body2">{activeRoom?.description}</Typography>
      </Stack>
      <Button
        color="inherit"
        endIcon={<ArrowForwardIosIcon fontSize="small" />}
        sx={{ px: 2, py: 0.5 }}
        css={lightBackgroundContainer}
        onClick={handleRoomDetailsClick}
      >
        room details
      </Button>
    </Stack>
  );
};

export default RoomNotesDetails;

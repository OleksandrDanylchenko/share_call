import React, { FC } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import RoomUpdateForm from '@/components/DashboardScene/Rooms/RoomUpdateForm';
import { goToScene } from '@/components/DashboardScene/routing';
import PillContainer from '@/components/PillContainer';
import { shadowBorder } from '@/styles/mixins';
import { api } from '@/utils/api';
import RoomInvite from 'components/RoomInvite';

interface Props {
  activeRoomId?: string;
}

const RoomDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  const { data: activeRoom } = api.rooms.getRoom.useQuery(
    { id: activeRoomId },
    { trpc: { abortOnUnmount: true } },
  );

  return (
    <Stack flex={1} gap={4}>
      {activeRoom && (
        <>
          <RoomDelete activeRoomId={activeRoom.id} />
          <RoomUpdateForm activeRoom={activeRoom} />
          <RoomInvite inviteCode={activeRoom.inviteCode} />
          <RoomJoin activeRoomId={activeRoom.id} />
        </>
      )}
    </Stack>
  );
};

const RoomDelete: FC<{ activeRoomId: string }> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();

  const dialogState = usePopupState({ variant: 'dialog' });
  const { close } = dialogState;

  const apiUtils = api.useContext();
  const { mutate: deleteRoom, isLoading: deletingRoom } =
    api.rooms.deleteRoom.useMutation({
      async onMutate() {
        await apiUtils.rooms.getRoom.reset({ id: activeRoomId });
        apiUtils.rooms.getRooms.setData(undefined, (prevRooms) =>
          prevRooms?.filter(({ id: roomId }) => roomId !== activeRoomId),
        );
        await goToScene(router, DashboardSceneType.Rooms);
        close();
      },
      async onSettled() {
        await apiUtils.rooms.getRooms.invalidate();
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
        aria-label="Delete a room"
        sx={{
          position: 'absolute',
          right: 20,
          top: 20,
        }}
        {...bindTrigger(dialogState)}
      >
        <DeleteOutlineIcon fontSize="medium" />
      </IconButton>
      <Dialog
        {...bindDialog(dialogState)}
        aria-labelledby="room-delete-alert-title"
      >
        <DialogTitle id="room-delete-alert-title">
          Are you sure you want to delete this room?
        </DialogTitle>
        <DialogActions>
          <Button disabled={deletingRoom} onClick={close}>
            Nope!
          </Button>
          <LoadingButton
            loading={deletingRoom}
            onClick={() => deleteRoom({ id: activeRoomId })}
          >
            Yes, I&apos;m sure!
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

const RoomJoin: FC<{ activeRoomId: string }> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();
  const handleJoinClick = async (): Promise<boolean> =>
    router.push(`/preview/${activeRoomId}`);

  return (
    <PillContainer active>
      <Typography variant="h5">Join the room</Typography>
      <IconButton size="large" onClick={handleJoinClick}>
        <LoginIcon fontSize="large" />
      </IconButton>
    </PillContainer>
  );
};

export default RoomDetails;

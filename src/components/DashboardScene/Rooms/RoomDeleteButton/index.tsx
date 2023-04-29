import React, { FC } from 'react';

import { ClassNames } from '@emotion/react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import { blurBackgroundContainer, shadowBorder } from '@/styles/mixins';
import { api } from '@/utils/api';

import { goToDashboardScene } from '@/routing/index';

interface Props {
  activeRoomId: string;
}

const RoomDeleteButton: FC<Props> = (props) => {
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
        await goToDashboardScene(DashboardSceneType.Rooms);
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
      <ClassNames>
        {({ css, theme }) => (
          <Dialog
            {...bindDialog(dialogState)}
            aria-labelledby="room-delete-alert-title"
            PaperProps={{
              sx: { p: 3 },
              className: css(
                shadowBorder(theme, { color: theme.palette.error.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            <DialogTitle id="room-delete-alert-title">
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
                onClick={() => deleteRoom({ id: activeRoomId })}
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

export default RoomDeleteButton;

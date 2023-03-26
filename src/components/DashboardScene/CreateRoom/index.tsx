import React, { FC } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { ClassNames } from '@emotion/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import { goToOptions, goToScene } from '@/components/DashboardScene/routing';
import { fullParent, shadowBorder, textFieldEllipsis } from '@/styles/mixins';
import { api } from '@/utils/api';

const DashboardCreateRoom: FC = () => {
  const router = useRouter();

  const formContext = useForm({ defaultValues: { name: '', description: '' } });
  const { watch, getValues } = formContext;

  const { mutateAsync: createRoom, isLoading } =
    api.rooms.createRoom.useMutation();

  const handleCreateRoomClick = async (): Promise<boolean> => {
    const { id: newRoomId } = await createRoom(getValues());
    return goToScene(router, DashboardSceneType.Rooms, { room_id: newRoomId });
  };

  const handleCreateAndJoinClick = async (): Promise<boolean> => {
    const { id: newRoomId } = await createRoom(getValues());
    return router.push(`/preview/${newRoomId}`);
  };

  return (
    <Stack css={fullParent} px={5} py={7}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content' }}
        startIcon={<ArrowBackIosIcon />}
        disabled={isLoading}
        onClick={() => goToOptions(router)}
      >
        Back to dashboard
      </Button>
      <ClassNames>
        {({ css }) => (
          <FormContainer
            formContext={formContext}
            FormProps={{
              className: css`
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
              `,
            }}
          >
            <Stack flex={1} gap={5} justifyContent="center">
              <Stack gap={2}>
                <Typography
                  variant="h5"
                  component="label"
                  htmlFor="room-name-field"
                >
                  How the room should be named?*
                </Typography>
                <TextFieldElement
                  id="room-name-field"
                  css={textFieldEllipsis}
                  name="name"
                  variant="filled"
                  fullWidth
                  hiddenLabel
                />
              </Stack>
              <Stack gap={2}>
                <Typography
                  variant="h6"
                  component="label"
                  htmlFor="room-description-field"
                >
                  How can the discussion topic be described?
                </Typography>
                <ClassNames>
                  {({ css }) => (
                    <TextFieldElement
                      id="room-description-field"
                      name="description"
                      variant="filled"
                      fullWidth
                      hiddenLabel
                      multiline
                      rows={8}
                      InputProps={{
                        className: css`
                          font-size: 0.88em;
                        `,
                      }}
                    />
                  )}
                </ClassNames>
              </Stack>
            </Stack>
            <Stack gap={2} direction="row">
              <LoadingButton
                css={shadowBorder}
                color="inherit"
                startIcon={<AddCircleOutlineIcon />}
                disabled={!watch('name').length}
                loading={isLoading}
                fullWidth
                onClick={handleCreateRoomClick}
              >
                <span>Create room</span>
              </LoadingButton>
              <LoadingButton
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.warning.light })
                }
                color="inherit"
                startIcon={<LoginIcon />}
                disabled={!watch('name').length}
                loading={isLoading}
                fullWidth
                onClick={handleCreateAndJoinClick}
              >
                <span>Create room and join call</span>
              </LoadingButton>
            </Stack>
          </FormContainer>
        )}
      </ClassNames>
    </Stack>
  );
};

export default DashboardCreateRoom;

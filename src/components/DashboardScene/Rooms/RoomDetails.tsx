import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import { ClassNames } from '@emotion/react';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Stack, Typography } from '@mui/material';
import { pickBy } from 'lodash';

import SingleFieldForm from '@/components/SingleFieldForm';
import { fullHeight, fullWidth } from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  activeRoomId?: string;
}

const RoomDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  const { data: rooms, isLoading } = api.rooms.getRooms.useQuery(undefined, {
    trpc: { abortOnUnmount: true },
  });
  const activeRoom = rooms?.find((room) => room.id === activeRoomId);
  const activeName = activeRoom?.name || '';
  const activeDescription = activeRoom?.description || '';

  const nameFormContext = useForm({ values: { name: activeName } });

  const apiUtils = api.useContext();
  const { mutate: updateRoom } = api.rooms.updateRoom.useMutation({
    async onMutate({ id, ...updated }) {
      await apiUtils.rooms.getRooms.cancel();

      const prevData = apiUtils.rooms.getRooms.getData();
      apiUtils.rooms.getRooms.setData(
        undefined,
        prevData?.map((room) =>
          room.id === id ? { ...room, ...updated } : room,
        ),
      );
      return { prevData };
    },
    onError(_err, _newPost, ctx) {
      apiUtils.rooms.getRooms.setData(undefined, ctx?.prevData);
    },
  });

  const handleRoomUpdate = (
    data: { name: string } | { description: string },
  ): void => {
    if (
      ('name' in data && data.name !== activeName) ||
      ('description' in data && data.description !== activeDescription)
    ) {
      updateRoom({ id: activeRoomId, ...pickBy(data) });
    }
  };

  return (
    <Stack css={fullWidth}>
      <ClassNames>
        {({ css, theme }) => (
          <SingleFieldForm
            formProps={{
              formContext: nameFormContext,
              onSuccess: handleRoomUpdate,
            }}
            textFieldProps={{
              label: 'Name',
              name: 'name',
              hiddenLabel: true,
              InputProps: {
                className: css`
                  font-size: ${theme.typography.h4.fontSize};
                `,
              },
              fullWidth: true,
            }}
          />
        )}
      </ClassNames>
    </Stack>
  );
};

const DetailsPlaceholder: FC = () => (
  <Stack css={fullHeight} justifyContent="center" pl={8}>
    <Stack alignItems="center" justifyContent="center">
      <Typography variant="h2" fontSize="6rem">
        Choose <br /> a room
      </Typography>
      <ArrowCircleLeftIcon sx={{ fontSize: '5rem' }} />
    </Stack>
  </Stack>
);

const RoomDetailsContainer: FC<Props> = (props) => {
  const { activeRoomId } = props;
  return !activeRoomId ? (
    <DetailsPlaceholder />
  ) : (
    <RoomDetails activeRoomId={activeRoomId} />
  );
};

export default RoomDetailsContainer;

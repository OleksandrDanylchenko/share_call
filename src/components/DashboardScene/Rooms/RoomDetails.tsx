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

export const RoomDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  const { data: rooms, isLoading } = api.rooms.getRooms.useQuery(undefined, {
    trpc: { abortOnUnmount: true },
  });
  const activeRoom = rooms?.find((room) => room.id === activeRoomId);
  const activeName = activeRoom?.name || '';
  const activeDescription = activeRoom?.description || '';

  const nameFormContext = useForm({ values: { name: activeName } });
  const descriptionFormContext = useForm({
    values: { description: activeDescription },
  });

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
    <Stack flex={1} gap={2}>
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
            ellipsis
          />
        )}
      </ClassNames>
      <ClassNames>
        {({ css, theme }) => (
          <SingleFieldForm
            formProps={{
              formContext: descriptionFormContext,
              onSuccess: handleRoomUpdate,
            }}
            textFieldProps={{
              label: 'Description',
              name: 'description',
              hiddenLabel: true,
              fullWidth: true,
              multiline: true,
              rows: 4,
              InputProps: {
                className: css`
                  color: ${theme.palette.text.secondary};
                  font-size: ${theme.typography.body2.fontSize};
                `,
              },
            }}
          />
        )}
      </ClassNames>
    </Stack>
  );
};

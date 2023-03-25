import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import { ClassNames } from '@emotion/react';
import { Stack } from '@mui/material';
import { isUndefined, omitBy } from 'lodash';

import SingleFieldForm from '@/components/SingleFieldForm';
import { api, RouterOutputs } from '@/utils/api';

interface Props {
  activeRoom: RouterOutputs['rooms']['getRooms'][number];
}

const RoomUpdateForm: FC<Required<Props>> = (props) => {
  const { activeRoom } = props;

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
      updateRoom({ id: activeRoom.id, ...omitBy(data, isUndefined) });
    }
  };

  return (
    <Stack gap={2.5}>
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
              required: false,
              hiddenLabel: true,
              fullWidth: true,
              multiline: true,
              maxRows: 3,
              InputProps: {
                className: css`
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

export default RoomUpdateForm;

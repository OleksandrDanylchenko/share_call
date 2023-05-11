import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import { ClassNames } from '@emotion/react';
import { Stack, Typography } from '@mui/material';
import { isUndefined, omitBy } from 'lodash';
import { useSession } from 'next-auth/react';

import SingleFieldForm from '@/components/SingleFieldForm';
import { api, RouterOutputs } from '@/utils/api';

interface Props {
  activeRoom: RouterOutputs['rooms']['getRoom'];
}

const RoomUpdateForm: FC<Required<Props>> = (props) => {
  const { activeRoom } = props;

  const { creatorId } = activeRoom!;
  const { data: session } = useSession();
  const isCreator = session?.user?.id === creatorId;

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
      await apiUtils.rooms.getRoom.cancel();

      const prevRoomsData = apiUtils.rooms.getRooms.getData();
      if (prevRoomsData) {
        apiUtils.rooms.getRooms.setData(
          undefined,
          prevRoomsData?.map((room) =>
            room.id === id ? { ...room, ...updated } : room,
          ),
        );
      }

      const prevRoomData = apiUtils.rooms.getRoom.getData({ id });
      if (prevRoomData) {
        apiUtils.rooms.getRoom.setData(
          { id },
          {
            ...prevRoomData,
            ...updated,
          },
        );
      }

      return { prevRoomsData, prevRoomData };
    },
    onError(_err, { id }, ctx) {
      apiUtils.rooms.getRooms.setData(undefined, ctx?.prevRoomsData);
      apiUtils.rooms.getRoom.setData({ id }, ctx?.prevRoomData);
    },
  });

  const handleRoomUpdate = (
    data: { name: string } | { description: string },
  ): void => {
    if (
      ('name' in data && data.name !== activeName) ||
      ('description' in data && data.description !== activeDescription)
    ) {
      updateRoom({ id: activeRoom!.id, ...omitBy(data, isUndefined) });
    }
  };

  return (
    <Stack gap={2.5}>
      <ClassNames>
        {({ css, theme }) => (
          <>
            {isCreator ? (
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
            ) : (
              <Typography variant="h4">{activeName}</Typography>
            )}
          </>
        )}
      </ClassNames>
      <ClassNames>
        {({ css, theme }) => (
          <>
            {isCreator ? (
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
            ) : (
              <Typography variant="body2">{activeDescription}</Typography>
            )}
          </>
        )}
      </ClassNames>
    </Stack>
  );
};

export default RoomUpdateForm;

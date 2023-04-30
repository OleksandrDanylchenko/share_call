import { FC, Fragment } from 'react';

import {
  FormControlLabel,
  List,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';

import { ListDivider } from '@/components/DashboardScene/Rooms/RoomSessionsList';
import { api, RouterOutputs } from '@/utils/api';

interface Props {
  activeRoomId: string;
}

const RoomNotesList: FC<Props> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();

  const { data: notesGroups, isLoading: isNotesLoading } =
    api.notes.getGroupedRoomNotes.useQuery({
      roomId: activeRoomId,
    });

  const separateByCalls = router.query.separate_by_calls === 'true';
  const handleSeparateByCalls = async (): Promise<void> => {
    const nextShowDetails = !separateByCalls;
    await router.replace(
      {
        query: {
          ...router.query,
          separate_by_calls: nextShowDetails,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  if (isNotesLoading) return null;
  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" gap={2}>
        <Typography variant="h5">Notes:</Typography>
        <FormControlLabel
          control={<Switch color="primary" onChange={handleSeparateByCalls} />}
          label="Separate by calls"
        />
      </Stack>
      <List>
        {notesGroups?.map((notesGroup, index, arr) => (
          <Fragment key={`${notesGroup.sessionId}_${index}`}>
            <RoomNotesGroup
              notesGroup={notesGroup}
              separateByCalls={separateByCalls}
            />
            {separateByCalls && index !== arr.length - 1 && <ListDivider />}
          </Fragment>
        ))}
      </List>
    </Stack>
  );
};

const RoomNotesGroup: FC<{
  notesGroup: RouterOutputs['notes']['getGroupedRoomNotes'][number];
  separateByCalls: boolean;
}> = (props) => {
  const { notesGroup, separateByCalls } = props;

  return <h2>Hello there! {notesGroup.sessionId}</h2>;
};

export default RoomNotesList;

import { FC, Fragment } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Button,
  FormControlLabel,
  List,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { first } from 'lodash';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import {
  dateTimeFormat,
  ListDivider,
} from '@/components/DashboardScene/Rooms/RoomSessionsList';
import RoomNotesGrid from '@/components/NotesGrid';
import { lightBackgroundContainer } from '@/styles/mixins';
import { api, RouterOutputs } from '@/utils/api';

import { goToDashboardScene } from '@/routing/index';

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

  const router = useRouter();

  const session = first(notesGroup.notes)?.roomSession;
  const startedAtInstance = session
    ? DateTime.fromJSDate(session?.startedAt)
    : null;

  const handleCallDetailsClick = async (): Promise<boolean> =>
    goToDashboardScene(DashboardSceneType.Rooms, {
      ...router.query,
      session_id: session?.id,
    });

  return (
    <Stack
      css={(theme) =>
        separateByCalls ? lightBackgroundContainer(theme) : undefined
      }
      p={2}
      borderRadius={6}
      gap={1.5}
    >
      {separateByCalls && (
        <>
          {session && startedAtInstance ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <span>
                Call 2 — {startedAtInstance.toLocaleString(dateTimeFormat)}
              </span>
              <Button
                color="inherit"
                endIcon={<ArrowForwardIosIcon fontSize="small" />}
                sx={{ px: 2, py: 0.5 }}
                css={lightBackgroundContainer}
                onClick={handleCallDetailsClick}
              >
                call details
              </Button>
            </Stack>
          ) : (
            <Typography component="span">Beyond the call</Typography>
          )}
        </>
      )}
      <RoomNotesGrid notes={notesGroup.notes} />
    </Stack>
  );
};

export default RoomNotesList;

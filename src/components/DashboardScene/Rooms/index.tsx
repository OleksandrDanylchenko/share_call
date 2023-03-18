import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ClassNames } from '@emotion/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  alpha,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { range } from 'lodash';
import { useRouter } from 'next/router';

import { DashboardSceneProps } from '@/components/DashboardScene';
import { checkIsElementInView } from '@/hooks/useIsElementInView';
import { fullHeight, fullParent, fullWidth, lineClamp } from '@/styles/mixins';
import { api } from '@/utils/api';

const DashboardRooms: FC<DashboardSceneProps> = (props) => {
  const { onSceneChange } = props;

  const router = useRouter();
  const activeRoomId = router.query.room_id as string | undefined;

  return (
    <Stack css={fullParent} px={5} pt={3} gap={3}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content' }}
        startIcon={<ArrowBackIosIcon />}
        onClick={() => onSceneChange('/')}
      >
        Back to dashboard
      </Button>
      <RoomsList activeRoomId={activeRoomId} />
    </Stack>
  );
};

interface RoomListItemProps {
  activeRoomId?: string;
}

const RoomsList: FC<RoomListItemProps> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();

  const { data: rooms, isLoading } = api.rooms.getRooms.useQuery(undefined, {
    trpc: { abortOnUnmount: true },
  });

  const [activeRoomItem, setActiveRoomItem] = useState<any>();
  useEffect(() => {
    if (activeRoomItem && !checkIsElementInView(activeRoomItem)) {
      activeRoomItem?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoomItem]);

  const handleRoomClick = (id: string): void => {
    router.replace({ query: { ...router.query, room_id: id } }, undefined, {
      shallow: true,
    });
  };

  const placeholderItems = useMemo(
    () =>
      range(0, 4).map((_, index, arr) => (
        <Fragment key={index}>
          <ListItem disablePadding>
            <Skeleton css={fullWidth} height={130} sx={{ transform: 'none' }} />
          </ListItem>
          {index !== arr.length - 1 && (
            <Divider
              variant="middle"
              sx={{ width: '90%', marginTop: 2, marginBottom: 2 }}
            />
          )}
        </Fragment>
      )),
    [],
  );

  return (
    <Stack pl={1} flex={1}>
      <Typography variant="h4" paddingLeft={2}>
        Rooms:
      </Typography>
      <Box css={fullHeight}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <List
              sx={{ width: '30%', maxWidth: 360, height, overflowY: 'auto' }}
            >
              {!rooms || isLoading ? (
                placeholderItems
              ) : (
                <>
                  {rooms.map(({ id, name, description }, index, arr) => (
                    <Fragment key={id}>
                      <ListItemButton
                        ref={
                          activeRoomId === id ? setActiveRoomItem : undefined
                        }
                        sx={{
                          borderRadius: 6,
                          backgroundColor: (theme) =>
                            alpha(
                              activeRoomId === id
                                ? theme.palette.warning.main
                                : theme.palette.primary.main,
                              0.1,
                            ),
                        }}
                        onClick={() => handleRoomClick(id)}
                      >
                        <ClassNames>
                          {({ css }) => (
                            <ListItemText
                              classes={{
                                primary: css`
                                  ${lineClamp()}
                                `,
                                secondary: css`
                                  ${lineClamp(3)}
                                `,
                              }}
                              primary={name}
                              secondary={description}
                            />
                          )}
                        </ClassNames>
                      </ListItemButton>
                      {index !== arr.length - 1 && (
                        <Divider
                          variant="middle"
                          sx={{ width: '90%', marginTop: 2, marginBottom: 2 }}
                        />
                      )}
                    </Fragment>
                  ))}
                </>
              )}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
};

export default DashboardRooms;

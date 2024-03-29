import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ClassNames } from '@emotion/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { checkIsElementInView } from '@/hooks/useIsElementInView';
import {
  fullHeight,
  lightBackgroundContainer,
  lineClamp,
  textFieldEllipsis,
} from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

interface Props {
  rooms: RouterOutputs['rooms']['getRooms'];
  activeRoomId?: string;
}

const RoomsList: FC<Props> = (props) => {
  const { rooms, activeRoomId } = props;

  const { data: session } = useSession();
  const router = useRouter();

  const [activeRoomItem, setActiveRoomItem] = useState<HTMLDivElement | null>(
    null,
  );
  useEffect(() => {
    if (activeRoomItem && !checkIsElementInView(activeRoomItem)) {
      activeRoomItem?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoomItem]);

  const [filter, setFilter] = useState('');
  const filteredRooms = useMemo(
    () =>
      rooms?.filter(
        ({ name, description }) =>
          name.toLowerCase().includes(filter.toLowerCase()) ||
          description?.toLowerCase()?.includes(filter.toLowerCase()),
      ),
    [rooms, filter],
  );

  const handleRoomClick = (id: string): void => {
    router.replace({ query: { ...router.query, room_id: id } }, undefined, {
      shallow: true,
    });
  };

  const [animateListParent] = useAutoAnimate();
  return (
    <Stack pl={1} gap={2} width="20%" minWidth={230}>
      <Typography variant="h4">Rooms:</Typography>
      <TextField
        css={textFieldEllipsis}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        hiddenLabel
        variant="standard"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Box css={fullHeight}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <List ref={animateListParent} sx={{ height, overflowY: 'auto' }}>
              {filteredRooms.map(
                ({ id, name, description, creatorId }, index, arr) => (
                  <Fragment key={id}>
                    <ListItemButton
                      ref={activeRoomId === id ? setActiveRoomItem : undefined}
                      css={(theme) =>
                        lightBackgroundContainer(theme, {
                          active: activeRoomId === id,
                        })
                      }
                      sx={{ borderRadius: 6, gap: 1 }}
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
                      {creatorId !== session?.user?.id && (
                        <GroupAddIcon fontSize="small" />
                      )}
                    </ListItemButton>
                    {index !== arr.length - 1 && (
                      <Divider
                        variant="middle"
                        sx={{ width: '90%', marginTop: 2, marginBottom: 2 }}
                      />
                    )}
                  </Fragment>
                ),
              )}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
};

export default RoomsList;

import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ClassNames } from '@emotion/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  alpha,
  Box,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { range } from 'lodash';
import { useRouter } from 'next/router';

import { checkIsElementInView } from '@/hooks/useIsElementInView';
import {
  fullHeight,
  fullWidth,
  lineClamp,
  textFieldEllipsis,
} from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  activeRoomId?: string;
}

export const RoomsList: FC<Props> = (props) => {
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

  const [animateListParent] = useAutoAnimate();
  return (
    <Stack pl={1} gap={2} width="30%">
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
              {!filteredRooms || isLoading ? (
                placeholderItems
              ) : (
                <>
                  {filteredRooms.map(
                    ({ id, name, description }, index, arr) => (
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
                    ),
                  )}
                </>
              )}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
};

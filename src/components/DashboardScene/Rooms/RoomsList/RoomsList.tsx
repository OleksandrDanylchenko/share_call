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
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';

import { checkIsElementInView } from '@/hooks/useIsElementInView';
import { fullHeight, lineClamp, textFieldEllipsis } from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

interface Props {
  rooms: RouterOutputs['rooms']['getRooms'];
  activeRoomId?: string;
}

const RoomsList: FC<Props> = (props) => {
  const { rooms, activeRoomId } = props;

  const router = useRouter();

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

  const [animateListParent] = useAutoAnimate();
  return (
    <Stack pl={1} gap={2} minWidth="20%">
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
              {filteredRooms.map(({ id, name, description }, index, arr) => (
                <Fragment key={id}>
                  <ListItemButton
                    ref={activeRoomId === id ? setActiveRoomItem : undefined}
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
            </List>
          )}
        </AutoSizer>
      </Box>
    </Stack>
  );
};

export default RoomsList;

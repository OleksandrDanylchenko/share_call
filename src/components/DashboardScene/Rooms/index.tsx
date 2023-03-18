import React, { FC } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import { DashboardSceneProps } from '@/components/DashboardScene';
import { fullHeight, fullParent } from '@/styles/mixins';
import { api } from '@/utils/api';

const DashboardRooms: FC<DashboardSceneProps> = (props) => {
  const { onSceneChange } = props;

  const {
    data: message1,
    isLoading,
    isFetching,
  } = api.example.hello.useQuery({
    text: '123',
  });

  console.log({ message1, isLoading, isFetching });

  // const { data: message } = api.example.getSecretMessage.useQuery();
  // const { data: rooms, isLoading } = api.rooms.getRooms.useQuery(undefined, {
  //   cacheTime: 5000,
  // });

  // console.log({ rooms });

  return (
    <Stack css={fullParent} px={5} py={7}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content' }}
        startIcon={<ArrowBackIosIcon />}
        // disabled={isLoading}
        onClick={() => onSceneChange('/')}
      >
        Back to dashboard
      </Button>
      <List css={fullHeight} sx={{ width: '30%', maxWidth: 360 }}>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Ali Connors
                </Typography>
                — be in your neighborhood doing errands this…
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </Stack>
  );
};

export default DashboardRooms;

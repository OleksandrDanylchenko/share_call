import { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ClassNames } from '@emotion/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PeopleIcon from '@mui/icons-material/People';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { uploadcareLoader } from '@uploadcare/nextjs-loader';
import Image from 'next/image';
import { useToggle } from 'usehooks-ts';

import { AVATAR_SIZE, UPLOADCARE_CDN_URL } from '@/constants/index';
import {
  blurBackgroundContainer,
  fullHeight,
  lineClamp,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const ParticipantsSidebarInfo: FC<Props> = (props) => {
  const { roomId } = props;

  const [showInfo, toggleShowInfo] = useToggle(false);

  const { data: targetRoom } = api.rooms.getRoom.useQuery(
    { id: roomId },
    { retry: 1 },
  );
  const lastSession = targetRoom?.lastSession;

  const [animateListParent] = useAutoAnimate();
  return (
    <>
      <IconButton
        css={(theme) =>
          shadowBorder(theme, {
            blurRadius: '16px',
            color: theme.palette.warning.main,
          })
        }
        size="medium"
        onClick={toggleShowInfo}
      >
        <PeopleIcon />
      </IconButton>
      <ClassNames>
        {({ css, theme }) => (
          <Drawer
            anchor="right"
            open={showInfo}
            onClose={toggleShowInfo}
            PaperProps={{
              sx: {
                width: 420,
                padding: 4,
              },
              className: css(
                shadowBorder(theme, { color: theme.palette.warning.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            {targetRoom && (
              <Stack css={fullHeight} justifyContent="space-between">
                <Stack flex={1} gap={1}>
                  <Typography
                    css={lineClamp(4)}
                    variant="h3"
                    color="warning.main"
                  >
                    Participants: {lastSession?.participants?.length}
                  </Typography>
                  <Box flex={1}>
                    <AutoSizer disableWidth>
                      {({ height }) => (
                        <List
                          ref={animateListParent}
                          sx={{ height, overflowY: 'auto' }}
                        >
                          {lastSession?.participants.map(
                            ({ user: { id, name, email, image } }) => (
                              <ListItem key={id}>
                                <ListItemAvatar>
                                  <Avatar>
                                    <Image
                                      alt={name!}
                                      src={image!}
                                      width={AVATAR_SIZE}
                                      height={AVATAR_SIZE}
                                      quality={80}
                                      loader={
                                        image!.includes(UPLOADCARE_CDN_URL)
                                          ? uploadcareLoader // Use uploadcore for custom uploaded images
                                          : undefined
                                      }
                                    />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={name}
                                  secondary={email}
                                />
                              </ListItem>
                            ),
                          )}
                        </List>
                      )}
                    </AutoSizer>
                  </Box>
                </Stack>
                <Button
                  color="inherit"
                  sx={{ width: '30%', alignSelf: 'flex-end' }}
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={toggleShowInfo}
                >
                  Close
                </Button>
              </Stack>
            )}
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};

export default ParticipantsSidebarInfo;

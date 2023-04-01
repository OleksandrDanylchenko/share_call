import React, { FC, ReactElement } from 'react';

import { ClassNames } from '@emotion/react';
import { Avatar, AvatarGroup, Stack, Typography } from '@mui/material';
import { uploadcareLoader } from '@uploadcare/nextjs-loader';
import Image from 'next/image';

import BlinkingCircle from '@/components/BlinkingCircle';
import { AVATAR_SIZE, UPLOADCARE_CDN_URL } from '@/constants/index';
import { lightBackgroundContainer } from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

interface Props {
  targetRoom: RouterOutputs['rooms']['getRoom'];
}

const CallStatus: FC<Props> = (props) => {
  const { targetRoom } = props;

  const { lastSession } = targetRoom!;
  const isActiveSession = lastSession?.finishedAt === null;

  const renderInactiveStatus = (): ReactElement => (
    <Stack direction="row" alignItems="center" gap={1}>
      <ClassNames>
        {({ theme }) => (
          <BlinkingCircle
            mainColor={theme.palette.success.main}
            animate={false}
          />
        )}
      </ClassNames>
      <Typography variant="subtitle1">
        The call hasn&apos;t started yet
      </Typography>
    </Stack>
  );

  const renderActiveStatus = (): ReactElement => (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <BlinkingCircle />
        <Typography variant="subtitle1">
          The call is already in progress
        </Typography>
      </Stack>
      <AvatarGroup max={7}>
        {lastSession!.participants.map(({ user: { id, name, image } }) => (
          <Avatar key={id}>
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
        ))}
      </AvatarGroup>
    </>
  );

  return (
    <Stack
      css={(theme) => [
        lightBackgroundContainer(theme, { active: isActiveSession }),
      ]}
      alignItems="center"
      width="80%"
      gap={1}
      p={2}
      borderRadius={6}
      position="absolute"
      bottom={100}
    >
      {isActiveSession ? renderActiveStatus() : renderInactiveStatus()}
    </Stack>
  );
};

export default CallStatus;

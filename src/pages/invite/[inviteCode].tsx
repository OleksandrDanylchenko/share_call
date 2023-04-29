import React, { FC } from 'react';

import { Button, Container, Stack, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession, Session } from 'next-auth';

import SignInForm from '@/components/SignInForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/server/db';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullParent,
  fullViewport,
  fullWidth,
  shadowBorder,
} from '@/styles/mixins';

import { goToDashboard } from '@/routing/index';

interface Props {
  session: Session | null;
  isInviteCodeValid: boolean;
}

const InviteLinkPage: NextPage<Props> = (props) => {
  const { isInviteCodeValid } = props;

  const router = useRouter();
  const inviteCode = router.query.inviteCode as string;
  const callbackUrl = `/invite/${inviteCode}`;

  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullParent} alignItems="center" justifyContent="center">
          <Stack
            css={fullWidth}
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={4}
            height="70%"
          >
            {!isInviteCodeValid && (
              <Stack
                css={blurBackgroundContainer}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                width={400}
                height="70%"
                gap={3}
                px={4}
                py={2}
              >
                <InvalidInviteCode />
              </Stack>
            )}
            {isInviteCodeValid && (
              <>
                <Typography
                  css={fullWidth}
                  color="warning.main"
                  variant="h2"
                  fontWeight={400}
                >
                  The room for the invite code was found
                </Typography>
                <Stack
                  css={[fullHeight, blurBackgroundContainer]}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  width={400}
                  gap={3}
                  px={4}
                  py={2}
                >
                  <SignInForm callbackUrl={callbackUrl} />
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Container>
    </main>
  );
};

const InvalidInviteCode: FC = () => {
  const router = useRouter();
  return (
    <>
      <Typography variant="h1" fontSize="10rem">
        404
      </Typography>
      <Typography variant="subtitle1" marginBottom={5}>
        The invite code you entered doesn&apos;t correspond to any known room.
        <br />
        Ask the room owner to send you a new invite link.
      </Typography>
      <Button
        css={(theme) =>
          shadowBorder(theme, { color: theme.palette.common.white })
        }
        variant="outlined"
        color="inherit"
        fullWidth
        onClick={() => goToDashboard()}
      >
        Go to the home page
      </Button>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const inviteCode = context.query.inviteCode as string;
  const room = await prisma.room.findUnique({ where: { inviteCode } });

  return session && room
    ? { redirect: { destination: `/preview/${room.id}`, permanent: false } }
    : { props: { session, isInviteCodeValid: !!room } };
};

export default InviteLinkPage;

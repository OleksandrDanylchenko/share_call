import React, { FC, useState } from 'react';

import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useCopyToClipboard } from 'usehooks-ts';

import { fullWidth, lightBackgroundContainer } from '@/styles/mixins';
import { RouterOutputs } from '@/utils/api';

const RoomInvite: FC<{
  activeRoom: RouterOutputs['rooms']['getRooms'][number];
}> = (props) => {
  const { activeRoom } = props;

  const [_, copy] = useCopyToClipboard();
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyLink = async (): Promise<void> => {
    setShowCopied(true);

    const invitationLink = `${window.location.origin}/invite/${activeRoom.inviteCode}`;
    await copy(invitationLink);
    setTimeout(() => setShowCopied(false), 2500);
  };

  return (
    <Stack
      css={(theme) => [
        fullWidth,
        lightBackgroundContainer(theme, { active: showCopied }),
      ]}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      py={1.5}
      borderRadius={6}
    >
      <Stack direction="row" alignItems="baseline" gap={2}>
        {showCopied ? (
          <Typography variant="h5">Invitation link has been copied</Typography>
        ) : (
          <>
            <Typography variant="h5">Invitation code:</Typography>
            <Typography variant="monospace">{activeRoom.inviteCode}</Typography>
          </>
        )}
      </Stack>
      <Tooltip title="Copy invitation link">
        <IconButton size="large" disabled={showCopied} onClick={handleCopyLink}>
          {showCopied ? (
            <AddLinkIcon fontSize="large" />
          ) : (
            <LinkIcon fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default RoomInvite;

import React, { FC, useState } from 'react';

import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useCopyToClipboard } from 'usehooks-ts';

import PillContainer from '@/components/PillContainer';

interface Props {
  inviteCode: string;
  sx?: SxProps<Theme>;
}

const RoomInvite: FC<Props> = (props) => {
  const { inviteCode, sx } = props;

  const [_, copy] = useCopyToClipboard();
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyLink = async (): Promise<void> => {
    setShowCopied(true);

    const invitationLink = `${window.location.origin}/invite/${inviteCode}`;
    await copy(invitationLink);
    setTimeout(() => setShowCopied(false), 2500);
  };

  return (
    <PillContainer sx={sx}>
      <Stack direction="row" alignItems="baseline" gap={2}>
        {showCopied ? (
          <Typography variant="h5">Invitation link has been copied</Typography>
        ) : (
          <>
            <Typography variant="h5">Invitation code:</Typography>
            <Typography variant="monospace">{inviteCode}</Typography>
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
    </PillContainer>
  );
};

export default RoomInvite;

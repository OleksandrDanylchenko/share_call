import { forwardRef, PropsWithChildren, ReactElement } from 'react';

import { Backdrop, Box } from '@mui/material';

interface Props extends PropsWithChildren {
  open: boolean;
  content?: ReactElement;
  variant?: 'circular' | 'square';
  className?: string;
}

const Dimmer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    open,
    content,
    variant,
    children,
    className,
    ...rest // Event listeners from the tooltip
  } = props;

  return (
    <Box
      ref={ref}
      position="relative"
      overflow="hidden"
      borderRadius={variant === 'circular' ? '50%' : 'none'}
      className={className}
      {...rest}
    >
      <Backdrop
        open={open}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {content}
      </Backdrop>
      {children}
    </Box>
  );
});

Dimmer.displayName = 'Dimmer';

export default Dimmer;

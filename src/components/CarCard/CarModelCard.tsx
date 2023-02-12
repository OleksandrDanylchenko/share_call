import React, { FC } from 'react';

import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import CarCardTemplate, { Props as CarCardProps } from './CarCardTemplate';

interface Props extends Omit<CarCardProps, 'info' | 'trimName'> {
  description: string;
}

const CarModelCard: FC<Props> = (props) => {
  const { description, ...carCardProps } = props;
  return (
    <CarCardTemplate
      info={
        <Typography
          variant="body2"
          color="textSecondary"
          css={descriptionStyles}
        >
          {description}
        </Typography>
      }
      {...carCardProps}
    />
  );
};

const descriptionStyles = css`
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

export default CarModelCard;

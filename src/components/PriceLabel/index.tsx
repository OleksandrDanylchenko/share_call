import React, { FC } from 'react';

import { css } from '@emotion/react';
import { Typography } from '@mui/material';

import { CarPrice } from '@/types/index';
import { toCurrencyString } from '@/utils/formatting';

interface Props {
  price: CarPrice;
}

const PriceLabel: FC<Props> = (props) => {
  const { price } = props;

  if (typeof price === 'number') {
    return <Typography variant="h4">{toCurrencyString(price)}</Typography>;
  }

  const priceStart = toCurrencyString(price.min);
  const priceEnd = toCurrencyString(price.max);
  return (
    <Typography variant="h4Primary" css={priceLabel}>
      {priceStart} - <br />
      {priceEnd}
    </Typography>
  );
};

const priceLabel = css`
  line-height: 1.2;
  white-space: pre;
`;

export default PriceLabel;

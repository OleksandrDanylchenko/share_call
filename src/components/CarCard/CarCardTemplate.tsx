import React, { FC, ReactElement } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Stack,
  Theme,
} from '@mui/material';
import Image from 'next/image';

import PriceLabel from '@/components/PriceLabel';
import { CarPrice } from '@/types/index';

export interface Props {
  logoSrc: string;
  brandName: string;
  modelName: string;
  trimName?: string;
  actions: ReactElement;
  photoSrc: string;
  info: ReactElement;
  price: CarPrice;
}

const CarCardTemplate: FC<Props> = (props) => {
  const {
    logoSrc,
    brandName,
    modelName,
    trimName,
    actions,
    photoSrc,
    info,
    price,
  } = props;

  // Combine brandName modelName and trimName into one string with default empty
  const carTitle = [brandName, modelName, trimName].filter(Boolean).join(' ');

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar css={avatar}>
            <Image fill src={logoSrc} alt="" />
          </Avatar>
        }
        action={actions}
        title={carTitle}
      />
      <CardMedia css={cardPhoto}>
        <Image fill src={photoSrc} alt={`${carTitle} picture`} />
      </CardMedia>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          height="100%"
        >
          {info}
          <Stack direction="row" alignItems="center" spacing={2} height="100%">
            <Divider orientation="vertical" flexItem />
            <PriceLabel price={price} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const avatar = css`
  width: 35px;
  height: 35px;
`;

const cardPhoto = (theme: Theme): SerializedStyles => css`
  position: relative;
  height: 230px;
  margin: 0 ${theme.spacing(2)};
  border-radius: 5px;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`;

export default CarCardTemplate;

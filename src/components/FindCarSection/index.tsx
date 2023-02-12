import React, { FC, useState } from 'react';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

import landingCarsPicture from '@/assets/landing-cars-picture.png';
import {
  bannerStyles,
  carsPictureStyles,
  findCarSectionStyles,
  offerStyles,
} from '@/components/FindCarSection/styles';
import LandingSearch from '@/components/LandingSearch';

const FindCarSection: FC = () => {
  /**
   * Needed to vertically align the absolutely positioned cars picture
   * with the rest of the component's content
   */
  const [carsPictureTopOffset, setCarsPictureTopOffset] = useState(0);
  const updateCarsPictureTopOffset = (ref: HTMLElement): void =>
    setCarsPictureTopOffset(ref?.offsetTop || 0);

  return (
    <section css={findCarSectionStyles} ref={updateCarsPictureTopOffset}>
      <Box css={offerStyles}>
        <Box css={bannerStyles}>
          <Typography variant="h1">
            Find a car
            <br /> at your price
          </Typography>
          <Typography variant="subtitle1">
            We are the best service to look for cars with the best offers.
            <br /> Here you can buy or sell the car.
          </Typography>
        </Box>
        <LandingSearch />
      </Box>
      <Image
        css={() => carsPictureStyles({ topOffset: carsPictureTopOffset })}
        src={landingCarsPicture}
        height={700}
        alt="" // Empty alt is used for the eye-candy images
      />
    </section>
  );
};

export default FindCarSection;

import React, { FC } from 'react';

import { css } from '@emotion/react';
import { Stack, Typography } from '@mui/material';
import { SwiperSlide } from 'swiper/react';

import CarAdvertCard from '@/components/CarCard/CarAdvertCard';
import FadedSwiper from '@/components/FadedSwiper';

const cars = [
  {
    id: 1,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    brandName: 'BMW',
    modelName: '228i',
    trimName: 'M Sport',
    actions: <></>,
    photoSrc:
      'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/054246574c23c0751ee2b36dca47cfa8.jpg',
    price: 34000,
    transmission: 'Manual',
    fuelType: 'Petrol',
    year: 2016,
    kilometrage: 10000,
  },
];

const MostSearchedCarsSection: FC = () => {
  return (
    <Stack component="section" spacing={2}>
      <Typography variant="h4">Most searched cars</Typography>
      <FadedSwiper
        css={carsSwiper}
        fadeSide="end"
        freeMode={false}
        loop={false}
      >
        {cars.map((car) => (
          <SwiperSlide key={car.id}>
            <Stack spacing={2}>
              <CarAdvertCard {...car} />
            </Stack>
          </SwiperSlide>
        ))}
      </FadedSwiper>
    </Stack>
  );
};

const carsSwiper = css`
  .swiper-slide {
    padding-bottom: 1px; // Shows cards bottom shadow
  }
`;

export default MostSearchedCarsSection;

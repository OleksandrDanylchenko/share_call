import React, { FC } from 'react';

import { css } from '@emotion/react';
import { Stack, Typography } from '@mui/material';
import { SwiperSlide } from 'swiper/react';

import { CarModelCard } from '@/components/CarCard';
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
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet',
    // price: 34000,
    price: { min: 34000, max: 52450 },
  },
  {
    id: 2,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    brandName: 'BMW',
    modelName: '228i',
    trimName: 'M Sport',
    actions: <></>,
    photoSrc:
      'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/054246574c23c0751ee2b36dca47cfa8.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet',
    // price: 34000,
    price: { min: 22122, max: 50242 },
  },
  {
    id: 3,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    brandName: 'BMW',
    modelName: '228i',
    trimName: 'M Sport',
    actions: <></>,
    photoSrc:
      'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/054246574c23c0751ee2b36dca47cfa8.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet',
    // price: 34000,
    price: { min: 22122, max: 50242 },
  },
  {
    id: 4,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    brandName: 'BMW',
    modelName: '228i',
    trimName: 'M Sport',
    actions: <></>,
    photoSrc:
      'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/054246574c23c0751ee2b36dca47cfa8.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet',
    // price: 34000,
    price: { min: 22122, max: 50242 },
  },
  {
    id: 5,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    brandName: 'BMW',
    modelName: '228i',
    trimName: 'M Sport',
    actions: <></>,
    photoSrc:
      'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/054246574c23c0751ee2b36dca47cfa8.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet',
    // price: 34000,
    price: { min: 22122, max: 50242 },
  },
  {
    id: 6,
    logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    brandName: 'BMW',
    modelName: '228i',
    trimName: 'M Sport',
    actions: <></>,
    photoSrc:
      'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/054246574c23c0751ee2b36dca47cfa8.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui mi aliquet\n' +
      'enim ultrices ornare maecenas non enim amet',
    // price: 34000,
    price: { min: 22122, max: 50242 },
  },
];

const NewCarsSection: FC = () => {
  return (
    <Stack component="section" spacing={2}>
      <Typography variant="h4">New cars</Typography>
      <FadedSwiper css={carsSwiper} fadeSide="end" freeMode={false}>
        {cars.map((car) => (
          <SwiperSlide key={car.id}>
            <CarModelCard {...car} />
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

export default NewCarsSection;

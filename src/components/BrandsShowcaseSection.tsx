import React, { FC } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { Theme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import audiLogo from '@/assets/brands/audi.svg';
import bmwLogo from '@/assets/brands/bmw.svg';
import cheryLogo from '@/assets/brands/chery.svg';
import kiaLogo from '@/assets/brands/kia.svg';
import mazdaLogo from '@/assets/brands/mazda.svg';
import porscheLogo from '@/assets/brands/porsche.svg';
import subaruLogo from '@/assets/brands/subaru.svg';
import volkswagenLogo from '@/assets/brands/volkswagen.svg';
import FadedSwiper from '@/components/FadedSwiper';

const brands = [
  {
    name: 'Audi',
    logoSrc: audiLogo,
  },
  {
    name: 'BMW',
    logoSrc: bmwLogo,
  },
  {
    name: 'Chery',
    logoSrc: cheryLogo,
  },
  {
    name: 'Kia',
    logoSrc: kiaLogo,
  },
  {
    name: 'Mazda',
    logoSrc: mazdaLogo,
  },
  {
    name: 'Porsche',
    logoSrc: porscheLogo,
  },
  {
    name: 'Subaru',
    logoSrc: subaruLogo,
  },
  {
    name: 'Volkswagen',
    logoSrc: volkswagenLogo,
  },
];

const BrandsShowcaseSection: FC = () => {
  const isLgScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('lg'),
  );

  return (
    <FadedSwiper css={showcaseSwiper} slidesPerView={isLgScreen ? 6 : 'auto'}>
      {brands.map(({ name, logoSrc }) => (
        <SwiperSlide key={name}>
          <Link href={`/search?brand=${name}`} css={brandLink}>
            <Image src={logoSrc} alt={name} />
          </Link>
        </SwiperSlide>
      ))}
    </FadedSwiper>
  );
};

const showcaseSwiper = (theme: Theme): SerializedStyles => css`
  height: 220px;
  background-color: ${theme.palette.common.white};
  border-radius: 10px;

  .swiper-slide {
    width: 200px;
  }
`;

const brandLink = css`
  transition: transform 0.5s;
  :hover {
    transform: scale(1.2);
  }
`;

export default BrandsShowcaseSection;

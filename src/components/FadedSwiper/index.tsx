import { FC } from 'react';

import { Mousewheel, Navigation, FreeMode } from 'swiper';
import { Swiper, SwiperProps } from 'swiper/react';

import { showcaseSwiper } from './styles';

export interface Props extends SwiperProps {
  fadeSide?: 'start' | 'end' | 'both';
}

const FadedSwiper: FC<Props> = (props) => {
  const { fadeSide = 'both', ...swiperProps } = props;

  return (
    <Swiper
      css={(theme) => showcaseSwiper(theme, { fadeSide })}
      slidesPerView="auto"
      centeredSlides={fadeSide === 'both'}
      dir={fadeSide === 'start' ? 'rtl' : 'ltr'}
      spaceBetween={30}
      loop
      mousewheel={{ forceToAxis: true }}
      navigation
      freeMode
      modules={[Mousewheel, Navigation, FreeMode]}
      {...swiperProps}
    />
  );
};

export default FadedSwiper;

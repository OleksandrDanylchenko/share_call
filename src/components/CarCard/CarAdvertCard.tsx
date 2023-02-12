import React, { FC, useMemo } from 'react';

import { css } from '@emotion/react';
import EventIcon from '@mui/icons-material/Event';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RouteIcon from '@mui/icons-material/Route';
import { Chip } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Image from 'next/image';

import TransmissionIcon from '@/assets/transmission.svg';

import CarCardTemplate, { Props as CarCardProps } from './CarCardTemplate';

interface Props extends Omit<CarCardProps, 'info'> {
  transmission: string;
  year: number;
  kilometrage: number;
  fuelType: string;
}

const CarAdvertCard: FC<Props> = (props) => {
  const { transmission, year, kilometrage, fuelType, ...carCardProps } = props;

  const characteristicsPills = useMemo(() => {
    return (
      <Grid container spacing={1} css={characteristics}>
        <Grid xs={7}>
          <Chip
            size="small"
            color="primary"
            icon={<RouteIcon />}
            label={`${kilometrage.toLocaleString()} km`}
          />
        </Grid>
        <Grid xs={5}>
          <Chip
            size="small"
            color="primary"
            icon={<EventIcon />}
            label={year}
          />
        </Grid>
        <Grid xs={7}>
          <Chip
            size="small"
            color="primary"
            icon={<Image width={24} src={TransmissionIcon} alt="" />}
            label={transmission}
          />
        </Grid>
        <Grid xs={5}>
          <Chip
            size="small"
            color="primary"
            icon={<LocalGasStationIcon />}
            label={fuelType}
          />
        </Grid>
      </Grid>
    );
  }, [year, fuelType, kilometrage, transmission]);

  return <CarCardTemplate info={characteristicsPills} {...carCardProps} />;
};

const characteristics = css`
  .MuiChip-filled {
    width: 100%;
  }
`;

export default CarAdvertCard;

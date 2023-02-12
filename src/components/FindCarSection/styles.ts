import { css, SerializedStyles } from '@emotion/react';

export const findCarSectionStyles = css`
  display: flex;
  overflow: hidden;

  @media (max-width: 1000px) {
    justify-content: center;
  }
`;

export const offerStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
  width: 600px;
  height: 600px;
`;

export const bannerStyles = css`
  h1 {
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h6 {
    line-height: 1.5;
  }
`;

export const carsPictureStyles = (options: {
  topOffset: number;
}): SerializedStyles => {
  const { topOffset } = options;

  return css`
    position: absolute;
    top: ${topOffset};
    right: 0;
    transform: translateX(35%);

    @media (max-width: 1700px) {
      transform: translateX(50%);
    }

    @media (max-width: 1400px) {
      transform: translateX(65%);
    }

    @media (max-width: 1200px) {
      transform: translateX(70%);
    }

    @media (max-width: 1100px) {
      transform: translateX(80%);
    }

    @media (max-width: 1000px) {
      display: none;
    }
  `;
};

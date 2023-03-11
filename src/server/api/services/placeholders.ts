import { User } from 'next-auth';
import generateRandomAnimalName from 'random-animal-name-generator';

import { prisma } from '@/server/db';

export const BORINGAVATARS_SERVICE_URL = 'https://source.boringavatars.com';
export const BORINGAVATARS_SIZE = 212;
export const BORINGAVATARS_COLORS = ['775a2d', '252017', '162631', '225072'];

const getAvatarUrl = (value: string): string =>
  `${BORINGAVATARS_SERVICE_URL}//beam/${BORINGAVATARS_SIZE}/${value}?colors=${BORINGAVATARS_COLORS}`;

/**
 * Sets random name and image on the user.
 * Relevant if signed in via magic link for the first time
 */
export const populateUserWithPlaceholders = async (
  user: User,
): Promise<User> => {
  const newName = generateRandomAnimalName();
  const newImage = getAvatarUrl(newName);

  const userWithName = await prisma.user.update({
    where: { id: user.id },
    data: { name: newName, image: newImage },
  });

  return {
    ...user,
    name: userWithName.name,
    image: userWithName.image,
  };
};

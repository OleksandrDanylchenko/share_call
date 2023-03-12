import { User } from 'next-auth';
import generateRandomAnimalName from 'random-animal-name-generator';

import {
  BORINGAVATARS_COLORS,
  BORINGAVATARS_SERVICE_URL,
  AVATAR_SIZE,
} from '@/constants/index';
import { prisma } from '@/server/db';

const getAvatarUrl = (value: string): string => {
  const continuousValue = value.replace(/ /g, '_');
  return `${BORINGAVATARS_SERVICE_URL}/beam/${AVATAR_SIZE}/${continuousValue}?colors=${BORINGAVATARS_COLORS}`;
};

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

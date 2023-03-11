import { User } from 'next-auth';
import generateRandomAnimalName from 'random-animal-name-generator';

import { prisma } from '@/server/db';

const getAvatarUrl = (value: string): string =>
  `https://source.boringavatars.com//beam/128/${value}?colors=775a2d,252017,162631,225072`;

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

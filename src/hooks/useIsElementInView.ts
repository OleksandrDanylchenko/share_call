import { useEffect, useState } from 'react';

export const checkIsElementInView = <T extends HTMLElement>(
  targetElement?: T,
): boolean => {
  if (!targetElement) return false;

  const parentElement = targetElement.parentNode as HTMLElement;
  const targetRect = targetElement.getBoundingClientRect();
  const parentRect = parentElement.getBoundingClientRect();
  const relativeRect = {
    top: targetRect.top - parentRect.top,
    bottom: targetRect.bottom - parentRect.top,
    left: targetRect.left - parentRect.left,
    right: targetRect.right - parentRect.left,
  };
  const parentStyle = getComputedStyle(parentElement);
  const parentOverflow = parentStyle.overflow;
  return parentOverflow === 'visible'
    ? true
    : relativeRect.top >= 0 &&
        relativeRect.bottom <= parentRect.height &&
        relativeRect.left >= 0 &&
        relativeRect.right <= parentRect.width;
};

const useIsElementInView = <T extends HTMLElement>(
  targetElement: T | undefined,
): boolean => {
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void =>
      setIsInView(checkIsElementInView(targetElement));

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetElement]);

  return isInView;
};

export default useIsElementInView;

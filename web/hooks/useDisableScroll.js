import { useEffect } from 'react';

export const useDisableBodyScroll = (open) => {
  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);
};
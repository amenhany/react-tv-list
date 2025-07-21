import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useFavicon = (iconPath = '/imgs/tv.png') => {
  const location = useLocation();

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = iconPath;
    document.head.appendChild(link);
  }, [location.pathname]);
};

export default useFavicon;
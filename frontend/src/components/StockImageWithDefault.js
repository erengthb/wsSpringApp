import React, { useEffect } from 'react';
import defaultStock from '../assets/defaultstock.jpg';

const StockImageWithDefault = (props) => {
  const { image, tempImage, alt = 'Stock', onImageLoadStatus, ...rest } = props;

  // Varsayılan resim
  let imageSource = defaultStock;

  // Eğer image prop'u varsa backend yolunu kullan
  if (image) {
    imageSource = process.env.REACT_APP_API_URL + '/' + image;
  }

  // Resim başarıyla yüklendiğinde
  const handleLoad = () => {
    if (onImageLoadStatus) {
      onImageLoadStatus(true); // Yükleme başarılı
    }
  };

  // Resim yüklenemezse (404 vb.)
  const handleError = (event) => {
    console.error('Stock image load failed or 404:', event.target.src);
    event.target.src = defaultStock; // Default göster
    if (onImageLoadStatus) {
      onImageLoadStatus(false); // Yükleme başarısız
    }
  };

  // image prop'u yoksa veya değiştiyse, başlangıç durumunu false yap
  useEffect(() => {
    if (!image && onImageLoadStatus) {
      onImageLoadStatus(false);
    }
  }, [image, onImageLoadStatus]);

  return (
    <img
      alt={alt}
      src={tempImage || imageSource}
      {...rest}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default StockImageWithDefault;

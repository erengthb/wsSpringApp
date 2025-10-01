import React, { useEffect } from 'react';
import defaultStock from '../assets/defaultstock.jpg';

const StockImageWithDefault = (props) => {
  // Yeni prop: onImageLoadStatus. Kalanlar ...rest ile alınır.
  const { image, tempImage, alt = 'Stock', onImageLoadStatus, ...rest } = props;

  let imageSource = defaultStock;
  
  // Eğer image prop'u varsa back-end yolunu dene.
  if (image) {
    imageSource = process.env.REACT_APP_API_URL + '/' + image;
  }
  
  // Resim başarıyla yüklendiğinde çalışacak fonksiyon
  const handleLoad = () => {
    // Resim yüklendi. Yükleme durumunu StockList'e bildir: BAŞARILI (true)
    if (onImageLoadStatus) {
        onImageLoadStatus(true); 
    }
  };

  // Resim asıl yoldan yüklenemediğinde (404 veya başka bir hata) çalışacak fonksiyon
  const handleError = (event) => {
    console.error('Stock image load failed or 404:', event.target.src);
    
    // defaultstock.jpg'yi göster
    event.target.src = defaultStock; 

    // Yükleme durumunu StockList'e bildir: YÜKLENEMEDİ (false)
    if (onImageLoadStatus) {
        onImageLoadStatus(false); 
    }
  };
  
  // image prop'u değiştiğinde veya bileşen yüklendiğinde, onImageLoadStatus'u default olarak false/yüklendi değil diye ayarlayalım.
  // Bu, async yükleme tamamlanana kadar preview'i engelleyecektir.
  useEffect(() => {
    if (onImageLoadStatus) {
        // image prop'u varsa, yükleme bekleniyor (henüz true/false değil)
        // Yükleme tamamlanmadan önce canPreview'in false kalmasını sağlar
        onImageLoadStatus(false);
        
        // Eğer image prop'u hiç yoksa (yani her zaman default gösterilecekse) 
        // ve bu resme preview açılmaması gerekiyorsa, durumu false olarak ayarla.
        if (!image) {
            onImageLoadStatus(false);
        }
    }
  }, [image, onImageLoadStatus]);


  return (
    <img
      alt={alt}
      src={tempImage ? tempImage : imageSource}
      {...rest}
      // Resim başarıyla yüklenirse handleLoad'ı çağır
      onLoad={handleLoad} 
      // Resim yüklenemezse handleError'ı çağır
      onError={handleError}
    />
  );
};

export default StockImageWithDefault;
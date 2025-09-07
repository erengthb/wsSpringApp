import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addStock } from '../api/apiCalls';
import { useSelector } from 'react-redux';
import { isValidImageFile } from '../utils/fileValidators';

const StockForm = ({ onStockAdded }) => {
  const { t } = useTranslation();
  const username = useSelector((state) => state.username);

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [errors, setErrors] = useState({});

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setErrors((prev) => ({
        ...prev,
        image: t('Only PNG , JPG, JPEG or WEBP images are allowed.'),
      }));
      setImage(null);
      setImageName('');
      setImageUploaded(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImageUploaded(true);
      setImageName(file.name);
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!productName.trim()) validationErrors.productName = t('Product name is required');
    if (!description.trim()) validationErrors.description = t('Description is required');
    if (!quantity || isNaN(quantity) || Number(quantity) < 0)
      validationErrors.quantity = t('Quantity must be a non-negative number');
    if (!image) validationErrors.image = t('Product image is required');

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const base64Image = image.split(',')[1];
      await addStock({
        productName,
        description,
        quantity: Number(quantity),
        image: base64Image,
      });
      setProductName('');
      setDescription('');
      setQuantity('');
      setImage(null);
      setImageName('');
      setImageUploaded(false);
      setErrors({});
      onStockAdded();
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Ürün Adı ve Adet */}
      <div className="form-row d-flex align-items-end gap-4 mb-3">
        <div className="form-group flex-fill">
          <label>{t('Product Name')}</label>
          <input
            className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
        </div>

        <div className="form-group" style={{ maxWidth: '120px' }}>
          <label>{t('Quantity')}</label>
          <input
            type="number"
            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
        </div>
      </div>

      {/* Açıklama ve Resim Yükleme */}
      <div className="form-row d-flex gap-4 mb-3">
        <div className="form-group flex-fill">
          <label>{t('Description')}</label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="form-group" style={{ minWidth: '250px' }}>
          <label>
            {t('Product Image')}
            {imageUploaded && (
              <span className="text-success ms-2">
                ✓ {t('Image uploaded successfully')}
              </span>
            )}
          </label>
          <input
            type="file"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            onChange={onChangeFile}
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
          {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}

          {/* Resim adı */}
          {imageName && (
            <div className="mt-1 text-muted" style={{ fontSize: '0.85rem' }}>
              {t('Selected file')}: {imageName}
            </div>
          )}

          {/* Küçük önizleme */}
          {image && (
            <div className="mt-2">
              <img
                src={image}
                alt="Preview"
                style={{ maxHeight: '80px', borderRadius: '4px' }}
              />
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        {t('Add Stock')}
      </button>
    </form>
  );
};

export default StockForm;

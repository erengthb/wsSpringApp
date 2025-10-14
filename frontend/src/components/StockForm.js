import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { addStock } from "../api/apiCalls";
import { useSelector } from "react-redux";
import { isValidImageFile } from "../utils/fileValidators";
import "../css/StockList.css"; // .mi ikon boşluk yardımcıları

const StockForm = ({ onStockAdded }) => {
  const { t } = useTranslation();
  const username = useSelector((state) => state.username);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setErrors((prev) => ({
        ...prev,
        image: t("Sadece PNG, JPG, JPEG veya WEBP kabul edilir."),
      }));
      setImage(null);
      setImageName("");
      setImageUploaded(false);
      setImagePreview(null);
      return;
    }

    setImage(file);
    setImageName(file.name);
    setImageUploaded(true);
    setErrors((prev) => ({ ...prev, image: undefined }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setImageName("");
    setImageUploaded(false);
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: undefined }));
    // input value sıfırlansın (aynı dosyayı tekrar seçebilin)
    const el = document.getElementById("product-image-input");
    if (el) el.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!productName.trim())
      validationErrors.productName = t("Ürün adı girilmesi zorunludur");
    if (!description.trim())
      validationErrors.description = t("Ürün açıklaması girilmesi zorunludur");
    if (!quantity || isNaN(quantity) || Number(quantity) < 0)
      validationErrors.quantity = t(
        "Geçerli olan ürün adedinin girilmesi zorunludur."
      );
    if (!image) validationErrors.image = t("Ürün resmi seçilmesi zorunludur.");

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("quantity", Number(quantity));
      formData.append("image", image);

      await addStock(formData);
      setProductName("");
      setDescription("");
      setQuantity("");
      clearImage();
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
          <label className="fw-semibold d-flex align-items-center">
            <span className="material-icons mi">inventory_2</span>
            {t("Product Name")}
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <span className="material-icons mi-none">sell</span>
            </span>
            <input
              className={`form-control ${
                errors.productName ? "is-invalid" : ""
              }`}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
             
            />
          </div>
          {errors.productName && (
            <div className="invalid-feedback d-block">
              {errors.productName}
            </div>
          )}
        </div>

        <div className="form-group" style={{ maxWidth: "160px" }}>
          <label className="fw-semibold d-flex align-items-center">
            <span className="material-icons mi">countertops</span>
            {t("Quantity")}
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <span className="material-icons mi-none">exposure</span>
            </span>
            <input
              type="number"
              className={`form-control ${
                errors.quantity ? "is-invalid" : ""
              }`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={0}
            />
          </div>
          {errors.quantity && (
            <div className="invalid-feedback d-block">
              {errors.quantity}
            </div>
          )}
        </div>
      </div>

      {/* Açıklama ve Resim Yükleme */}
      <div className="form-row d-flex gap-4 mb-3">
        <div className="form-group flex-fill">
          <label className="fw-semibold d-flex align-items-center">
            <span className="material-icons mi">description</span>
            {t("Description")}
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <span className="material-icons mi-none">edit_note</span>
            </span>
            <textarea
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t("Kısa açıklama ekleyin")}
            />
          </div>
          {errors.description && (
            <div className="invalid-feedback d-block">
              {errors.description}
            </div>
          )}
        </div>

        <div className="form-group" style={{ minWidth: "280px" }}>
          <label className="fw-semibold d-flex align-items-center">
            <span className="material-icons mi">image</span>
            {t("Product Image")}
            {imageUploaded && (
              <span className="badge bg-success ms-2 d-flex align-items-center">
                <span className="material-icons mi mi-sm">check_circle</span>
                {t("Image uploaded successfully")}
              </span>
            )}
          </label>

          {/* Özel dosya seçim alanı (Choose File yerine Türkçe buton) */}
          <div className="d-flex align-items-center gap-2">
            {/* görünmez native input */}
            <input
              id="product-image-input"
              type="file"
              className="d-none"
              onChange={onChangeFile}
              accept="image/png, image/jpeg, image/jpg, image/webp"
            />

            {/* görünen Türkçe buton */}
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={() =>
                document.getElementById("product-image-input")?.click()
              }
            >
              <span className="material-icons mi-none">cloud_upload</span>
              <span className="ms-2">{t("Dosya Seç")}</span>
            </button>

            {/* seçilen dosya adı */}
            <span className="text-muted small">
              {imageName || t("Dosya seçilmedi")}
            </span>
          </div>

          {errors.image && (
            <div className="invalid-feedback d-block">{errors.image}</div>
          )}

          {imageName && (
            <div className="mt-2 d-flex align-items-center justify-content-between rounded border p-2">
              <div className="text-muted small d-flex align-items-center">
                <span className="material-icons mi mi-sm">insert_photo</span>
                <strong>{t("Seçilen dosya")}:</strong>&nbsp;{imageName}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                onClick={clearImage}
                title={t("Resmi temizle")}
              >
                <span className="material-icons mi mi-sm">close</span>
                {t("Temizle")}
              </button>
            </div>
          )}

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded shadow-sm"
                style={{ maxHeight: "90px" }}
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary d-inline-flex align-items-center"
      >
        <span className="material-icons mi">add_circle</span>
        {t("Add Stock")}
      </button>
    </form>
  );
};

export default StockForm;

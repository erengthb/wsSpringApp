import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getUserStocks,
  searchUserStocks,
  updateStockQuantity,
  deleteStock,
} from "../api/apiCalls";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";
import SearchBar from "../utils/SearchBar";
import "../css/StockList.css";
import StockImageWithDefault from "../components/StockImageWithDefault";

const StockList = () => {
  const { t } = useTranslation();
  const username = useSelector((state) => state.username);

  const [stocks, setStocks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef(null);

  const [previewImage, setPreviewImage] = useState(null); // Popup için seçilen resim
  const [imageLoadStatus, setImageLoadStatus] = useState({}); // resim load durumları

  const pageSize = 10;
  const backendUrl = process.env.REACT_APP_API_URL;

  const loadStocks = async () => {
    setLoading(true);
    setImageLoadStatus({}); // yeni yüklemede hataları sıfırla
    try {
      let response;
      if (!searchTerm) {
        response = await getUserStocks(username, page, pageSize);
      } else {
        response = await searchUserStocks(username, searchTerm, page, pageSize);
      }
      setStocks(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error("Stock load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoadStatus = (stockId, isLoaded) => {
    setImageLoadStatus((prev) => ({ ...prev, [stockId]: isLoaded }));
  };

  const onSearchChange = (value) => {
    setPage(0);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 400);
  };

  const onChangeQuantity = async (stockId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 0) return;

    try {
      await updateStockQuantity(stockId, newQuantity);
      setStocks((prev) =>
        prev.map((s) => (s.id === stockId ? { ...s, quantity: newQuantity } : s)),
      );
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  const onDeleteStock = async (stockId) => {
    if (!window.confirm(t("Are you sure you want to delete this stock ?"))) return;

    try {
      await deleteStock(stockId);
      setStocks((prev) => prev.filter((s) => s.id !== stockId));
    } catch (err) {
      alert(t("Stock could not be deleted"));
    }
  };

  useEffect(() => {
    if (username) loadStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, page, searchTerm]);

  if (loading) return <Spinner />;

  return (
    <>
      {/* Başlık ve arama ipucu */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0 d-flex align-items-center">
          <span className="material-icons mi">inventory</span>
          {t("Stock List")}
        </h3>
      </div>

      <div className="mb-3">
        <SearchBar
          onSearch={onSearchChange}
          placeholder={t("Search for a product")}
          initialValue={searchTerm}
        />
      </div>

      {stocks.length === 0 && (
        <p className="text-muted d-flex align-items-center">
          <span className="material-icons mi">inbox</span>
          {t("No stocks found.")}
        </p>
      )}

      {stocks.length > 0 && (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold">
                  <span className="material-icons mi mi-sm">sell</span>
                  {t("Product Name")}
                </th>
                <th className="fw-semibold">
                  <span className="material-icons mi mi-sm">description</span>
                  {t("Description")}
                </th>
                <th className="fw-semibold">
                  <span className="material-icons mi mi-sm">format_list_numbered</span>
                  {t("Quantity")}
                </th>
                <th className="fw-semibold">
                  <span className="material-icons mi mi-sm">image</span>
                  {t("Image")}
                </th>
                <th className="fw-semibold">
                  <span className="material-icons mi mi-sm">build</span>
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const hasImagePath = stock.imagePath && stock.imagePath.trim() !== "";
                const isImageSuccessfullyLoaded = imageLoadStatus[stock.id] !== false;
                const canPreview = hasImagePath && isImageSuccessfullyLoaded;

                return (
                  <tr key={stock.id}>
                    <td>{stock.productName}</td>
                    <td>{stock.description}</td>
                    <td>{stock.quantity}</td>

                    {/* Görsel hücresi (overlay + büyüteç) */}
                    <td>
                      <div
                        className={`stock-thumb-wrapper ${canPreview ? "can-preview" : ""}`}
                        title={canPreview ? t("Click to preview") : ""}
                        onClick={() => {
                          if (canPreview) {
                            setPreviewImage(`${backendUrl}/${stock.imagePath}`);
                          }
                        }}
                      >
                        <StockImageWithDefault
                          image={stock.imagePath}
                          alt={stock.productName}
                          onImageLoadStatus={(isLoaded) =>
                            handleImageLoadStatus(stock.id, isLoaded)
                          }
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            cursor: canPreview ? "pointer" : "default",
                          }}
                        />
                        {canPreview && (
                          <div className="stock-thumb-overlay">
                            <span className="material-icons mi-none">zoom_in</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* İşlemler hücresi — BU BLOĞA DOKUNMADIM */}
                    <td>
                      <div className="btn-group stock-actions-group" role="group">
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => onChangeQuantity(stock.id, stock.quantity, 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => onChangeQuantity(stock.id, stock.quantity, -1)}
                          disabled={stock.quantity === 0}
                        >
                          -
                        </button>
                      </div>

                      <div className="d-block mt-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger stock-delete-button"
                          onClick={() => onDeleteStock(stock.id)}
                        >
                          {t("Hepsini Sil")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Sayfalama */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 0}
            >
              <span className="material-icons mi">chevron_left</span>
              {t("Previous")}
            </button>
            <span className="text-muted d-flex align-items-center">
              <span className="material-icons mi mi-sm">layers</span>
              {t("Stock Page")} {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages - 1}
            >
              {t("Next")}
              <span className="material-icons mi">chevron_right</span>
            </button>
          </div>
        </>
      )}

      {/* Preview Popup */}
      {previewImage && (
        <div className="stock-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="stock-preview-container" onClick={(e) => e.stopPropagation()}>
            <button className="stock-preview-close" onClick={() => setPreviewImage(null)}>
              <span className="material-icons">close</span>
            </button>
            <img src={previewImage} alt="Preview" className="stock-preview-image" />
          </div>
        </div>
      )}
    </>
  );
};

export default StockList;

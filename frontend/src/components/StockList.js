import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  getUserStocks,
  searchUserStocks,
  updateStockQuantity,
  deleteStock,
} from '../api/apiCalls';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';
import SearchBar from '../utils/SearchBar';
import '../css/StockList.css'; // CSS dosyasını eklediğimiz yer

const StockList = () => {
  const { t } = useTranslation();
  const username = useSelector((state) => state.username);

  const [stocks, setStocks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeout = useRef(null);

  const [previewImage, setPreviewImage] = useState(null); // Popup için seçilen resim

  const pageSize = 10;
  const backendUrl = process.env.REACT_APP_API_URL;

  const loadStocks = async () => {
    setLoading(true);
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
      console.error('Stock load failed:', err);
    } finally {
      setLoading(false);
    }
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
        prev.map((s) => (s.id === stockId ? { ...s, quantity: newQuantity } : s))
      );
    } catch (err) {
      console.error('Update quantity failed:', err);
    }
  };

  const onDeleteStock = async (stockId) => {
    if (!window.confirm(t('Are you sure you want to delete this stock ?'))) return;

    try {
      await deleteStock(stockId);
      setStocks((prev) => prev.filter((s) => s.id !== stockId));
    } catch (err) {
      console.error('Delete stock failed:', err);
      alert(t('Stock could not be deleted'));
    }
  };

  useEffect(() => {
    if (username) loadStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, page, searchTerm]);

  if (loading) return <Spinner />;

  return (
    <>
      <h3>{t('Stock List')}</h3>

      <div className="mb-3">
        <SearchBar
          onSearch={onSearchChange}
          placeholder={t('Search for a product')}
          initialValue={searchTerm}
        />
      </div>

      {stocks.length === 0 && <p>{t('No stocks found.')}</p>}

      {stocks.length > 0 && (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>{t('Product Name')}</th>
                <th>{t('Description')}</th>
                <th>{t('Quantity')}</th>
                <th>{t('Image')}</th>
                <th>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id}>
                  <td>{stock.productName}</td>
                  <td>{stock.description}</td>
                  <td>{stock.quantity}</td>
                  <td>
                    {stock.imagePath && (
                      <img
                        src={`${backendUrl}/${stock.imagePath}`}
                        alt="Stock"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPreviewImage(`${backendUrl}/${stock.imagePath}`)}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-success mr-1"
                      onClick={() => onChangeQuantity(stock.id, stock.quantity, 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger mr-1"
                      onClick={() => onChangeQuantity(stock.id, stock.quantity, -1)}
                      disabled={stock.quantity === 0}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteStock(stock.id)}
                    >
                      {t('Delete All')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 0}
            >
              {t('Previous')}
            </button>
            <span>
              {t('Stock Page')} {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages - 1}
            >
              {t('Next')}
            </button>
          </div>
        </>
      )}

      {/* Preview Popup */}
      {previewImage && (
        <div className="stock-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div
            className="stock-preview-container"
            onClick={(e) => e.stopPropagation()} // sadece overlay tıklayınca kapanacak
          >
            <button
              className="stock-preview-close"
              onClick={() => setPreviewImage(null)}
            >
              &times;
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="stock-preview-image"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockList;

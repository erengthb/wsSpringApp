import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getUserStocks,
    searchUserStocks,
    updateStockQuantity,
    deleteStock,
} from "../api/apiCalls";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";
// Ant Design Bileşenleri
import { Table, Button, Space, Input, Modal, message } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined, ZoomInOutlined, InboxOutlined } from "@ant-design/icons";
import "../css/StockList.css"; // CSS'i import etmeyi unutmayın
import StockImageWithDefault from "../components/StockImageWithDefault";

const { Search } = Input;

const StockList = () => {
    const { t } = useTranslation();
    const username = useSelector((state) => state.username);

    // ... (Diğer state ve fonksiyonlar aynı kalır)

    const [stocks, setStocks] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1, 
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageLoadStatus, setImageLoadStatus] = useState({});

    const backendUrl = process.env.REACT_APP_API_URL;

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };

    const loadStocks = async (current = 1, pageSize = 10, search = searchTerm) => {
        setLoading(true);
        setImageLoadStatus({});
        try {
            let response;
            const pageToSend = current - 1; 

            if (!search) {
                response = await getUserStocks(username, pageToSend, pageSize);
            } else {
                response = await searchUserStocks(username, search, pageToSend, pageSize);
            }

            setStocks(response.data.content.map(stock => ({ ...stock, key: stock.id })) || []);
            
            setPagination((prev) => ({
                ...prev,
                total: response.data.totalElements || 0,
                current: current,
                pageSize: pageSize,
            }));

        } catch (err) {
            console.error("Stock load failed:", err);
            message.error(t("Stok yükleme başarısız !"));
        } finally {
            setLoading(false);
        }
    };

    const handleImageLoadStatus = (stockId, isLoaded) => {
        setImageLoadStatus((prev) => ({ ...prev, [stockId]: isLoaded }));
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
            console.error("Update quantity failed:", err);
            message.error(t("Stok adedi güncellenemedi !"));
        }
    };

    const onDeleteStock = async (stockId) => {
        Modal.confirm({
            title: t("Uyarı !"),
            content: t("Seçilen stok ürününün tamamını silmek istediğinize emin misiniz ?"),
            okText: t("Evet"),
            cancelText: t("Hayır"),
            onOk: async () => {
                try {
                    await deleteStock(stockId);
                    message.success(t("Stok başarıyla silindi !"));
                    loadStocks(pagination.current, pagination.pageSize, searchTerm); 
                } catch (err) {
                    message.error(t("Stok silme başarısız !"));
                }
            },
        });
    };
    
    // Ant Design'ın Columns tanımı
    const columns = [
        {
            title: t("Product Name"),
            dataIndex: 'productName',
            key: 'productName',
            sorter: (a, b) => a.productName.localeCompare(b.productName),
            width: '20%',
        },
        {
            title: t("Description"),
            dataIndex: 'description',
            key: 'description',
            width: '20%', 
        },
        {
            title: t("Quantity"),
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            sorter: (a, b) => a.quantity - b.quantity,
            width: '10%',
        },
        {
            title: t("Fiyat (₺)"),
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (text) => (text != null ? `${Number(text).toFixed(2)} ₺` : "-"),
            sorter: (a, b) => a.price - b.price,
            width: '10%',
        },
        {
            title: t("Image"),
            dataIndex: 'imagePath',
            key: 'imagePath',
            align: 'center',
            width: '10%',
            render: (imagePath, record) => {
                const hasImagePath = imagePath && imagePath.trim() !== "";
                const isImageSuccessfullyLoaded = imageLoadStatus[record.id] !== false;
                const canPreview = hasImagePath && isImageSuccessfullyLoaded;

                return (
                    <div
                        className="stock-image-container" 
                        style={{ position: 'relative', display: 'inline-block', cursor: canPreview ? 'pointer' : 'default' }}
                        onClick={() => {
                            if (canPreview) setPreviewImage(`${backendUrl}/${imagePath}`);
                        }}
                    >
                        <StockImageWithDefault
                            image={imagePath}
                            alt={record.productName}
                            onImageLoadStatus={(isLoaded) =>
                                handleImageLoadStatus(record.id, isLoaded)
                            }
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: '4px',
                            }}
                        />
                        {canPreview && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px' }}>
                                <ZoomInOutlined style={{ color: 'white', fontSize: '16px' }} />
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            title: t("Actions"),
            key: 'actions',
            align: 'center',
            width: '30%', 
            render: (text, record) => (
                <Space direction="vertical" size="small" style={{ width: '100%', maxWidth: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {/* + Butonu */}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => onChangeQuantity(record.id, record.quantity, 1)}
                            style={{ width: '50px' }} 
                        />
                        {/* - Butonu - type="danger" ve ek olarak className="minus-button-red" eklendi */}
                        <Button
                            type="danger" 
                            className="minus-button-red" // Kırmızı rengi zorlayan sınıf
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() => onChangeQuantity(record.id, record.quantity, -1)}
                            disabled={record.quantity === 0}
                            style={{ width: '50px' }} 
                        />
                    </div>
                    {/* Hepsini Sil Butonu */}
                    <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => onDeleteStock(record.id)}
                        danger 
                        style={{ width: '100%', maxWidth: '108px' }} 
                    >
                        {t("Hepsini Sil")}
                    </Button>
                </Space>
            ),
        },
    ];


    useEffect(() => {
        if (username) {
            loadStocks(pagination.current, pagination.pageSize, searchTerm);
        }
    }, [username, pagination.current, pagination.pageSize, searchTerm]); 
    

    if (loading && stocks.length === 0) return <Spinner />;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="mb-0 d-flex align-items-center">
                    <span className="material-icons mi" style={{ marginRight: '8px' }}>inventory</span>
                    {t("Stock List")}
                </h3>
            </div>

            <div className="mb-3">
                <Search
                    placeholder={t("Search for a product")}
                    allowClear
                    enterButton={t("Search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={() => {
                        setPagination(prev => ({ ...prev, current: 1 }));
                        loadStocks(1, pagination.pageSize, searchTerm);
                    }}
                    style={{ width: '100%' }}
                />
            </div>


            {/* Tablo */}
            {stocks.length === 0 && !loading ? (
                <p className="text-muted d-flex align-items-center">
                    <InboxOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                    {t("No stocks found.")}
                </p>
            ) : (
                <Table
                    columns={columns}
                    dataSource={stocks}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} ${t("total")}`,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    loading={loading}
                    onChange={handleTableChange} 
                    scroll={{ x: 'max-content' }} 
                />
            )}
            
            <Modal
                title={t("Image Preview")}
                open={!!previewImage}
                onCancel={() => setPreviewImage(null)}
                footer={null}
                centered
            >
                {previewImage && (
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                )}
            </Modal>
        </>
    );
};

export default StockList;
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { addStock } from "../api/apiCalls";
import { useSelector } from "react-redux";
import { isValidImageFile } from "../utils/fileValidators";

// Ant Design Bileşenleri ve İkonlar
import {
    Form,
    Input,
    InputNumber,
    Button,
    Upload,
    Row,
    Col,
    message,
    Modal,
    // EKSİK OLAN 'Space' BURAYA EKLENMELİDİR!
    Space, 
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DollarOutlined,
    CalculatorOutlined,
    UploadOutlined,
    DeleteOutlined,
    EyeOutlined,
    TagOutlined,
} from "@ant-design/icons";
import "../css/StockList.css"; 

// ... (formItemColProps ve diğer sabit tanımlamalar aynı kalır)

const formItemColProps = {
    xs: 24, // Mobil: Tam genişlik (100%)
    sm: 24, // Tablet: Tam genişlik (100%)
    md: 12, // Masaüstü/Orta: Yarım genişlik (50%)
    lg: 8, // Geniş Masaüstü: Üçte bir genişlik (~33%)
};

const { TextArea } = Input;
const { Dragger } = Upload;

const StockForm = ({ onStockAdded }) => {
    const { t } = useTranslation();
    const username = useSelector((state) => state.username);
    const [form] = Form.useForm(); 

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [imageError, setImageError] = useState(undefined);

    const handlePreview = async () => {
        if (!imagePreview) return;
        setPreviewOpen(true);
    };

    const handleCancel = () => setPreviewOpen(false);

    const onFinish = async (values) => {
        // Form submit edildiğinde çağrılır (Ant Design'da başarılı doğrulama sonrası)
        if (!image) {
            setImageError(t("Ürün resmi seçilmesi zorunludur."));
            return;
        }

        setLoading(true);
        const { productName, description, quantity, price } = values;

        try {
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("description", description);
            formData.append("quantity", Number(quantity));
            formData.append("price", Number(price));
            formData.append("image", image);

            await addStock(formData);
            message.success(t("Stok başarıyla eklendi!"));
            
            // Başarılı işlem sonrası formu sıfırla
            form.resetFields();
            setImage(null);
            setImagePreview(null);
            setImageError(undefined);
            onStockAdded();

        } catch (err) {
            if (err.response?.data?.validationErrors) {
                // Backend'den gelen doğrulama hatalarını Ant Design formuna set et
                const antErrors = Object.keys(err.response.data.validationErrors).map(key => ({
                    name: key,
                    errors: [err.response.data.validationErrors[key]],
                }));
                form.setFields(antErrors);

            } else {
                message.error(t("An unexpected error occurred."));
            }
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        if (!isValidImageFile(file)) {
            setImageError(t("Sadece PNG, JPG, JPEG veya WEBP kabul edilir."));
            return Upload.LIST_IGNORE; 
        }
        
        return false; 
    };

    const onFileChange = (info) => {
        const file = info.file;
        
        if (!isValidImageFile(file)) {
            setImageError(t("Sadece PNG, JPG, JPEG veya WEBP kabul edilir."));
            setImage(null);
            setImagePreview(null);
            return;
        }
        
        setImageError(undefined);
        setImage(file);
        
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const onRemove = () => {
        setImage(null);
        setImagePreview(null);
        setImageError(undefined);
        return true; 
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ quantity: 1, price: 0 }}
        >
            <Row gutter={[24, 16]}>
                
                {/* Ürün Adı */}
                <Col {...formItemColProps}>
                    <Form.Item
                        name="productName"
                        label={t("Product Name")}
                        rules={[
                            { required: true, message: t("Ürün adı girilmesi zorunludur") },
                        ]}
                    >
                        <Input 
                            prefix={<TagOutlined />} 
                            placeholder={t("Ürün adını girin")}
                        />
                    </Form.Item>
                </Col>

                {/* Adet */}
                <Col {...formItemColProps}>
                    <Form.Item
                        name="quantity"
                        label={t("Quantity")}
                        rules={[
                            { required: true, message: t("Geçerli olan ürün adedinin girilmesi zorunludur.") },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            prefix={<CalculatorOutlined />}
                            placeholder="0"
                        />
                    </Form.Item>
                </Col>
                
                {/* Fiyat */}
                <Col {...formItemColProps}>
                    <Form.Item
                        name="price"
                        label={t("Fiyat (₺)")}
                        rules={[
                            { required: true, message: t("Geçerli bir fiyat girilmesi zorunludur.") },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            style={{ width: "100%" }}
                            prefix={<DollarOutlined />}
                            formatter={value => `${value} ₺`}
                            parser={value => value.replace(' ₺', '')}
                            placeholder="0.00"
                        />
                    </Form.Item>
                </Col>

                {/* Açıklama */}
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        name="description"
                        label={t("Description")}
                        rules={[
                            { required: true, message: t("Ürün açıklaması girilmesi zorunludur") },
                        ]}
                    >
                        <TextArea 
                            rows={3} 
                            placeholder={t("Kısa açıklama ekleyin")} 
                        />
                    </Form.Item>
                </Col>
                
                {/* Resim Yükleme */}
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        label={t("Product Image")}
                        validateStatus={imageError ? 'error' : ''}
                        help={imageError}
                        required={true}
                    >
                        <Dragger
                            name="file"
                            multiple={false}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            beforeUpload={beforeUpload}
                            onChange={onFileChange}
                            onRemove={onRemove}
                            fileList={image ? [{ 
                                uid: '-1', 
                                name: image.name, 
                                status: 'done',
                            }] : []} 
                            listType={image ? "text" : "picture"} 
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Dosyayı buraya sürükleyin veya tıklayın")}</p>
                            <p className="ant-upload-hint">
                                {t("Sadece PNG, JPG, JPEG veya WEBP kabul edilir.")}
                            </p>
                        </Dragger>
                        
                        {/* Önizleme ve Temizleme Butonları (Space burada kullanılıyor) */}
                        {imagePreview && (
                            <div className="d-flex align-items-center mt-2 gap-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="rounded shadow-sm"
                                    style={{ maxHeight: "120px", width: "auto" }}
                                />
                                <Space> {/* Bu kısım hata veriyordu */}
                                    <Button icon={<EyeOutlined />} onClick={handlePreview}>
                                        {t("Önizle")}
                                    </Button>
                                    <Button danger icon={<DeleteOutlined />} onClick={onRemove}>
                                        {t("Temizle")}
                                    </Button>
                                </Space>
                            </div>
                        )}
                    </Form.Item>
                </Col>

            </Row>

            {/* Gönderme Butonu */}
            <Form.Item className="mt-4">
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<PlusOutlined />}
                    size="large"
                >
                    {t("Add Stock")}
                </Button>
            </Form.Item>
            
            {/* Modal Önizleme */}
            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                <img
                    alt="Preview"
                    style={{ width: '100%' }}
                    src={imagePreview}
                />
            </Modal>
        </Form>
    );
};

export default StockForm;
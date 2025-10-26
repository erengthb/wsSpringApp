import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { addStock } from "../api/apiCalls";
import { useSelector } from "react-redux";
import { isValidImageFile } from "../utils/fileValidators";
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
    Space,
} from "antd";
import {
    PlusOutlined,
    DollarOutlined,
    CalculatorOutlined,
    UploadOutlined,
    DeleteOutlined,
    EyeOutlined,
    TagOutlined,
} from "@ant-design/icons";
import "../css/StockList.css";

const formItemColProps = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 8,
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

    const handlePreview = () => {
        if (!imagePreview) return;
        setPreviewOpen(true);
    };

    const handleCancel = () => setPreviewOpen(false);

    const onFinish = async (values) => {
        setLoading(true);
        const { productName, description, quantity, price } = values;

        try {
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("description", description);
            formData.append("quantity", Number(quantity || 0));
            formData.append("price", Number(price || 0));
            if (image) formData.append("image", image);

            await addStock(formData);
            message.success(t("Stok başarıyla eklendi!"));
            form.resetFields();
            setImage(null);
            setImagePreview(null);
            setImageError(undefined);
            onStockAdded();
        } catch (err) {
            if (err.response?.data?.validationErrors) {
                const antErrors = Object.keys(err.response.data.validationErrors).map((key) => ({
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
                        rules={[{ required: true, message: t("Ürün adı girilmesi zorunludur") }]}
                    >
                        <Input prefix={<TagOutlined />} placeholder={t("Ürün adını girin")} />
                    </Form.Item>
                </Col>

                {/* Adet */}
                <Col {...formItemColProps}>
                    <Form.Item
                        name="quantity"
                        label={t("Quantity")}
                        rules={[{ required: true, message: t("Adet girilmesi zorunludur.") }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="0"
                            prefix={<CalculatorOutlined />}
                            // Harf girişi engelleniyor
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) e.preventDefault();
                            }}
                        />
                    </Form.Item>
                </Col>

           {/* Fiyat */}
<Col {...formItemColProps}>
    <Form.Item
        name="price"
        label={t("Fiyat (₺)")}
        rules={[]} // Artık zorunlu değil
    >
        <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            placeholder="0.00"
             prefix="₺"
            // formatter kaldırıldı, sadece sayıyı alıyoruz
            parser={(value) => value ? value.replace(/[^\d.,-]/g, "").replace(",", ".") : ""}
            // Harf girişi engelleniyor
            onKeyPress={(e) => {
                if (!/[0-9.,]/.test(e.key)) e.preventDefault();
            }}
        />
    </Form.Item>
</Col>

                {/* Açıklama */}
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        name="description"
                        label={t("Description")}
                        rules={[{ required: true, message: t("Ürün açıklaması zorunludur.") }]}
                    >
                        <TextArea rows={3} placeholder={t("Kısa açıklama ekleyin")} />
                    </Form.Item>
                </Col>

                {/* Resim (Artık zorunlu değil) */}
                <Col xs={24} md={12} lg={8}>
                    <Form.Item
                        label={t("Product Image")}
                        validateStatus={imageError ? "error" : ""}
                        help={imageError}
                    >
                        <Dragger
                            name="file"
                            multiple={false}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            beforeUpload={beforeUpload}
                            onChange={onFileChange}
                            onRemove={onRemove}
                            fileList={
                                image
                                    ? [
                                          {
                                              uid: "-1",
                                              name: image.name,
                                              status: "done",
                                          },
                                      ]
                                    : []
                            }
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                                {t("Dosyayı buraya sürükleyin veya tıklayın")}
                            </p>
                            <p className="ant-upload-hint">
                                {t("Sadece PNG, JPG, JPEG veya WEBP kabul edilir.")}
                            </p>
                        </Dragger>

                        {imagePreview && (
                            <div className="d-flex align-items-center mt-2 gap-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="rounded shadow-sm"
                                    style={{ maxHeight: "120px", width: "auto" }}
                                />
                                <Space>
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

            {/* Gönder Butonu */}
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

            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                <img alt="Preview" style={{ width: "100%" }} src={imagePreview} />
            </Modal>
        </Form>
    );
};

export default StockForm;

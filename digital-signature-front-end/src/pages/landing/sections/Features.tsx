import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { motion } from 'framer-motion';
import {
    SafetyCertificateOutlined,
    CloudSyncOutlined,
    TeamOutlined,
    FileProtectOutlined,
    ThunderboltOutlined,
    GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const features = [
    {
        icon: <SafetyCertificateOutlined />,
        title: 'Bảo mật tuyệt đối',
        description: 'Mã hóa đầu cuối chuẩn quốc tế, đảm bảo an toàn cho mọi tài liệu của bạn.'
    },
    {
        icon: <CloudSyncOutlined />,
        title: 'Đồng bộ đám mây',
        description: 'Truy cập và ký tài liệu từ bất kỳ thiết bị nào, mọi lúc mọi nơi.'
    },
    {
        icon: <TeamOutlined />,
        title: 'Làm việc nhóm',
        description: 'Dễ dàng chia sẻ và quản lý quy trình ký kết trong doanh nghiệp.'
    },
    {
        icon: <FileProtectOutlined />,
        title: 'Pháp lý đảm bảo',
        description: 'Tuân thủ đầy đủ các quy định pháp luật về chữ ký số điện tử.'
    },
    {
        icon: <ThunderboltOutlined />,
        title: 'Tốc độ nhanh chóng',
        description: 'Ký hàng loạt tài liệu chỉ trong vài giây, tiết kiệm thời gian tối đa.'
    },
    {
        icon: <GlobalOutlined />,
        title: 'Đa ngôn ngữ',
        description: 'Hỗ trợ giao diện Tiếng Việt và Tiếng Anh, thuận tiện cho mọi người dùng.'
    }
];

export const Features: React.FC = () => {
    return (
        <section id="features" style={{ padding: '100px 24px', background: '#fff' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <Title level={2} style={{ fontSize: 36, marginBottom: 16 }}>Tính năng nổi bật</Title>
                    <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        Chúng tôi cung cấp đầy đủ các công cụ cần thiết để bạn quản lý chữ ký số một cách hiệu quả nhất.
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Card
                                    bordered={false}
                                    style={{
                                        height: '100%',
                                        borderRadius: 16,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    bodyStyle={{ padding: 32 }}
                                >
                                    <div style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 16,
                                        background: 'rgba(24, 144, 255, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 24,
                                        color: '#1890ff',
                                        fontSize: 28
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <Title level={4} style={{ marginBottom: 16 }}>{feature.title}</Title>
                                    <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                                        {feature.description}
                                    </Paragraph>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};

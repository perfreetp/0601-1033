import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, Button, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { paperOptions, mockMaterials } from '@/data/mock';
import { formatPrice, generateId } from '@/utils';
import { useDesign } from '@/store/DesignContext';
import { HistoryOrder, OrderItem, ProductionConfig } from '@/types';
import styles from './index.module.scss';

interface OrderItemState {
  id: string;
  name: string;
  type: string;
  previewImage: string;
  quantity: number;
  unitPrice: number;
}

const typeMap: Record<string, string> = {
  tableCard: '桌卡',
  seatingChart: '席位图',
  welcomeBoard: '迎宾牌',
  menu: '菜单'
};

const borderNameMap: Record<string, string> = {
  b1: '细边框',
  b2: '粗边框',
  b3: '双线边框',
  b4: '无边框'
};

const OrderPage: React.FC = () => {
  const {
    addHistoryOrder, selectedStyle, selectedColor, selectedSize,
    photoUrl, selectedBorder, showBorder, hasGoldFoil,
    titleText, nameText, dateText, textColor, guests, tables,
    currentScheme
  } = useDesign();

  const [orderItems, setOrderItems] = useState<OrderItemState[]>(
    mockMaterials.map((m, idx) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      previewImage: m.previewImage,
      quantity: m.type === 'tableCard' ? 20 : m.type === 'menu' ? 20 : m.type === 'seatingChart' ? 2 : 1,
      unitPrice: m.type === 'tableCard' ? 8 : m.type === 'menu' ? 6 : m.type === 'seatingChart' ? 120 : 280
    }))
  );
  const [selectedPaper, setSelectedPaper] = useState(paperOptions[0].id);
  const [isUrgent, setIsUrgent] = useState(false);
  const [remark, setRemark] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const subtotal = useMemo(() => {
    const paper = paperOptions.find(p => p.id === selectedPaper);
    const paperPrice = paper ? paper.price : 0;
    return orderItems.reduce((sum, item) => {
      return sum + item.quantity * (item.unitPrice + paperPrice);
    }, 0);
  }, [orderItems, selectedPaper]);

  const urgentFee = isUrgent ? Math.round(subtotal * 0.2) : 0;
  const totalAmount = subtotal + urgentFee;
  const paperInfo = paperOptions.find(p => p.id === selectedPaper);
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectAddress = () => {
    console.log('[Order] 选择收货地址');
    Taro.showToast({ title: '选择地址', icon: 'none' });
  };

  const buildProductionConfig = (): ProductionConfig => {
    return {
      photoUrl,
      borderStyle: showBorder ? selectedBorder : 'b4',
      showBorder,
      hasGoldFoil,
      textColor,
      titleText,
      nameText,
      dateText,
      paperId: selectedPaper,
      paperName: paperInfo?.name || '象牙卡',
      isUrgent,
      styleName: selectedStyle?.name || '未设置',
      colorName: selectedColor?.name || '未设置',
      sizeName: selectedSize?.name || '未设置',
      guestCount: guests.length,
      tableCount: tables.length,
      remark
    };
  };

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleSubmit = () => {
    console.log('[Order] 提交订单', {
      items: orderItems,
      paper: selectedPaper,
      urgent: isUrgent,
      remark,
      total: totalAmount
    });
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const orderNo = `WD${Date.now().toString().slice(-8)}`;

    const orderItemsData: OrderItem[] = orderItems.map(item => ({
      materialId: item.id,
      materialName: item.name,
      quantity: item.quantity,
      paperId: selectedPaper,
      unitPrice: item.unitPrice
    }));

    const productionConfig = buildProductionConfig();

    const newOrder: HistoryOrder = {
      id: generateId(),
      orderNo,
      weddingName: nameText || (selectedStyle ? `${selectedStyle.name}婚礼` : '王浩 & 李静'),
      date: dateStr,
      status: 'producing',
      statusText: '制作中',
      totalAmount,
      items: orderItemsData,
      productionConfig
    };

    addHistoryOrder(newOrder);
    setShowConfirm(false);

    Taro.showToast({
      title: '下单成功',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/profile/index' });
    }, 1500);
  };

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>
            <Text className={styles.icon}>📋</Text>物料清单
          </Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.materialList}>
            {orderItems.map(item => (
              <View key={item.id} className={styles.materialItem}>
                <View className={styles.preview}>
                  <Image className={styles.previewImg} src={item.previewImage} mode="aspectFill" />
                </View>
                <View className={styles.info}>
                  <View>
                    <Text className={styles.name}>{item.name}</Text>
                    <Text className={styles.specs}>
                      {typeMap[item.type]} · A5尺寸 · {paperInfo?.name}
                    </Text>
                  </View>
                  <View className={styles.bottomRow}>
                    <Text className={styles.price}>{formatPrice(item.unitPrice)}/份</Text>
                    <View className={styles.quantity}>
                      <Text
                        className={classnames(styles.qtyBtn, item.quantity <= 1 && styles.disabled)}
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </Text>
                      <Text className={styles.qtyNum}>{item.quantity}</Text>
                      <Text
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>
            <Text className={styles.icon}>🎨</Text>纸张选择
          </Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.paperList}>
            {paperOptions.map(paper => (
              <View
                key={paper.id}
                className={classnames(styles.paperItem, selectedPaper === paper.id && styles.active)}
                onClick={() => setSelectedPaper(paper.id)}
              >
                <View className={styles.colorSwatch} style={{ background: paper.color }} />
                <View className={styles.info}>
                  <Text className={styles.name}>{paper.name}</Text>
                  <Text className={styles.desc}>{paper.description}</Text>
                </View>
                <Text className={styles.price}>+{formatPrice(paper.price)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>
            <Text className={styles.icon}>⚡</Text>服务选项
          </Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.urgentSection}>
            <View className={styles.optionRow}>
              <View className={styles.optionInfo}>
                <Text className={styles.label}>加急制作</Text>
                <Text className={styles.desc}>3个工作日内完成，加收20%加急费</Text>
              </View>
              <View className={styles.optionRight}>
                {isUrgent && <Text className={styles.extra}>+{formatPrice(urgentFee)}</Text>}
                <View
                  className={classnames(styles.toggleSwitch, isUrgent && styles.active)}
                  onClick={() => setIsUrgent(!isUrgent)}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>
            <Text className={styles.icon}>📍</Text>收货地址
          </Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.addressCard} onClick={handleSelectAddress}>
            <Text className={styles.icon}>🏠</Text>
            <View className={styles.info}>
              <View>
                <Text className={styles.name}>
                  Luna
                  <Text className={styles.phone}>138****1234</Text>
                </Text>
              </View>
              <Text className={styles.address}>上海市徐汇区衡山路888号 婚礼策划工作室</Text>
            </View>
            <Text className={styles.arrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>
            <Text className={styles.icon}>📝</Text>订单备注
          </Text>
        </View>
        <View className={styles.sectionBody}>
          <Textarea
            className={styles.remarkInput}
            placeholder="选填，请输入特殊要求或注意事项..."
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            maxlength={200}
          />
        </View>
      </View>

      {showConfirm && (
        <View className={styles.confirmOverlay} onClick={handleCloseConfirm}>
          <View className={styles.confirmPanel} onClick={(e) => e.stopPropagation()}>
            <View className={styles.confirmHeader}>
              <Text className={styles.confirmTitle}>订单确认清单</Text>
              <Text className={styles.confirmClose} onClick={handleCloseConfirm}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.confirmBody}>
              <View className={styles.confirmSection}>
                <Text className={styles.confirmSectionTitle}>设计配置</Text>
                <View className={styles.confirmGrid}>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>新人姓名</Text>
                    <Text className={styles.confirmValue}>{nameText || '未设置'}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>婚礼日期</Text>
                    <Text className={styles.confirmValue}>{dateText || '未设置'}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>婚礼风格</Text>
                    <Text className={styles.confirmValue}>{selectedStyle?.name || '未设置'}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>主色系</Text>
                    <Text className={styles.confirmValue}>{selectedColor?.name || '未设置'}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>边框样式</Text>
                    <Text className={styles.confirmValue}>
                      {showBorder ? borderNameMap[selectedBorder] || '细边框' : '无边框'}
                    </Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>烫金效果</Text>
                    <Text className={styles.confirmValue}>{hasGoldFoil ? '已开启' : '未开启'}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>照片</Text>
                    <Text className={styles.confirmValue}>{photoUrl ? '已上传' : '未上传'}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>文字颜色</Text>
                    <View className={styles.confirmColorDot} style={{ background: textColor }} />
                  </View>
                </View>
                {photoUrl && (
                  <View className={styles.confirmPhoto}>
                    <Image src={photoUrl} mode="aspectFill" className={styles.confirmPhotoImg} />
                  </View>
                )}
              </View>

              <View className={styles.confirmSection}>
                <Text className={styles.confirmSectionTitle}>制作配置</Text>
                <View className={styles.confirmGrid}>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>纸张类型</Text>
                    <Text className={styles.confirmValue}>{paperInfo?.name}</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>纸张加价</Text>
                    <Text className={styles.confirmValue}>{formatPrice(paperInfo?.price || 0)}/份</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>总数量</Text>
                    <Text className={styles.confirmValue}>{totalQuantity}份</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>加急服务</Text>
                    <Text className={classnames(styles.confirmValue, isUrgent && styles.urgentText)}>
                      {isUrgent ? '是 +20%' : '否'}
                    </Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>宾客人数</Text>
                    <Text className={styles.confirmValue}>{guests.length}人 · {tables.length}桌</Text>
                  </View>
                  <View className={styles.confirmItem}>
                    <Text className={styles.confirmLabel}>制作尺寸</Text>
                    <Text className={styles.confirmValue}>{selectedSize?.name || '标准'}</Text>
                  </View>
                </View>
              </View>

              <View className={styles.confirmSection}>
                <Text className={styles.confirmSectionTitle}>物料明细</Text>
                {orderItems.map(item => {
                  const paper = paperInfo?.price || 0;
                  const itemTotal = item.quantity * (item.unitPrice + paper);
                  return (
                    <View key={item.id} className={styles.confirmMaterialRow}>
                      <Text className={styles.confirmMatName}>{item.name}</Text>
                      <Text className={styles.confirmMatQty}>×{item.quantity}</Text>
                      <Text className={styles.confirmMatPrice}>{formatPrice(itemTotal)}</Text>
                    </View>
                  );
                })}
              </View>

              {remark && (
                <View className={styles.confirmSection}>
                  <Text className={styles.confirmSectionTitle}>备注</Text>
                  <Text className={styles.confirmRemark}>{remark}</Text>
                </View>
              )}
            </ScrollView>
            <View className={styles.confirmFooter}>
              <View className={styles.confirmTotalRow}>
                <Text className={styles.confirmTotalLabel}>订单总额</Text>
                <Text className={styles.confirmTotalValue}>{formatPrice(totalAmount)}</Text>
              </View>
              <Button className={styles.confirmSubmitBtn} onClick={handleSubmit}>
                确认下单
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className={styles.summaryBar}>
        <View className={styles.priceSummary}>
          <View className={styles.priceDetails}>
            <View className={styles.row}>
              <Text className={styles.label}>物料小计</Text>
              <Text className={styles.value}>{formatPrice(subtotal)}</Text>
            </View>
            {isUrgent && (
              <View className={styles.row}>
                <Text className={styles.label}>加急费</Text>
                <Text className={styles.value}>{formatPrice(urgentFee)}</Text>
              </View>
            )}
            <View className={styles.row}>
              <Text className={styles.label} style={{ fontWeight: '600', color: '#2D2A26' }}>应付总额</Text>
              <Text className={`${styles.value} ${styles.total}`}>{formatPrice(totalAmount)}</Text>
            </View>
          </View>
        </View>
        <Button className={styles.submitBtn} onClick={handleShowConfirm}>
          提交订单 {formatPrice(totalAmount)}
        </Button>
      </View>
    </ScrollView>
  );
};

export default OrderPage;


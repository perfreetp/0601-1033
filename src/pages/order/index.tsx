import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { paperOptions, mockMaterials } from '@/data/mock';
import { formatPrice, generateId } from '@/utils';
import { useDesign } from '@/store/DesignContext';
import { HistoryOrder, OrderItem } from '@/types';
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

const OrderPage: React.FC = () => {
  const { addHistoryOrder, selectedStyle } = useDesign();
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

  const handleSelectAddress = () => {
    console.log('[Order] 选择收货地址');
    Taro.showToast({ title: '选择地址', icon: 'none' });
  };

  const handleSubmit = () => {
    console.log('[Order] 提交订单', {
      items: orderItems,
      paper: selectedPaper,
      urgent: isUrgent,
      remark,
      total: totalAmount
    });
    Taro.showModal({
      title: '确认下单',
      content: `订单总额: ${formatPrice(totalAmount)}，确认提交吗？`,
      success: (res) => {
        if (res.confirm) {
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

          const newOrder: HistoryOrder = {
            id: generateId(),
            orderNo,
            weddingName: selectedStyle ? `${selectedStyle.name}婚礼` : '王浩 & 李静',
            date: dateStr,
            status: 'producing',
            statusText: '制作中',
            totalAmount,
            items: orderItemsData
          };

          addHistoryOrder(newOrder);

          Taro.showToast({
            title: '下单成功',
            icon: 'success'
          });
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/profile/index' });
          }, 1500);
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
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
                      {typeMap[item.type]} · A5尺寸 · {paperOptions.find(p => p.id === selectedPaper)?.name}
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
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          提交订单 {formatPrice(totalAmount)}
        </Button>
      </View>
    </View>
  );
};

export default OrderPage;

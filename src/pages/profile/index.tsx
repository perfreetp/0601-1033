import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useDesign } from '@/store/DesignContext';
import { mockBrandTemplates, mockBlessings } from '@/data/mock';
import { formatPrice } from '@/utils';
import { HistoryOrder } from '@/types';
import styles from './index.module.scss';

const statusLabelMap: Record<string, string> = {
  pending: '待制作',
  producing: '制作中',
  shipped: '已发货',
  completed: '已完成'
};

const borderNameMap: Record<string, string> = {
  b1: '细边框',
  b2: '粗边框',
  b3: '双线边框',
  b4: '无边框'
};

const typeMap: Record<string, string> = {
  tableCard: '桌卡',
  seatingChart: '席位图',
  welcomeBoard: '迎宾牌',
  menu: '菜单'
};

const ProfilePage: React.FC = () => {
  const { historyOrders } = useDesign();
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<HistoryOrder | null>(null);

  const handleViewOrder = (order: HistoryOrder) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCloseDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleViewBlessing = (blessing) => {
    console.log('[Profile] 查看祝福语:', blessing.title);
  };

  const completedCount = historyOrders.filter(o => o.status === 'completed').length;

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.userHeader}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Image
              className={styles.avatarImg}
              src="https://picsum.photos/id/177/200/200"
              mode="aspectFill"
            />
          </View>
          <View className={styles.info}>
            <Text className={styles.name}>婚礼策划师·Luna</Text>
            <Text className={styles.role}>资深婚礼策划师</Text>
          </View>
          <Text className={styles.settingBtn}>设置</Text>
        </View>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statItem}>
            <Text className={styles.num}>28</Text>
            <Text className={styles.label}>设计作品</Text>
          </View>
        <View className={styles.statItem}>
            <Text className={styles.num}>{completedCount}</Text>
            <Text className={styles.label}>完成订单</Text>
          </View>
        <View className={styles.statItem}>
            <Text className={styles.num}>6</Text>
            <Text className={styles.label}>品牌模板</Text>
          </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>我的品牌模板</Text>
          <Text className={styles.more}>查看全部 →</Text>
        </View>
        <ScrollView scrollX className={styles.brandList} enhanced showScrollbar={false}>
          {mockBrandTemplates.map(brand => (
            <View key={brand.id} className={styles.brandCard}>
              <Image className={styles.cover} src={brand.coverImage} mode="aspectFill" />
              <View className={styles.info}>
                <Text className={styles.name}>{brand.name}</Text>
                <Text className={styles.time}>{brand.updateTime}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>历史订单</Text>
          <Text className={styles.more}>全部订单 →</Text>
        </View>
        <View className={styles.orderList}>
          {historyOrders.map(order => (
            <View key={order.id} className={styles.orderItem} onClick={() => handleViewOrder(order)}>
              <View className={styles.orderHeader}>
                <Text className={styles.orderNo}>{order.orderNo}</Text>
                <Text className={`${styles.status} ${styles[order.status]}`}>
                  {order.statusText || statusLabelMap[order.status] || order.status}
                </Text>
              </View>
              <Text className={styles.weddingName}>{order.weddingName}</Text>
              <View className={styles.orderFooter}>
                <Text className={styles.date}>{order.date}</Text>
                <Text className={styles.amount}>{formatPrice(order.totalAmount)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {showOrderDetail && selectedOrder && (
        <View className={styles.orderDetailOverlay} onClick={handleCloseDetail}>
          <View className={styles.orderDetailPanel} onClick={(e) => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.detailTitle}>订单详情</Text>
              <Text className={styles.detailClose} onClick={handleCloseDetail}>✕</Text>
            </View>
            <View className={styles.detailBody}>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>订单号</Text>
                <Text className={styles.detailValue}>{selectedOrder.orderNo}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>婚礼名称</Text>
                <Text className={styles.detailValue}>{selectedOrder.weddingName}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>下单日期</Text>
                <Text className={styles.detailValue}>{selectedOrder.date}</Text>
              </View>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>订单状态</Text>
                <Text className={`${styles.detailValue} ${styles.detailStatus}`}>
                  {selectedOrder.statusText || statusLabelMap[selectedOrder.status] || selectedOrder.status}
                </Text>
              </View>
              <View className={styles.detailDivider} />
              <Text className={styles.detailSectionTitle}>物料明细</Text>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <View key={idx} className={styles.detailItem}>
                    <View className={styles.detailItemInfo}>
                      <Text className={styles.detailItemName}>{item.materialName || typeMap[item.materialId] || '物料'}</Text>
                      <Text className={styles.detailItemQty}>×{item.quantity}</Text>
                    </View>
                    <Text className={styles.detailItemPrice}>{formatPrice(item.unitPrice * item.quantity)}</Text>
                  </View>
                ))
              ) : (
                <Text className={styles.detailEmpty}>暂无物料信息</Text>
              )}
              <View className={styles.detailDivider} />
              {selectedOrder.productionConfig ? (
                <>
                  <Text className={styles.detailSectionTitle}>制作配置</Text>
                  {selectedOrder.productionConfig.photoUrl && (
                    <View className={styles.detailPhotoPreview}>
                      <Image
                        src={selectedOrder.productionConfig.photoUrl}
                        mode="aspectFill"
                        className={styles.detailPhotoImg}
                      />
                    </View>
                  )}
                  <View className={styles.detailGrid}>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>新人姓名</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.nameText}</Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>婚礼日期</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.dateText}</Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>婚礼风格</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.styleName}</Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>主色系</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.colorName}</Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>边框样式</Text>
                      <Text className={styles.detailGridValue}>
                        {selectedOrder.productionConfig.showBorder
                          ? borderNameMap[selectedOrder.productionConfig.borderStyle] || '细边框'
                          : '无边框'}
                      </Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>烫金效果</Text>
                      <Text className={styles.detailGridValue}>
                        {selectedOrder.productionConfig.hasGoldFoil ? '已开启' : '未开启'}
                      </Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>纸张类型</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.paperName}</Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>加急服务</Text>
                      <Text
                        className={classnames(
                          styles.detailGridValue,
                          selectedOrder.productionConfig.isUrgent && styles.urgentText
                        )}
                      >
                        {selectedOrder.productionConfig.isUrgent ? '是 +20%' : '否'}
                      </Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>宾客人数</Text>
                      <Text className={styles.detailGridValue}>
                        {selectedOrder.productionConfig.guestCount}人 · {selectedOrder.productionConfig.tableCount}桌
                      </Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>制作尺寸</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.sizeName}</Text>
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>文字颜色</Text>
                      <View className={styles.detailColorDot} style={{ background: selectedOrder.productionConfig.textColor }} />
                    </View>
                    <View className={styles.detailGridItem}>
                      <Text className={styles.detailGridLabel}>标题文字</Text>
                      <Text className={styles.detailGridValue}>{selectedOrder.productionConfig.titleText}</Text>
                    </View>
                  </View>
                  {selectedOrder.productionConfig.remark && (
                    <>
                      <Text className={styles.detailSectionTitle}>订单备注</Text>
                      <Text className={styles.detailRemark}>{selectedOrder.productionConfig.remark}</Text>
                    </>
                  )}
                  <View className={styles.detailDivider} />
                </>
              ) : null}
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel} style={{ fontWeight: '600' }}>订单总额</Text>
                <Text className={styles.detailTotalAmount}>{formatPrice(selectedOrder.totalAmount)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.title}>常用祝福语</Text>
          <Text className={styles.more}>管理 →</Text>
        </View>
        <View className={styles.blessingList}>
          {mockBlessings.map(blessing => (
            <View key={blessing.id} className={styles.blessingItem} onClick={() => handleViewBlessing(blessing)}>
              <View className={styles.header}>
                <Text className={styles.title}>{blessing.title}</Text>
                <Text className={styles.category}>{blessing.category}</Text>
              </View>
              <Text className={styles.content}>{blessing.content}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

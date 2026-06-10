import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockBrandTemplates, mockHistoryOrders, mockBlessings } from '@/data/mock';
import { formatPrice } from '@/utils';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const handleViewOrder = (order) => {
    console.log('[Profile] 查看订单:', order.orderNo);
    Taro.showToast({ title: '订单详情', icon: 'none' });
  };

  const handleViewBlessing = (blessing) => {
    console.log('[Profile] 查看祝福语:', blessing.title);
  };

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
            <Text className={styles.num}>15</Text>
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
          {mockHistoryOrders.map(order => (
            <View key={order.id} className={styles.orderItem} onClick={() => handleOrder(order)}>
              <View className={styles.orderHeader}>
                <Text className={styles.orderNo}>{order.orderNo}</Text>
                <Text className={`${styles.status} ${styles[order.status]}`}>{order.statusText}</Text>
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

import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockMaterials } from '@/data/mock';
import styles from './index.module.scss';

const typeMap = {
  tableCard: '桌卡',
  seatingChart: '席位图',
  welcomeBoard: '迎宾牌',
  menu: '菜单'
};

const PreviewPage: React.FC = () => {
  const handleEdit = (material) => {
    console.log('[Preview] 编辑物料:', material.name);
    Taro.navigateTo({ url: '/pages/editor/index' });
  };

  const handleCollaborate = () => {
    console.log('[Preview] 发起协作');
    Taro.navigateTo({ url: '/pages/collaborate/index' });
  };

  const handleOrder = () => {
    console.log('[Preview] 前往下单');
    Taro.navigateTo({ url: '/pages/order/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.header}>
        <Text className={styles.title}>整套物料预览</Text>
        <Text className={styles.subtitle}>检查所有物料的设计一致性</Text>
      </View>

      <View className={styles.consistencyCheck}>
        <Text className={styles.icon}>✓</Text>
        <View className={styles.content}>
          <Text className={styles.title}>设计风格统一</Text>
          <Text className={styles.desc}>所有物料风格、色系保持一致</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>物料清单</Text>
          <Text className={styles.count}>共 {mockMaterials.length} 项</Text>
        </View>
        <View className={styles.materialList}>
          {mockMaterials.map(material => (
            <View key={material.id} className={styles.materialCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.typeTag}>{typeMap[material.type]}</Text>
                <Text className={styles.editBtn} onClick={() => handleEdit(material)}>编辑</Text>
              </View>
              <View className={styles.cardBody}>
                <Image className={styles.previewImg} src={material.previewImage} mode="aspectFill" />
                <View className={styles.info}>
                  <Text className={styles.name}>{material.name}</Text>
                  <Text className={styles.desc}>已完成设计调整</Text>
                  <Text className={styles.status}>✓ 设计完成</Text>
                </View>
              </View>
            </View>
            ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleCollaborate}>
          发起协作
        </Button>
        <Button className={styles.primaryBtn} onClick={handleOrder}>
          确认下单
        </Button>
      </View>
    </View>
  );
};

export default PreviewPage;

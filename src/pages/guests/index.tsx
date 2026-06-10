import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockGuests, mockTables } from '@/data/mock';
import styles from './index.module.scss';

const GuestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tables');
  const [guests] = useState(mockGuests);
  const [tables] = useState(mockTables);

  const totalGuests = guests.length;
  const childCount = guests.filter(g => g.isChild).length;
  const allergyCount = guests.filter(g => g.allergies.length > 0).length;
  const assignedCount = guests.filter(g => g.tableNumber).length;

  const handleImport = () => {
    console.log('[Guests] 导入宾客名单');
    Taro.showToast({
      title: '支持Excel/CSV导入',
      icon: 'none'
    });
  };

  const handleAddGuest = () => {
    console.log('[Guests] 添加宾客');
    Taro.showToast({
      title: '添加宾客',
      icon: 'none'
    });
  };

  const handleAddTable = () => {
    console.log('[Guests] 添加桌次');
    Taro.showToast({
      title: '新建桌次',
      icon: 'none'
    });
  };

  const handleConfirm = () => {
    console.log('[Guests] 确认分桌');
    Taro.showToast({
      title: '分桌已确认',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const getGuestsByTable = (tableNumber: number) => {
    return guests.filter(g => g.tableNumber === tableNumber);
  };

  const unassignedGuests = guests.filter(g => !g.tableNumber);

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.statsBar}>
        <View className={styles.stat}>
          <Text className={styles.num}>{totalGuests}</Text>
          <Text className={styles.label}>总人数</Text>
        </View>
        <View className={styles.stat}>
          <Text className={styles.num}>{childCount}</Text>
          <Text className={styles.label}>儿童</Text>
        </View>
        <View className={styles.stat}>
          <Text className={styles.num}>{allergyCount}</Text>
          <Text className={styles.label}>需注意</Text>
        </View>
        <View className={styles.stat}>
          <Text className={styles.num}>{assignedCount}</Text>
          <Text className={styles.label}>已分桌</Text>
        </View>
      </View>

      <View className={styles.actionBar}>
        <Button className={classnames(styles.actionBtn, styles.secondary)} onClick={handleAddGuest}>
          + 添加宾客
        </Button>
        <Button className={classnames(styles.actionBtn, styles.primary)} onClick={handleImport}>
          导入名单
        </Button>
      </View>

      <View className={styles.tabs}>
        <Text
          className={classnames(styles.tab, activeTab === 'tables' && styles.active)}
          onClick={() => setActiveTab('tables')}
        >
          桌次视图
        </Text>
        <Text
          className={classnames(styles.tab, activeTab === 'list' && styles.active)}
          onClick={() => setActiveTab('list')}
        >
          宾客列表
        </Text>
      </View>

      {activeTab === 'tables' && (
        <View className={styles.tablesSection}>
          <View className={styles.sectionTitle}>
            <Text>桌次安排</Text>
            <Text className={styles.addBtn} onClick={handleAddTable}>+ 新建桌次</Text>
          </View>
          <View className={styles.tableList}>
            {tables.map(table => (
              <View key={table.id} className={styles.tableCard}>
                <View className={styles.tableHeader}>
                  <View className={styles.tableInfo}>
                    <Text className={styles.tableNo}>{table.number}</Text>
                    <Text className={styles.tableName}>{table.name}</Text>
                  </View>
                  <Text className={styles.guestCount}>{table.guestIds.length} 人</Text>
                </View>
                <View className={styles.tableBody}>
                  <View className={styles.guestsRow}>
                    {getGuestsByTable(table.number).map(guest => (
                      <Text
                        key={guest.id}
                        className={classnames(
                          styles.guestBadge,
                          guest.isChild && styles.child,
                          guest.allergies.length > 0 && styles.allergy
                        )}
                      >
                        {guest.name}
                        {guest.isChild && <Text className={styles.tag}>童</Text>}
                        {guest.allergies.length > 0 && <Text className={styles.tag}>!</Text>}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
            {unassignedGuests.length > 0 && (
              <View className={styles.tableCard}>
                <View className={styles.tableHeader}>
                  <View className={styles.tableInfo}>
                    <Text className={styles.tableNo} style={{ background: '#C8C2BA' }}>-</Text>
                    <Text className={styles.tableName}>待分配</Text>
                  </View>
                  <Text className={styles.guestCount}>{unassignedGuests.length} 人</Text>
                </View>
                <View className={styles.tableBody}>
                  <View className={styles.guestsRow}>
                    {unassignedGuests.map(guest => (
                      <Text key={guest.id} className={styles.guestBadge}>
                        {guest.name}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {activeTab === 'list' && (
        <View className={styles.guestsSection}>
          <Text className={styles.sectionTitle}>全部宾客</Text>
          <View className={styles.guestList}>
            {guests.map(guest => (
              <View key={guest.id} className={styles.guestItem}>
                <View className={styles.guestInfo}>
                  <View className={styles.name}>
                    {guest.name}
                    {guest.isChild && (
                      <Text style={{
                        fontSize: '20rpx',
                        padding: '4rpx 12rpx',
                        background: 'rgba(124, 182, 137, 0.15)',
                        color: '#7CB689',
                        borderRadius: '8rpx'
                      }}>儿童餐</Text>
                    )}
                  </View>
                  <View className={styles.meta}>
                    {guest.phone && <Text className={styles.metaItem}>📱 {guest.phone}</Text>}
                    {guest.allergies.length > 0 && (
                      <Text className={styles.metaItem} style={{ color: '#C96A6A' }}>
                        ⚠ 过敏: {guest.allergies.join('、')}
                      </Text>
                    )}
                  </View>
                </View>
                {guest.tableNumber ? (
                  <Text className={styles.tableBadge}>{guest.tableNumber}号桌</Text>
                ) : (
                  <Text className={styles.unassigned}>待分配</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <Button className={styles.confirmBtn} onClick={handleConfirm}>
          确认分桌并生成席位图
        </Button>
      </View>
    </ScrollView>
  );
};

export default GuestsPage;

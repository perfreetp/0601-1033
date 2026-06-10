import React, { useState } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDesign } from '@/store/DesignContext';
import { generateId } from '@/utils';
import { Guest } from '@/types';
import styles from './index.module.scss';

const importGuests = [
  { name: '陈雨晴', isChild: false, allergies: [], phone: '139****5678' },
  { name: '刘明远', isChild: false, allergies: ['花生'], phone: '137****2345' },
  { name: '小豆子', isChild: true, allergies: [], phone: '' },
  { name: '赵文博', isChild: false, allergies: [], phone: '136****8901' },
  { name: '孙婉清', isChild: false, allergies: ['海鲜'], phone: '135****4567' },
];

const GuestsPage: React.FC = () => {
  const { guests, tables, addGuest, updateGuest, removeGuest, addTable } = useDesign();
  const [activeTab, setActiveTab] = useState('tables');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ name: '', phone: '', isChild: false, allergies: '', tableNumber: '' });

  const totalGuests = guests.length;
  const childCount = guests.filter(g => g.isChild).length;
  const allergyCount = guests.filter(g => g.allergies.length > 0).length;
  const assignedCount = guests.filter(g => g.tableNumber).length;

  const handleImport = () => {
    console.log('[Guests] 导入宾客名单');
    let importedCount = 0;
    importGuests.forEach(g => {
      const exists = guests.find(existing => existing.name === g.name);
      if (!exists) {
        addGuest({
          id: generateId(),
          name: g.name,
          isChild: g.isChild,
          allergies: g.allergies,
          phone: g.phone,
          tableNumber: undefined,
          notes: ''
        });
        importedCount++;
      }
    });
    Taro.showToast({
      title: importedCount > 0 ? `成功导入${importedCount}位宾客` : '无新宾客可导入',
      icon: importedCount > 0 ? 'success' : 'none'
    });
  };

  const handleAddGuest = () => {
    setShowAddForm(true);
    setEditingGuestId(null);
    setAddForm({ name: '', phone: '', isChild: false, allergies: '', tableNumber: '' });
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuestId(guest.id);
    setShowAddForm(true);
    setAddForm({
      name: guest.name,
      phone: guest.phone || '',
      isChild: guest.isChild,
      allergies: guest.allergies.join('、'),
      tableNumber: guest.tableNumber ? String(guest.tableNumber) : ''
    });
  };

  const handleSubmitGuest = () => {
    if (!addForm.name.trim()) {
      Taro.showToast({ title: '请输入宾客姓名', icon: 'none' });
      return;
    }

    const allergies = addForm.allergies
      ? addForm.allergies.split(/[、,，]/).map(a => a.trim()).filter(Boolean)
      : [];
    const tableNumber = addForm.tableNumber ? parseInt(addForm.tableNumber) : undefined;

    if (editingGuestId) {
      updateGuest(editingGuestId, {
        name: addForm.name.trim(),
        phone: addForm.phone.trim() || undefined,
        isChild: addForm.isChild,
        allergies,
        tableNumber
      });
      Taro.showToast({ title: '宾客信息已更新', icon: 'success' });
    } else {
      addGuest({
        id: generateId(),
        name: addForm.name.trim(),
        phone: addForm.phone.trim() || undefined,
        isChild: addForm.isChild,
        allergies,
        tableNumber,
        notes: ''
      });
      Taro.showToast({ title: '已添加宾客', icon: 'success' });
    }

    setShowAddForm(false);
    setEditingGuestId(null);
    setAddForm({ name: '', phone: '', isChild: false, allergies: '', tableNumber: '' });
  };

  const handleDeleteGuest = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要移除该宾客吗？',
      success: (res) => {
        if (res.confirm) {
          removeGuest(id);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleAddTable = () => {
    console.log('[Guests] 添加桌次');
    const nextNumber = tables.length > 0 ? Math.max(...tables.map(t => t.number)) + 1 : 1;
    addTable({
      id: generateId(),
      number: nextNumber,
      name: `${nextNumber}号桌`,
      guestIds: []
    });
    Taro.showToast({
      title: `已添加${nextNumber}号桌`,
      icon: 'success'
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

      {showAddForm && (
        <View className={styles.addForm}>
          <View className={styles.formHeader}>
            <Text className={styles.formTitle}>{editingGuestId ? '编辑宾客' : '添加宾客'}</Text>
            <Text className={styles.formClose} onClick={() => { setShowAddForm(false); setEditingGuestId(null); }}>✕</Text>
          </View>
          <View className={styles.formBody}>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入宾客姓名"
                value={addForm.name}
                onInput={(e) => setAddForm(prev => ({ ...prev, name: e.detail.value }))}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>电话</Text>
              <Input
                className={styles.formInput}
                placeholder="选填"
                value={addForm.phone}
                onInput={(e) => setAddForm(prev => ({ ...prev, phone: e.detail.value }))}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>桌号</Text>
              <Input
                className={styles.formInput}
                type="number"
                placeholder="留空待分配"
                value={addForm.tableNumber}
                onInput={(e) => setAddForm(prev => ({ ...prev, tableNumber: e.detail.value }))}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>过敏信息</Text>
              <Input
                className={styles.formInput}
                placeholder="如：花生、海鲜（用顿号分隔）"
                value={addForm.allergies}
                onInput={(e) => setAddForm(prev => ({ ...prev, allergies: e.detail.value }))}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>儿童餐</Text>
              <View
                className={classnames(styles.toggleSwitch, addForm.isChild && styles.active)}
                onClick={() => setAddForm(prev => ({ ...prev, isChild: !prev.isChild }))}
              />
            </View>
            <View className={styles.formActions}>
              <Button className={styles.formSubmitBtn} onClick={handleSubmitGuest}>
                {editingGuestId ? '保存修改' : '确认添加'}
              </Button>
            </View>
          </View>
        </View>
      )}

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
                  <Text className={styles.guestCount}>{getGuestsByTable(table.number).length} 人</Text>
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
                        onClick={() => handleEditGuest(guest)}
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
                      <Text key={guest.id} className={styles.guestBadge} onClick={() => handleEditGuest(guest)}>
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
                <View className={styles.guestActions}>
                  {guest.tableNumber ? (
                    <Text className={styles.tableBadge}>{guest.tableNumber}号桌</Text>
                  ) : (
                    <Text className={styles.unassigned}>待分配</Text>
                  )}
                  <Text className={styles.editLink} onClick={() => handleEditGuest(guest)}>编辑</Text>
                  <Text className={styles.deleteLink} onClick={() => handleDeleteGuest(guest.id)}>删除</Text>
                </View>
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

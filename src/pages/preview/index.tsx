import React, { useMemo, useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDesign } from '@/store/DesignContext';
import { mockMaterials } from '@/data/mock';
import styles from './index.module.scss';

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

const borderStyleMap: Record<string, string> = {
  b1: '2rpx solid #C9A96E',
  b2: '5rpx solid #C9A96E',
  b3: 'double 6rpx #C9A96E',
  b4: 'none'
};

interface ConsistencyIssue {
  type: 'warning' | 'error' | 'success';
  title: string;
  desc: string;
  action?: { label: string; url: string };
}

const PreviewPage: React.FC = () => {
  const {
    photoUrl, selectedBorder, showBorder, hasGoldFoil,
    titleText, nameText, dateText, textColor, selectedPattern,
    guests, tables, currentScheme, selectedStyle, selectedColor, selectedSize
  } = useDesign();

  const [showCheckDetail, setShowCheckDetail] = useState(false);

  const consistencyIssues = useMemo<ConsistencyIssue[]>(() => {
    const issues: ConsistencyIssue[] = [];

    if (!photoUrl) {
      issues.push({
        type: 'warning',
        title: '未上传照片',
        desc: '建议上传新人照片增加温馨感',
        action: { label: '去上传', url: '/pages/editor/index' }
      });
    }

    const unassignedGuests = guests.filter(g => !g.tableNumber);
    if (unassignedGuests.length > 0) {
      issues.push({
        type: 'error',
        title: `${unassignedGuests.length}位宾客未分桌`,
        desc: '请尽快完成所有宾客的分桌安排',
        action: { label: '去分桌', url: '/pages/guests/index' }
      });
    }

    if (!selectedStyle || !selectedColor || !selectedSize) {
      issues.push({
        type: 'warning',
        title: '基础信息不完整',
        desc: '请确认婚礼风格、色系和尺寸已选择',
        action: { label: '去设置', url: '/pages/home/index' }
      });
    }

    if (issues.length === 0) {
      issues.push({
        type: 'success',
        title: '设计一致性检查通过',
        desc: '所有物料风格、色系、信息保持一致'
      });
    }

    return issues;
  }, [photoUrl, guests, selectedStyle, selectedColor, selectedSize]);

  const hasErrors = consistencyIssues.some(i => i.type === 'error');
  const hasWarnings = consistencyIssues.some(i => i.type === 'warning');

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
    if (hasErrors) {
      Taro.showModal({
        title: '存在待处理问题',
        content: '有宾客未分桌，是否继续前往下单？',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/order/index' });
          }
        }
      });
      return;
    }
    Taro.navigateTo({ url: '/pages/order/index' });
  };

  const handleAction = (url: string) => {
    Taro.navigateTo({ url });
  };

  const handleCheckDetail = () => {
    setShowCheckDetail(true);
  };

  const handleCloseDetail = () => {
    setShowCheckDetail(false);
  };

  const currentBorderStyle = borderStyleMap[selectedBorder] || borderStyleMap.b1;
  const hasPhoto = !!photoUrl;

  const materialChecks = useMemo(() => {
    return mockMaterials.map(material => {
      const checks = [];
      checks.push({ label: '文字', ok: !!titleText && !!nameText && !!dateText });
      checks.push({ label: '照片', ok: material.type === 'seatingChart' ? true : !!photoUrl });
      checks.push({ label: '颜色', ok: !!textColor });
      checks.push({ label: '边框', ok: true });
      return { ...material, checks };
    });
  }, [titleText, nameText, dateText, photoUrl, textColor]);

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.header}>
        <Text className={styles.title}>整套物料预览</Text>
        <Text className={styles.subtitle}>
          {currentScheme ? `方案: ${currentScheme.name}` : '检查所有物料的设计一致性'}
        </Text>
      </View>

      <View
        className={classnames(
          styles.consistencyCheck,
          hasErrors && styles.hasError,
          hasWarnings && !hasErrors && styles.hasWarning
        )}
        onClick={handleCheckDetail}
      >
        <Text className={styles.icon}>
          {hasErrors ? '!' : hasWarnings ? '⚠' : '✓'}
        </Text>
        <View className={styles.content}>
          <Text className={styles.title}>
            {hasErrors ? '存在待处理问题' : hasWarnings ? '部分项目需要检查' : '设计风格统一'}
          </Text>
          <Text className={styles.desc}>
            {consistencyIssues.length}项检查结果，点击查看详情
          </Text>
        </View>
        <Text className={styles.arrow}>›</Text>
      </View>

      <View className={styles.designSummary}>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>风格</Text>
            <Text className={styles.summaryValue}>{selectedStyle?.name || '未选择'}</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>色系</Text>
            <View className={styles.colorDots}>
              <View className={styles.colorDot} style={{ background: selectedColor?.primary || '#C9A96E' }} />
              <Text className={styles.summaryValue}>{selectedColor?.name || '未选择'}</Text>
            </View>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>尺寸</Text>
            <Text className={styles.summaryValue}>{selectedSize?.name || '未选择'}</Text>
          </View>
        </View>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>边框</Text>
            <Text className={styles.summaryValue}>
              {showBorder ? borderNameMap[selectedBorder] || '细边框' : '无边框'}
            </Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>烫金</Text>
            <Text className={styles.summaryValue}>{hasGoldFoil ? '已开启' : '未开启'}</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryLabel}>照片</Text>
            <Text className={styles.summaryValue}>{photoUrl ? '已上传' : '未上传'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>
          <Text>物料清单</Text>
          <Text className={styles.count}>共 {mockMaterials.length} 项</Text>
        </View>
        <View className={styles.materialList}>
          {materialChecks.map(material => (
            <View key={material.id} className={styles.materialCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.typeTag}>{typeMap[material.type]}</Text>
                <View className={styles.checkTags}>
                  {material.checks.map((check, idx) => (
                    <Text
                      key={idx}
                      className={classnames(styles.checkTag, check.ok ? styles.ok : styles.no)}
                    >
                      {check.ok ? '✓' : '○'} {check.label}
                    </Text>
                  ))}
                </View>
                <Text className={styles.editBtn} onClick={() => handleEdit(material)}>编辑</Text>
              </View>
              <View className={styles.cardBody}>
                <View className={styles.previewCanvas}>
                  <View className={styles.canvasInner}>
                    {showBorder && selectedBorder !== 'b4' && (
                      <View
                        className={classnames(styles.previewBorder, hasGoldFoil && styles.previewGold)}
                        style={{ border: hasGoldFoil ? undefined : currentBorderStyle }}
                      />
                    )}
                    {showBorder && selectedBorder !== 'b4' && hasGoldFoil && (
                      <View
                        className={styles.previewBorderGold}
                        style={{ border: currentBorderStyle }}
                      />
                    )}
                    {selectedPattern !== 'p6' && (
                      <>
                        <View className={classnames(styles.previewCorner, styles.tl)} />
                        <View className={classnames(styles.previewCorner, styles.tr)} />
                        <View className={classnames(styles.previewCorner, styles.bl)} />
                        <View className={classnames(styles.previewCorner, styles.br)} />
                      </>
                    )}
                    {hasPhoto && photoUrl && material.type !== 'seatingChart' && (
                      <View className={styles.previewPhoto}>
                        <Image className={styles.previewPhotoImg} src={photoUrl} mode="aspectFill" />
                      </View>
                    )}
                    <Text className={styles.previewTitle} style={{ color: textColor }}>{titleText}</Text>
                    <Text
                      className={classnames(styles.previewName, hasGoldFoil && styles.previewGoldText)}
                      style={{ color: hasGoldFoil ? undefined : textColor }}
                    >
                      {nameText}
                    </Text>
                    <Text className={styles.previewSub}>{material.name}</Text>
                    <Text className={styles.previewDate} style={{ color: textColor }}>{dateText}</Text>
                  </View>
                </View>
                <View className={styles.info}>
                  <Text className={styles.name}>{material.name}</Text>
                  <Text className={styles.desc}>
                    {showBorder ? borderNameMap[selectedBorder] : '无边框'}
                    {hasGoldFoil ? ' · 烫金效果' : ''}
                    {photoUrl ? ' · 含照片' : ''}
                  </Text>
                  <Text className={classnames(styles.status, material.checks.every(c => c.ok) ? styles.ok : styles.pending)}>
                    {material.checks.every(c => c.ok) ? '✓ 设计完成' : '○ 需完善'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {showCheckDetail && (
        <View className={styles.checkOverlay} onClick={handleCloseDetail}>
          <View className={styles.checkPanel} onClick={(e) => e.stopPropagation()}>
            <View className={styles.checkHeader}>
              <Text className={styles.checkTitle}>一致性检查报告</Text>
              <Text className={styles.checkClose} onClick={handleCloseDetail}>✕</Text>
            </View>
            <ScrollView scrollY className={styles.checkBody}>
              {consistencyIssues.map((issue, idx) => (
                <View key={idx} className={classnames(styles.checkItem, styles[issue.type])}>
                  <Text className={styles.checkIcon}>
                    {issue.type === 'success' ? '✓' : issue.type === 'error' ? '!' : '⚠'}
                  </Text>
                  <View className={styles.checkContent}>
                    <Text className={styles.checkItemTitle}>{issue.title}</Text>
                    <Text className={styles.checkItemDesc}>{issue.desc}</Text>
                    {issue.action && (
                      <Text
                        className={styles.checkActionBtn}
                        onClick={() => handleAction(issue.action.url)}
                      >
                        {issue.action.label} →
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleCollaborate}>
          发起协作
        </Button>
        <Button className={styles.primaryBtn} onClick={handleOrder}>
          确认下单
        </Button>
      </View>
    </ScrollView>
  );
};

export default PreviewPage;

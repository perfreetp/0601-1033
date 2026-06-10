import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDesign } from '@/store/DesignContext';
import { weddingStyles, colorSchemes, sizeOptions } from '@/data/styles';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { selectedStyle, selectedColor, selectedSize, setSelectedStyle, setSelectedColor, setSelectedSize } = useDesign();
  const [, setForceUpdate] = useState(0);

  const canStart = selectedStyle && selectedColor && selectedSize;

  const handleStyleSelect = (style) => {
    console.log('[Home] 选择风格:', style.name);
    setSelectedStyle(style);
    setForceUpdate(n => n + 1);
  };

  const handleColorSelect = (color) => {
    console.log('[Home] 选择色系:', color.name);
    setSelectedColor(color);
    setForceUpdate(n => n + 1);
  };

  const handleSizeSelect = (size) => {
    console.log('[Home] 选择尺寸:', size.name);
    setSelectedSize(size);
    setForceUpdate(n => n + 1);
  };

  const handleStart = () => {
    if (!canStart) {
      Taro.showToast({
        title: '请完成所有选择',
        icon: 'none'
      });
      return;
    }
    console.log('[Home] 开始设计');
    Taro.switchTab({ url: '/pages/templates/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.header}>
        <Text className={styles.title}>
          <Text className={styles.accent}>✦</Text> 婚礼创意设计 <Text className={styles.accent}>✦</Text>
        </Text>
        <Text className={styles.subtitle}>为您定制独一无二的婚礼物料</Text>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.step}>1</Text>选择婚礼风格
          </Text>
          {selectedStyle && <Text className={styles.selectedText}>已选: {selectedStyle.name}</Text>}
        </View>
        <ScrollView scrollX className={styles.styleList} enhanced showScrollbar={false}>
          {weddingStyles.map(style => (
            <View
              key={style.id}
              className={classnames(styles.styleCard, selectedStyle?.id === style.id && styles.active)}
              onClick={() => handleStyleSelect(style)}
            >
              <Image className={styles.cover} src={style.coverImage} mode="aspectFill" />
              <View className={styles.info}>
                <Text className={styles.name}>{style.name}</Text>
                <Text className={styles.desc}>{style.description}</Text>
                <View className={styles.tags}>
                  {style.tags.map((tag, idx) => (
                    <Text key={idx} className={styles.tag}>{tag}</Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.step}>2</Text>选择配色方案
          </Text>
          {selectedColor && <Text className={styles.selectedText}>已选: {selectedColor.name}</Text>}
        </View>
        <View className={styles.colorList}>
          {colorSchemes.map(color => (
            <View
              key={color.id}
              className={classnames(styles.colorCard, selectedColor?.id === color.id && styles.active)}
              onClick={() => handleColorSelect(color)}
            >
              <View className={styles.colorPreview}>
                {color.preview.map((c, idx) => (
                  <View key={idx} className={styles.colorBlock} style={{ background: c }} />
                ))}
              </View>
              <Text className={styles.colorName}>{color.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.step}>3</Text>选择物料尺寸
          </Text>
          {selectedSize && <Text className={styles.selectedText}>已选: {selectedSize.name}</Text>}
        </View>
        <View className={styles.sizeList}>
          {sizeOptions.map(size => (
            <View
              key={size.id}
              className={classnames(styles.sizeCard, selectedSize?.id === size.id && styles.active)}
              onClick={() => handleSizeSelect(size)}
            >
              <Text className={styles.sizeName}>{size.name}</Text>
              <Text className={styles.sizeValue}>{size.width} × {size.height} {size.unit}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.startBtn, !canStart && styles.disabled)}
          onClick={handleStart}
        >
          {canStart ? '开始设计' : '请完成选择'}
        </Button>
      </View>
    </View>
  );
};

export default HomePage;

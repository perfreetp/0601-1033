import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDesign } from '@/store/DesignContext';
import { templates, categoryList } from '@/data/templates';
import styles from './index.module.scss';

const TemplatesPage: React.FC = () => {
  const { selectedStyle, selectedColor, selectedSize, setSelectedTemplate } = useDesign();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    console.log('[Templates] 切换分类:', categoryId);
    setActiveCategory(categoryId);
  };

  const handleTemplateSelect = (template) => {
    console.log('[Templates] 选择模板:', template.name);
    setSelectedTemplate(template);
    Taro.navigateTo({ url: '/pages/editor/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.selectedBar}>
        <View className={styles.barContent}>
          {selectedStyle && (
            <View className={styles.item}>
              <Text className={styles.label}>风格:</Text>
              <Text className={styles.value}>{selectedStyle.name}</Text>
            </View>
          )}
          {selectedColor && (
            <View className={styles.item}>
              <Text className={styles.label}>色系:</Text>
              <Text className={styles.value}>{selectedColor.name}</Text>
            </View>
          )}
          {selectedSize && (
            <View className={styles.item}>
              <Text className={styles.label}>尺寸:</Text>
              <Text className={styles.value}>{selectedSize.name}</Text>
            </View>
          )}
          {!selectedStyle && !selectedColor && !selectedSize && (
            <Text style={{ fontSize: '24rpx', color: '#9E9790' }}>请先在首页选择设计偏好</Text>
          )}
        </View>
      </View>

      <View className={styles.categoryTabs}>
        <ScrollView scrollX className={styles.tabList} enhanced showScrollbar={false}>
          {categoryList.map(cat => (
            <View
              key={cat.id}
              className={classnames(styles.tabItem, activeCategory === cat.id && styles.active)}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <Text>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {filteredTemplates.length > 0 ? (
        <View className={styles.templateGrid}>
          {filteredTemplates.map(template => (
            <View
              key={template.id}
              className={styles.templateCard}
              onClick={() => handleTemplateSelect(template)}
            >
              <View className={styles.coverWrap}>
                <Image className={styles.cover} src={template.coverImage} mode="aspectFill" />
                {template.isHot && <Text className={classnames(styles.badge, styles.hot)}>热门</Text>}
                {template.isNew && <Text className={classnames(styles.badge, styles.new)}>新品</Text>}
                <Text className={styles.categoryBadge}>{template.categoryName}</Text>
              </View>
              <View className={styles.info}>
                <Text className={styles.name}>{template.name}</Text>
                <Text className={styles.style}>{template.style}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.icon}>📋</Text>
          <Text className={styles.text}>暂无该分类的模板</Text>
        </View>
      )}
    </View>
  );
};

export default TemplatesPage;

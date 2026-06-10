import React, { useState } from 'react';
import { View, Text, Input, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDesign } from '@/store/DesignContext';
import { colorSchemes } from '@/data/styles';
import styles from './index.module.scss';

const fontList = [
  { id: 'font-1', name: '思源宋体' },
  { id: 'font-2', name: '思源黑体' },
  { id: 'font-3', name: '楷体' },
  { id: 'font-4', name: '行楷' }
];

const patternList = [
  { id: 'p1', name: '简约边角' },
  { id: 'p2', name: '花卉图案' },
  { id: 'p3', name: '几何线条' },
  { id: 'p4', name: '藤蔓花纹' },
  { id: 'p5', name: '波浪曲线' },
  { id: 'p6', name: '无图案' }
];

const borderList = [
  { id: 'b1', name: '细边框' },
  { id: 'b2', name: '粗边框' },
  { id: 'b3', name: '双线边框' },
  { id: 'b4', name: '无边框' }
];

const borderStyleMap: Record<string, string> = {
  b1: '2rpx solid #C9A96E',
  b2: '5rpx solid #C9A96E',
  b3: 'double 6rpx #C9A96E',
  b4: 'none'
};

const EditorPage: React.FC = () => {
  const {
    selectedTemplate, photoUrl, setPhotoUrl,
    selectedBorder, setSelectedBorder,
    showBorder, setShowBorder,
    hasGoldFoil, setHasGoldFoil
  } = useDesign();

  const [titleText, setTitleText] = useState('Mr & Mrs');
  const [nameText, setNameText] = useState('王浩 & 李静');
  const [dateText, setDateText] = useState('2024.06.18');
  const [selectedFont, setSelectedFont] = useState('font-1');
  const [selectedColor, setSelectedColor] = useState(colorSchemes[0].primary);
  const [selectedPattern, setSelectedPattern] = useState('p1');
  const [hasPhoto, setHasPhoto] = useState(!!photoUrl);

  const handleChooseImage = () => {
    console.log('[Editor] 选择照片');
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const url = res.tempFilePaths[0];
        console.log('[Editor] 图片选择成功:', url);
        setPhotoUrl(url);
        setHasPhoto(true);
      },
      fail: (err) => {
        console.error('[Editor] 图片选择失败:', err);
      }
    });
  };

  const handleSave = () => {
    console.log('[Editor] 保存设计');
    Taro.showToast({
      title: '设计已保存',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/preview/index' });
    }, 1500);
  };

  const handleGuests = () => {
    Taro.navigateTo({ url: '/pages/guests/index' });
  };

  const handleBorderChange = (borderId: string) => {
    console.log('[Editor] 切换边框样式:', borderId);
    setSelectedBorder(borderId);
  };

  const handleToggleShowBorder = () => {
    setShowBorder(!showBorder);
  };

  const handleToggleGoldFoil = () => {
    setHasGoldFoil(!hasGoldFoil);
  };

  const handleTogglePhoto = () => {
    const next = !hasPhoto;
    setHasPhoto(next);
    if (!next) {
      setPhotoUrl('');
    }
  };

  const currentBorderStyle = borderStyleMap[selectedBorder] || borderStyleMap.b1;

  return (
    <View className={styles.pageContainer}>
      <View className={styles.previewArea}>
        <View className={styles.designCanvas}>
          <View className={styles.canvasInner}>
            {showBorder && selectedBorder !== 'b4' && (
              <View
                className={classnames(styles.borderDecor, hasGoldFoil && styles.goldFoil)}
                style={{ border: hasGoldFoil ? undefined : currentBorderStyle }}
              />
            )}
            {showBorder && selectedBorder !== 'b4' && hasGoldFoil && (
              <View
                className={styles.borderDecorGold}
                style={{ border: currentBorderStyle }}
              />
            )}
            {selectedPattern !== 'p6' && (
              <>
                <View className={classnames(styles.cornerPattern, styles.topLeft)} />
                <View className={classnames(styles.cornerPattern, styles.topRight)} />
                <View className={classnames(styles.cornerPattern, styles.bottomLeft)} />
                <View className={classnames(styles.cornerPattern, styles.bottomRight)} />
              </>
            )}
            {hasPhoto && photoUrl && (
              <View className={styles.photoArea}>
                <Image className={styles.photoImg} src={photoUrl} mode="aspectFill" />
              </View>
            )}
            {hasPhoto && !photoUrl && (
              <View className={styles.photoArea}>
                <Text className={styles.placeholder}>♥</Text>
              </View>
            )}
            <Text className={styles.titleText}>{titleText}</Text>
            <Text className={classnames(styles.nameText, hasGoldFoil && styles.goldFoil)}>{nameText}</Text>
            <Text className={styles.subText}>{selectedTemplate?.name || '桌卡设计'}</Text>
            <Text className={styles.dateText}>{dateText}</Text>
          </View>
        </View>
      </View>

      <View className={styles.editSections}>
        <View className={styles.editSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.title}><Text className={styles.icon}>📝</Text>文字编辑</Text>
          </View>
          <View className={styles.sectionBody}>
            <View className={styles.textInputs}>
              <View className={styles.inputItem}>
                <Text className={styles.label}>标题</Text>
                <Input className={styles.input} value={titleText} onInput={(e) => setTitleText(e.detail.value)} />
              </View>
              <View className={styles.inputItem}>
                <Text className={styles.label}>新人姓名</Text>
                <Input className={styles.input} value={nameText} onInput={(e) => setNameText(e.detail.value)} />
              </View>
              <View className={styles.inputItem}>
                <Text className={styles.label}>日期</Text>
                <Input className={styles.input} value={dateText} onInput={(e) => setDateText(e.detail.value)} />
              </View>
            </View>
            <View style={{ marginTop: '24rpx' }}>
              <Text className={styles.label} style={{ fontSize: '24rpx', color: '#9E9790', marginBottom: '16rpx', display: 'block' }}>字体</Text>
              <View className={styles.fontOptions}>
                {fontList.map(font => (
                  <Text
                    key={font.id}
                    className={classnames(styles.fontItem, selectedFont === font.id && styles.active)}
                    onClick={() => setSelectedFont(font.id)}
                  >
                    {font.name}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.editSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.title}><Text className={styles.icon}>🎨</Text>文字颜色</Text>
          </View>
          <View className={styles.sectionBody}>
            <View className={styles.colorOptions}>
              {colorSchemes.map(scheme => (
                <View
                  key={scheme.id}
                  className={classnames(styles.colorItem, selectedColor === scheme.primary && styles.active)}
                  style={{ background: scheme.primary }}
                  onClick={() => setSelectedColor(scheme.primary)}
                />
              ))}
            </View>
          </View>
        </View>

        <View className={styles.editSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.title}><Text className={styles.icon}>✨</Text>烫金效果</Text>
          </View>
          <View className={styles.sectionBody}>
            <View className={styles.toggleRow}>
              <Text className={styles.toggleLabel}>
                开启烫金效果
                <Text className={styles.desc}>模拟真实烫金工艺的金属光泽</Text>
              </Text>
              <View
                className={classnames(styles.toggleSwitch, hasGoldFoil && styles.active)}
                onClick={handleToggleGoldFoil}
              />
            </View>
          </View>
        </View>

        <View className={styles.editSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.title}><Text className={styles.icon}>🖼️</Text>图案装饰</Text>
          </View>
          <View className={styles.sectionBody}>
            <View className={styles.patternOptions}>
              {patternList.map(pattern => (
                <View
                  key={pattern.id}
                  className={classnames(styles.patternItem, selectedPattern === pattern.id && styles.active)}
                  onClick={() => setSelectedPattern(pattern.id)}
                >
                  <Text className={styles.patternName}>{pattern.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.editSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.title}><Text className={styles.icon}>▭</Text>边框样式</Text>
          </View>
          <View className={styles.sectionBody}>
            <View className={styles.toggleRow} style={{ marginBottom: '24rpx' }}>
              <Text className={styles.toggleLabel}>显示边框</Text>
              <View
                className={classnames(styles.toggleSwitch, showBorder && styles.active)}
                onClick={handleToggleShowBorder}
              />
            </View>
            <View className={styles.borderOptions}>
              {borderList.map(border => (
                <View
                  key={border.id}
                  className={classnames(styles.borderItem, selectedBorder === border.id && styles.active)}
                  onClick={() => handleBorderChange(border.id)}
                >
                  <View className={styles.borderPreview}>
                    <View style={{
                      width: border.id === 'b4' ? '0' : '60rpx',
                      height: border.id === 'b4' ? '0' : '40rpx',
                      border: borderStyleMap[border.id]
                    }} />
                  </View>
                  <Text className={styles.borderName}>{border.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.editSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.title}><Text className={styles.icon}>📷</Text>照片上传</Text>
          </View>
          <View className={styles.sectionBody}>
            <View className={styles.toggleRow} style={{ marginBottom: '24rpx' }}>
              <Text className={styles.toggleLabel}>显示照片</Text>
              <View
                className={classnames(styles.toggleSwitch, hasPhoto && styles.active)}
                onClick={handleTogglePhoto}
              />
            </View>
            <View className={styles.photoUpload} onClick={handleChooseImage}>
              {photoUrl ? (
                <Image src={photoUrl} mode="aspectFill" style={{ width: '200rpx', height: '200rpx', borderRadius: '12rpx' }} />
              ) : (
                <>
                  <Text className={styles.uploadIcon}>+</Text>
                  <Text className={styles.uploadText}>点击上传照片</Text>
                  <Text className={styles.uploadHint}>建议使用正方形高清照片</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleGuests}>
          宾客管理
        </Button>
        <Button className={styles.primaryBtn} onClick={handleSave}>
          保存设计
        </Button>
      </View>
    </View>
  );
};

export default EditorPage;

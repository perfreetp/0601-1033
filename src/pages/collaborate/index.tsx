import React, { useState } from 'react';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockComments } from '@/data/mock';
import styles from './index.module.scss';

const collaborators = [
  { id: '1', name: '新娘李静', avatar: 'https://picsum.photos/id/64/100/100', status: 'confirmed' },
  { id: '2', name: '新郎王浩', avatar: 'https://picsum.photos/id/91/100/100', status: 'pending' },
  { id: '3', name: '策划师Luna', avatar: 'https://picsum.photos/id/177/100/100', status: 'confirmed' }
];

const checkItems = [
  { id: 'c1', label: '设计风格确认', desc: '确认整体风格、色系与婚礼主题一致' },
  { id: 'c2', label: '文字内容确认', desc: '确认新人姓名、日期等所有文字信息准确' },
  { id: 'c3', label: '宾客信息确认', desc: '确认宾客名单、分桌、特殊饮食要求' },
  { id: 'c4', label: '物料数量确认', desc: '确认桌卡、菜单等物料的制作数量' }
];

const CollaboratePage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>(['c1', 'c2']);
  const [comments, setComments] = useState(mockComments);
  const [inputText, setInputText] = useState('');

  const toggleCheck = (id: string) => {
    console.log('[Collaborate] 勾选项目:', id);
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSendComment = () => {
    if (!inputText.trim()) {
      Taro.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
    console.log('[Collaborate] 发送评论:', inputText);
    const newComment = {
      id: `c${Date.now()}`,
      author: '策划师·Luna',
      avatar: 'https://picsum.photos/id/177/100/100',
      content: inputText,
      time: new Date().toLocaleString(),
      isResolved: false
    };
    setComments(prev => [...prev, newComment]);
    setInputText('');
    Taro.showToast({ title: '已发送', icon: 'success' });
  };

  const handleAddComment = () => {
    console.log('[Collaborate] 添加评论');
  };

  const handleShare = () => {
    console.log('[Collaborate] 分享协作链接');
    Taro.showToast({
      title: '已生成协作链接',
      icon: 'success'
    });
  };

  const handleConfirm = () => {
    if (checkedItems.length < checkItems.length) {
      Taro.showModal({
        title: '提示',
        content: '还有确认项未完成，确定继续吗？',
        success: (res) => {
          if (res.confirm) {
            console.log('[Collaborate] 确认设计');
            Taro.navigateTo({ url: '/pages/order/index' });
          }
        }
      });
      return;
    }
    console.log('[Collaborate] 所有项已确认');
    Taro.navigateTo({ url: '/pages/order/index' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.header}>
        <Text className={styles.title}>协作确认</Text>
        <Text className={styles.subtitle}>邀请新人参与确认，确保设计完美呈现</Text>
      </View>

      <View className={styles.collaborators}>
        <Text className={styles.sectionTitle}>参与人</Text>
        <View className={styles.collabList}>
          {collaborators.map(person => (
            <View key={person.id} className={styles.collabItem}>
              <View className={styles.avatar}>
                <Image className={styles.avatarImg} src={person.avatar} mode="aspectFill" />
                <View className={`${styles.status} ${styles[person.status]}`} />
              </View>
              <Text className={styles.name}>{person.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.checkSection}>
        <Text className={styles.sectionTitle}>确认清单</Text>
        <View className={styles.checkList}>
          {checkItems.map(item => (
            <View key={item.id} className={styles.checkItem} onClick={() => toggleCheck(item.id)}>
              <View className={classnames(styles.checkbox, checkedItems.includes(item.id) && styles.checked)} />
              <View className={styles.checkContent}>
                <Text className={styles.label}>{item.label}</Text>
                <Text className={styles.desc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.commentsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            评论交流
            <Text className={styles.count}>({comments.length})</Text>
          </Text>
          <Text className={styles.addBtn} onClick={handleAddComment}>+ 添加</Text>
        </View>
        <View className={styles.commentList}>
          {comments.map(comment => (
            <View key={comment.id} className={styles.commentItem}>
              <View className={styles.avatar}>
                <Image className={styles.avatarImg} src={comment.avatar} mode="aspectFill" />
              </View>
              <View className={styles.commentBody}>
                <View className={styles.commentHeader}>
                  <Text className={styles.author}>{comment.author}</Text>
                  <Text className={`${styles.statusTag} ${styles[comment.isResolved ? 'resolved' : 'pending']}`}>
                    {comment.isResolved ? '已处理' : '待处理'}
                  </Text>
                </View>
                <Text className={styles.content}>{comment.content}</Text>
                <Text className={styles.time}>{comment.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.inputBar}>
        <Input
          className={styles.input}
          placeholder="输入评论内容..."
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          confirmType="send"
          onConfirm={handleSendComment}
        />
        <Button className={styles.sendBtn} onClick={handleSendComment}>
          发送
        </Button>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleShare}>
          分享链接
        </Button>
        <Button className={styles.primaryBtn} onClick={handleConfirm}>
          确认并下单
        </Button>
      </View>
    </View>
  );
};

export default CollaboratePage;

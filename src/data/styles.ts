import { WeddingStyle, ColorScheme, SizeOption } from '@/types';

export const weddingStyles: WeddingStyle[] = [
  {
    id: 'style-1',
    name: '轻奢法式',
    description: '优雅浪漫的法式风情，精致花纹与柔和线条',
    coverImage: 'https://picsum.photos/id/103/400/500',
    tags: ['优雅', '浪漫', '精致']
  },
  {
    id: 'style-2',
    name: '中式古典',
    description: '传统东方美学，红金配色尽显典雅大气',
    coverImage: 'https://picsum.photos/id/225/400/500',
    tags: ['传统', '大气', '喜庆']
  },
  {
    id: 'style-3',
    name: '简约现代',
    description: '极简主义设计，干净利落的现代美感',
    coverImage: 'https://picsum.photos/id/230/400/500',
    tags: ['简约', '现代', '时尚']
  },
  {
    id: 'style-4',
    name: '森系自然',
    description: '清新自然的森林风格，绿意盎然的浪漫',
    coverImage: 'https://picsum.photos/id/250/400/500',
    tags: ['清新', '自然', '绿意']
  },
  {
    id: 'style-5',
    name: '复古欧式',
    description: '古典欧式宫廷风，华丽繁复的贵族气质',
    coverImage: 'https://picsum.photos/id/326/400/500',
    tags: ['复古', '华丽', '宫廷']
  },
  {
    id: 'style-6',
    name: '梦幻公主',
    description: '粉色梦幻主题，每个女孩心中的公主梦',
    coverImage: 'https://picsum.photos/id/582/400/500',
    tags: ['梦幻', '粉色', '甜美']
  }
];

export const colorSchemes: ColorScheme[] = [
  {
    id: 'color-1',
    name: '香槟金',
    primary: '#C9A96E',
    secondary: '#E8D4B8',
    accent: '#8B6914',
    preview: ['#C9A96E', '#E8D4B8', '#8B6914', '#FBF7F0']
  },
  {
    id: 'color-2',
    name: '玫瑰粉',
    primary: '#E8B4BC',
    secondary: '#F5D5DC',
    accent: '#C97B8A',
    preview: ['#E8B4BC', '#F5D5DC', '#C97B8A', '#FFF5F7']
  },
  {
    id: 'color-3',
    name: '中国红',
    primary: '#C41E3A',
    secondary: '#E85D6E',
    accent: '#8B0A1A',
    preview: ['#C41E3A', '#E85D6E', '#FFD700', '#FFF0F0']
  },
  {
    id: 'color-4',
    name: '森叶绿',
    primary: '#5B8A72',
    secondary: '#A8C8B0',
    accent: '#3D5A4A',
    preview: ['#5B8A72', '#A8C8B0', '#3D5A4A', '#F0F7F3']
  },
  {
    id: 'color-5',
    name: '雾霾蓝',
    primary: '#7D9EC0',
    secondary: '#B8CFE3',
    accent: '#4A6B8A',
    preview: ['#7D9EC0', '#B8CFE3', '#4A6B8A', '#F0F5FA']
  },
  {
    id: 'color-6',
    name: '典雅紫',
    primary: '#9B7CB6',
    secondary: '#C9B8DE',
    accent: '#6B4D8A',
    preview: ['#9B7CB6', '#C9B8DE', '#6B4D8A', '#F7F3FB']
  }
];

export const sizeOptions: SizeOption[] = [
  { id: 'size-1', name: 'A5 桌卡', width: 148, height: 210, unit: 'mm' },
  { id: 'size-2', name: 'A4 席位图', width: 210, height: 297, unit: 'mm' },
  { id: 'size-3', name: '60x90 迎宾牌', width: 600, height: 900, unit: 'mm' },
  { id: 'size-4', name: 'A5 菜单', width: 148, height: 210, unit: 'mm' },
  { id: 'size-5', name: '方形桌卡', width: 150, height: 150, unit: 'mm' },
  { id: 'size-6', name: '长桌卡', width: 100, height: 210, unit: 'mm' }
];

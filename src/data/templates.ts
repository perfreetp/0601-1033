import { Template } from '@/types';

export const templates: Template[] = [
  {
    id: 'tpl-001',
    name: '花语芬芳桌卡',
    category: 'tableCard',
    categoryName: '桌卡',
    style: '轻奢法式',
    coverImage: 'https://picsum.photos/id/103/300/400',
    isHot: true
  },
  {
    id: 'tpl-002',
    name: '古典喜字桌卡',
    category: 'tableCard',
    categoryName: '桌卡',
    style: '中式古典',
    coverImage: 'https://picsum.photos/id/225/300/400',
    isHot: true
  },
  {
    id: 'tpl-003',
    name: '简约线条桌卡',
    category: 'tableCard',
    categoryName: '桌卡',
    style: '简约现代',
    coverImage: 'https://picsum.photos/id/230/300/400',
    isNew: true
  },
  {
    id: 'tpl-004',
    name: '绿叶清新桌卡',
    category: 'tableCard',
    categoryName: '桌卡',
    style: '森系自然',
    coverImage: 'https://picsum.photos/id/250/300/400'
  },
  {
    id: 'tpl-005',
    name: '欧式花纹席位图',
    category: 'seatingChart',
    categoryName: '席位图',
    style: '复古欧式',
    coverImage: 'https://picsum.photos/id/326/400/500',
    isHot: true
  },
  {
    id: 'tpl-006',
    name: '龙凤呈祥席位图',
    category: 'seatingChart',
    categoryName: '席位图',
    style: '中式古典',
    coverImage: 'https://picsum.photos/id/292/400/500'
  },
  {
    id: 'tpl-007',
    name: '现代几何席位图',
    category: 'seatingChart',
    categoryName: '席位图',
    style: '简约现代',
    coverImage: 'https://picsum.photos/id/401/400/500',
    isNew: true
  },
  {
    id: 'tpl-008',
    name: '花环浪漫席位图',
    category: 'seatingChart',
    categoryName: '席位图',
    style: '轻奢法式',
    coverImage: 'https://picsum.photos/id/431/400/500'
  },
  {
    id: 'tpl-009',
    name: '金色浪漫迎宾牌',
    category: 'welcomeBoard',
    categoryName: '迎宾牌',
    style: '轻奢法式',
    coverImage: 'https://picsum.photos/id/570/500/700',
    isHot: true
  },
  {
    id: 'tpl-010',
    name: '喜结良缘迎宾牌',
    category: 'welcomeBoard',
    categoryName: '迎宾牌',
    style: '中式古典',
    coverImage: 'https://picsum.photos/id/580/500/700'
  },
  {
    id: 'tpl-011',
    name: '简约字母迎宾牌',
    category: 'welcomeBoard',
    categoryName: '迎宾牌',
    style: '简约现代',
    coverImage: 'https://picsum.photos/id/625/500/700',
    isNew: true
  },
  {
    id: 'tpl-012',
    name: '花藤缠绕迎宾牌',
    category: 'welcomeBoard',
    categoryName: '迎宾牌',
    style: '森系自然',
    coverImage: 'https://picsum.photos/id/835/500/700'
  },
  {
    id: 'tpl-013',
    name: '优雅花卉菜单',
    category: 'menu',
    categoryName: '菜单',
    style: '轻奢法式',
    coverImage: 'https://picsum.photos/id/1080/300/450'
  },
  {
    id: 'tpl-014',
    name: '中式如意菜单',
    category: 'menu',
    categoryName: '菜单',
    style: '中式古典',
    coverImage: 'https://picsum.photos/id/582/300/450',
    isHot: true
  },
  {
    id: 'tpl-015',
    name: '极简排版菜单',
    category: 'menu',
    categoryName: '菜单',
    style: '简约现代',
    coverImage: 'https://picsum.photos/id/598/300/450',
    isNew: true
  },
  {
    id: 'tpl-016',
    name: '绿意盎然菜单',
    category: 'menu',
    categoryName: '菜单',
    style: '森系自然',
    coverImage: 'https://picsum.photos/id/220/300/450'
  }
];

export const categoryList = [
  { id: 'all', name: '全部' },
  { id: 'tableCard', name: '桌卡' },
  { id: 'seatingChart', name: '席位图' },
  { id: 'welcomeBoard', name: '迎宾牌' },
  { id: 'menu', name: '菜单' }
];

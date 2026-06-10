import { Guest, Table, Comment, PaperOption, HistoryOrder, BlessingTemplate, BrandTemplate, MaterialItem } from '@/types';

export const mockGuests: Guest[] = [
  { id: 'g1', name: '张伟', tableNumber: 1, isChild: false, allergies: [], phone: '138****1234' },
  { id: 'g2', name: '李娜', tableNumber: 1, isChild: false, allergies: ['海鲜'], phone: '139****5678' },
  { id: 'g3', name: '王小明', tableNumber: 1, isChild: true, allergies: ['花生'], phone: '' },
  { id: 'g4', name: '刘洋', tableNumber: 2, isChild: false, allergies: [], phone: '137****9012' },
  { id: 'g5', name: '陈静', tableNumber: 2, isChild: false, allergies: ['辛辣'], phone: '136****3456' },
  { id: 'g6', name: '赵强', tableNumber: 2, isChild: false, allergies: [], phone: '135****7890' },
  { id: 'g7', name: '孙悦', tableNumber: 3, isChild: false, allergies: [], phone: '134****2345' },
  { id: 'g8', name: '周子涵', tableNumber: 3, isChild: true, allergies: [], phone: '' },
  { id: 'g9', name: '吴磊', tableNumber: 3, isChild: false, allergies: ['芒果'], phone: '133****6789' },
  { id: 'g10', name: '郑芳', tableNumber: 3, isChild: false, allergies: [], phone: '132****0123' },
  { id: 'g11', name: '黄磊', tableNumber: undefined, isChild: false, allergies: [], phone: '131****4567' },
  { id: 'g12', name: '林婷', tableNumber: undefined, isChild: false, allergies: [], phone: '130****8901' }
];

export const mockTables: Table[] = [
  { id: 'tbl-1', number: 1, name: '主桌', guestIds: ['g1', 'g2', 'g3'] },
  { id: 'tbl-2', number: 2, name: '亲友桌', guestIds: ['g4', 'g5', 'g6'] },
  { id: 'tbl-3', number: 3, name: '同事桌', guestIds: ['g7', 'g8', 'g9', 'g10'] }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    author: '新娘-李静',
    avatar: 'https://picsum.photos/id/64/100/100',
    content: '桌卡上的名字能不能换一种更优雅的字体？现在的感觉有点太普通了。',
    time: '2024-01-15 14:30',
    isResolved: false
  },
  {
    id: 'c2',
    author: '新郎-王浩',
    avatar: 'https://picsum.photos/id/91/100/100',
    content: '迎宾牌的烫金效果做得很好看，保持这样就可以了！',
    time: '2024-01-15 15:20',
    isResolved: true
  },
  {
    id: 'c3',
    author: '新娘-李静',
    avatar: 'https://picsum.photos/id/64/100/100',
    content: '席位图上能不能把亲戚和同事的区域用不同颜色区分一下？',
    time: '2024-01-15 16:45',
    isResolved: false
  }
];

export const paperOptions: PaperOption[] = [
  { id: 'paper-1', name: '象牙卡纸', description: '300g 象牙白色，质感温润', price: 5, color: '#FBF7F0' },
  { id: 'paper-2', name: '米白特种纸', description: '250g 米白色，纹路细腻', price: 6, color: '#F5EFE1' },
  { id: 'paper-3', name: '纯白铜版纸', description: '300g 亮白色，色彩饱满', price: 4, color: '#FFFFFF' },
  { id: 'paper-4', name: '珠光纸', description: '280g 带珍珠光泽，高级感', price: 8, color: '#FAF8F5' },
  { id: 'paper-5', name: '牛皮纸', description: '250g 复古棕黄色，自然风', price: 5, color: '#D4B896' }
];

export const mockHistoryOrders: HistoryOrder[] = [
  {
    id: 'order-1',
    orderNo: 'WD20240115001',
    weddingName: '王浩 & 李静 婚礼物料',
    date: '2024-01-15',
    status: 'producing',
    statusText: '制作中',
    totalAmount: 2680,
    items: [
      { materialId: 'm1', materialName: '桌卡', quantity: 20, paperId: 'paper-1', unitPrice: 8 },
      { materialId: 'm2', materialName: '席位图', quantity: 2, paperId: 'paper-4', unitPrice: 120 },
      { materialId: 'm3', materialName: '迎宾牌', quantity: 1, paperId: 'paper-2', unitPrice: 280 }
    ]
  },
  {
    id: 'order-2',
    orderNo: 'WD20231220002',
    weddingName: '陈明 & 张雅 婚礼物料',
    date: '2023-12-20',
    status: 'completed',
    statusText: '已完成',
    totalAmount: 3200,
    items: [
      { materialId: 'm1', materialName: '桌卡', quantity: 30, paperId: 'paper-2', unitPrice: 10 },
      { materialId: 'm2', materialName: '菜单', quantity: 30, paperId: 'paper-1', unitPrice: 6 }
    ]
  }
];

export const mockBlessings: BlessingTemplate[] = [
  {
    id: 'b1',
    title: '经典祝福语',
    content: '愿你们的爱情如钻石般永恒闪耀，携手走过人生的每一个美好瞬间。新婚快乐，百年好合！',
    category: '通用',
    isFavorite: true
  },
  {
    id: 'b2',
    title: '浪漫诗意',
    content: '愿为双飞鸿，比翼共翱翔。金玉满堂日，恩爱岁月长。',
    category: '中式',
    isFavorite: true
  },
  {
    id: 'b3',
    title: '温馨简洁',
    content: '执子之手，与子偕老。愿你们每一天都如新婚般甜蜜幸福。',
    category: '通用',
    isFavorite: false
  },
  {
    id: 'b4',
    title: '西式祝福',
    content: 'May your love story be as beautiful as the wedding you have planned. Wishing you a lifetime of happiness together.',
    category: '西式',
    isFavorite: false
  }
];

export const mockBrandTemplates: BrandTemplate[] = [
  {
    id: 'bt1',
    name: '法式浪漫系列',
    coverImage: 'https://picsum.photos/id/103/300/400',
    updateTime: '2024-01-10',
    style: '轻奢法式'
  },
  {
    id: 'bt2',
    name: '中式古典系列',
    coverImage: 'https://picsum.photos/id/225/300/400',
    updateTime: '2024-01-08',
    style: '中式古典'
  },
  {
    id: 'bt3',
    name: '森系清新系列',
    coverImage: 'https://picsum.photos/id/250/300/400',
    updateTime: '2024-01-05',
    style: '森系自然'
  }
];

export const mockMaterials: MaterialItem[] = [
  {
    id: 'mat-1',
    type: 'tableCard',
    name: '1号桌 桌卡',
    previewImage: 'https://picsum.photos/id/103/300/400',
    elements: []
  },
  {
    id: 'mat-2',
    type: 'seatingChart',
    name: '婚礼席位图',
    previewImage: 'https://picsum.photos/id/326/400/500',
    elements: []
  },
  {
    id: 'mat-3',
    type: 'welcomeBoard',
    name: '主迎宾牌',
    previewImage: 'https://picsum.photos/id/570/500/700',
    elements: []
  },
  {
    id: 'mat-4',
    type: 'menu',
    name: '婚宴菜单',
    previewImage: 'https://picsum.photos/id/1080/300/450',
    elements: []
  }
];

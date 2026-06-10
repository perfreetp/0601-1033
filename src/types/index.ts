export interface WeddingStyle {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  tags: string[];
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  preview: string[];
}

export interface SizeOption {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'tableCard' | 'seatingChart' | 'welcomeBoard' | 'menu';
  categoryName: string;
  style: string;
  coverImage: string;
  isHot?: boolean;
  isNew?: boolean;
}

export interface Guest {
  id: string;
  name: string;
  tableNumber?: number;
  isChild: boolean;
  allergies: string[];
  phone?: string;
  notes?: string;
}

export interface Table {
  id: string;
  number: number;
  name: string;
  guestIds: string[];
}

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'pattern' | 'border';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  hasGoldFoil?: boolean;
}

export interface MaterialItem {
  id: string;
  type: 'tableCard' | 'seatingChart' | 'welcomeBoard' | 'menu';
  name: string;
  previewImage: string;
  elements: DesignElement[];
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  isResolved: boolean;
}

export interface PaperOption {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
}

export interface OrderItem {
  materialId: string;
  materialName: string;
  quantity: number;
  paperId: string;
  unitPrice: number;
}

export interface HistoryOrder {
  id: string;
  orderNo: string;
  weddingName: string;
  date: string;
  status: 'pending' | 'producing' | 'shipped' | 'completed';
  statusText: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface BlessingTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
}

export interface BrandTemplate {
  id: string;
  name: string;
  coverImage: string;
  updateTime: string;
  style: string;
}

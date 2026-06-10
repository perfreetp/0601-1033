import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { WeddingStyle, ColorScheme, SizeOption, Template, Guest, Table, HistoryOrder } from '@/types';
import { mockGuests, mockTables, mockHistoryOrders } from '@/data/mock';
import { generateId } from '@/utils';

export interface DesignState {
  selectedStyle: WeddingStyle | null;
  selectedColor: ColorScheme | null;
  selectedSize: SizeOption | null;
  selectedTemplate: Template | null;
  photoUrl: string;
  selectedBorder: string;
  showBorder: boolean;
  hasGoldFoil: boolean;
  guests: Guest[];
  tables: Table[];
  historyOrders: HistoryOrder[];
  setSelectedStyle: (style: WeddingStyle | null) => void;
  setSelectedColor: (color: ColorScheme | null) => void;
  setSelectedSize: (size: SizeOption | null) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setPhotoUrl: (url: string) => void;
  setSelectedBorder: (border: string) => void;
  setShowBorder: (show: boolean) => void;
  setHasGoldFoil: (foil: boolean) => void;
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
  addTable: (table: Table) => void;
  addHistoryOrder: (order: HistoryOrder) => void;
}

const DesignContext = createContext<DesignState | undefined>(undefined);

const STORAGE_KEY_PHOTO = 'wd_photo_url';
const STORAGE_KEY_BORDER = 'wd_border_style';
const STORAGE_KEY_SHOW_BORDER = 'wd_show_border';
const STORAGE_KEY_GOLD_FOIL = 'wd_gold_foil';
const STORAGE_KEY_GUESTS = 'wd_guests';
const STORAGE_KEY_TABLES = 'wd_tables';
const STORAGE_KEY_ORDERS = 'wd_orders';

let initialPhotoUrl = '';
let initialBorder = 'b1';
let initialShowBorder = true;
let initialGoldFoil = true;
let initialGuests: Guest[] = mockGuests;
let initialTables: Table[] = mockTables;
let initialOrders: HistoryOrder[] = mockHistoryOrders;

try {
  const storedPhoto = Taro.getStorageSync(STORAGE_KEY_PHOTO);
  if (storedPhoto) initialPhotoUrl = storedPhoto;
  const storedBorder = Taro.getStorageSync(STORAGE_KEY_BORDER);
  if (storedBorder) initialBorder = storedBorder;
  const storedShowBorder = Taro.getStorageSync(STORAGE_KEY_SHOW_BORDER);
  if (storedShowBorder !== '') initialShowBorder = storedShowBorder === 'true';
  const storedGoldFoil = Taro.getStorageSync(STORAGE_KEY_GOLD_FOIL);
  if (storedGoldFoil !== '') initialGoldFoil = storedGoldFoil === 'true';
  const storedGuests = Taro.getStorageSync(STORAGE_KEY_GUESTS);
  if (storedGuests) initialGuests = JSON.parse(storedGuests);
  const storedTables = Taro.getStorageSync(STORAGE_KEY_TABLES);
  if (storedTables) initialTables = JSON.parse(storedTables);
  const storedOrders = Taro.getStorageSync(STORAGE_KEY_ORDERS);
  if (storedOrders) {
    const parsed = JSON.parse(storedOrders);
    initialOrders = [...parsed, ...mockHistoryOrders.filter(
      mo => !parsed.find((po: HistoryOrder) => po.orderNo === mo.orderNo)
    )];
  }
} catch (e) {
  console.error('[DesignContext] 读取存储失败:', e);
}

export const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyle | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorScheme | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [photoUrl, setPhotoUrlState] = useState(initialPhotoUrl);
  const [selectedBorder, setSelectedBorderState] = useState(initialBorder);
  const [showBorder, setShowBorderState] = useState(initialShowBorder);
  const [hasGoldFoil, setHasGoldFoilState] = useState(initialGoldFoil);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [historyOrders, setHistoryOrders] = useState<HistoryOrder[]>(initialOrders);

  const setPhotoUrl = useCallback((url: string) => {
    setPhotoUrlState(url);
    try { Taro.setStorageSync(STORAGE_KEY_PHOTO, url); } catch (e) { console.error('[DesignContext] 存储照片URL失败:', e); }
  }, []);

  const setSelectedBorder = useCallback((border: string) => {
    setSelectedBorderState(border);
    try { Taro.setStorageSync(STORAGE_KEY_BORDER, border); } catch (e) { console.error('[DesignContext] 存储边框失败:', e); }
  }, []);

  const setShowBorder = useCallback((show: boolean) => {
    setShowBorderState(show);
    try { Taro.setStorageSync(STORAGE_KEY_SHOW_BORDER, String(show)); } catch (e) { console.error('[DesignContext] 存储边框显示失败:', e); }
  }, []);

  const setHasGoldFoil = useCallback((foil: boolean) => {
    setHasGoldFoilState(foil);
    try { Taro.setStorageSync(STORAGE_KEY_GOLD_FOIL, String(foil)); } catch (e) { console.error('[DesignContext] 存储烫金失败:', e); }
  }, []);

  const addGuest = useCallback((guest: Guest) => {
    setGuests(prev => {
      const next = [...prev, guest];
      try { Taro.setStorageSync(STORAGE_KEY_GUESTS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储宾客失败:', e); }
      return next;
    });
  }, []);

  const updateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setGuests(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...updates } : g);
      try { Taro.setStorageSync(STORAGE_KEY_GUESTS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储宾客失败:', e); }
      return next;
    });
  }, []);

  const removeGuest = useCallback((id: string) => {
    setGuests(prev => {
      const next = prev.filter(g => g.id !== id);
      try { Taro.setStorageSync(STORAGE_KEY_GUESTS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储宾客失败:', e); }
      return next;
    });
  }, []);

  const addTable = useCallback((table: Table) => {
    setTables(prev => {
      const next = [...prev, table];
      try { Taro.setStorageSync(STORAGE_KEY_TABLES, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储桌次失败:', e); }
      return next;
    });
  }, []);

  const addHistoryOrder = useCallback((order: HistoryOrder) => {
    setHistoryOrders(prev => {
      const next = [order, ...prev];
      try { Taro.setStorageSync(STORAGE_KEY_ORDERS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储订单失败:', e); }
      return next;
    });
  }, []);

  return (
    <DesignContext.Provider
      value={{
        selectedStyle, selectedColor, selectedSize, selectedTemplate,
        photoUrl, selectedBorder, showBorder, hasGoldFoil,
        guests, tables, historyOrders,
        setSelectedStyle, setSelectedColor, setSelectedSize, setSelectedTemplate,
        setPhotoUrl, setSelectedBorder, setShowBorder, setHasGoldFoil,
        addGuest, updateGuest, removeGuest, addTable, addHistoryOrder
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};

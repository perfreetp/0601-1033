import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Taro from '@tarojs/taro';
import { WeddingStyle, ColorScheme, SizeOption, Template, Guest, Table, HistoryOrder, DesignScheme } from '@/types';
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
  titleText: string;
  nameText: string;
  dateText: string;
  selectedFont: string;
  selectedPattern: string;
  textColor: string;
  guests: Guest[];
  tables: Table[];
  historyOrders: HistoryOrder[];
  currentScheme: DesignScheme | null;
  setSelectedStyle: (style: WeddingStyle | null) => void;
  setSelectedColor: (color: ColorScheme | null) => void;
  setSelectedSize: (size: SizeOption | null) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setPhotoUrl: (url: string) => void;
  setSelectedBorder: (border: string) => void;
  setShowBorder: (show: boolean) => void;
  setHasGoldFoil: (foil: boolean) => void;
  setTitleText: (text: string) => void;
  setNameText: (text: string) => void;
  setDateText: (text: string) => void;
  setSelectedFont: (font: string) => void;
  setSelectedPattern: (pattern: string) => void;
  setTextColor: (color: string) => void;
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
  addTable: (table: Table) => void;
  addHistoryOrder: (order: HistoryOrder) => void;
  saveDesignScheme: (name?: string) => void;
}

const DesignContext = createContext<DesignState | undefined>(undefined);

const STORAGE_KEY_STYLE = 'wd_style';
const STORAGE_KEY_COLOR = 'wd_color';
const STORAGE_KEY_SIZE = 'wd_size';
const STORAGE_KEY_TEMPLATE = 'wd_template';
const STORAGE_KEY_PHOTO = 'wd_photo_url';
const STORAGE_KEY_BORDER = 'wd_border_style';
const STORAGE_KEY_SHOW_BORDER = 'wd_show_border';
const STORAGE_KEY_GOLD_FOIL = 'wd_gold_foil';
const STORAGE_KEY_TITLE = 'wd_title_text';
const STORAGE_KEY_NAME = 'wd_name_text';
const STORAGE_KEY_DATE = 'wd_date_text';
const STORAGE_KEY_FONT = 'wd_selected_font';
const STORAGE_KEY_PATTERN = 'wd_selected_pattern';
const STORAGE_KEY_TEXT_COLOR = 'wd_text_color';
const STORAGE_KEY_GUESTS = 'wd_guests';
const STORAGE_KEY_TABLES = 'wd_tables';
const STORAGE_KEY_ORDERS = 'wd_orders';
const STORAGE_KEY_SCHEME = 'wd_current_scheme';

let initialStyle: WeddingStyle | null = null;
let initialColor: ColorScheme | null = null;
let initialSize: SizeOption | null = null;
let initialTemplate: Template | null = null;
let initialPhotoUrl = '';
let initialBorder = 'b1';
let initialShowBorder = true;
let initialGoldFoil = true;
let initialTitle = 'Mr & Mrs';
let initialName = '王浩 & 李静';
let initialDate = '2024.06.18';
let initialFont = 'font-1';
let initialPattern = 'p1';
let initialTextColor = '#C9A96E';
let initialGuests: Guest[] = mockGuests;
let initialTables: Table[] = mockTables;
let initialOrders: HistoryOrder[] = mockHistoryOrders;
let initialScheme: DesignScheme | null = null;

try {
  const s = Taro.getStorageSync(STORAGE_KEY_STYLE);
  if (s) initialStyle = JSON.parse(s);
  const c = Taro.getStorageSync(STORAGE_KEY_COLOR);
  if (c) initialColor = JSON.parse(c);
  const sz = Taro.getStorageSync(STORAGE_KEY_SIZE);
  if (sz) initialSize = JSON.parse(sz);
  const t = Taro.getStorageSync(STORAGE_KEY_TEMPLATE);
  if (t) initialTemplate = JSON.parse(t);
  const sp = Taro.getStorageSync(STORAGE_KEY_PHOTO);
  if (sp) initialPhotoUrl = sp;
  const sb = Taro.getStorageSync(STORAGE_KEY_BORDER);
  if (sb) initialBorder = sb;
  const ssb = Taro.getStorageSync(STORAGE_KEY_SHOW_BORDER);
  if (ssb !== '') initialShowBorder = ssb === 'true';
  const sg = Taro.getStorageSync(STORAGE_KEY_GOLD_FOIL);
  if (sg !== '') initialGoldFoil = sg === 'true';
  const st = Taro.getStorageSync(STORAGE_KEY_TITLE);
  if (st) initialTitle = st;
  const sn = Taro.getStorageSync(STORAGE_KEY_NAME);
  if (sn) initialName = sn;
  const sd = Taro.getStorageSync(STORAGE_KEY_DATE);
  if (sd) initialDate = sd;
  const sf = Taro.getStorageSync(STORAGE_KEY_FONT);
  if (sf) initialFont = sf;
  const sp2 = Taro.getStorageSync(STORAGE_KEY_PATTERN);
  if (sp2) initialPattern = sp2;
  const stc = Taro.getStorageSync(STORAGE_KEY_TEXT_COLOR);
  if (stc) initialTextColor = stc;
  const sg2 = Taro.getStorageSync(STORAGE_KEY_GUESTS);
  if (sg2) initialGuests = JSON.parse(sg2);
  const st2 = Taro.getStorageSync(STORAGE_KEY_TABLES);
  if (st2) initialTables = JSON.parse(st2);
  const so = Taro.getStorageSync(STORAGE_KEY_ORDERS);
  if (so) {
    const parsed = JSON.parse(so);
    initialOrders = [...parsed, ...mockHistoryOrders.filter(
      mo => !parsed.find((po: HistoryOrder) => po.orderNo === mo.orderNo)
    )];
  }
  const sc = Taro.getStorageSync(STORAGE_KEY_SCHEME);
  if (sc) initialScheme = JSON.parse(sc);
} catch (e) {
  console.error('[DesignContext] 读取存储失败:', e);
}

export const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStyle, setSelectedStyleState] = useState<WeddingStyle | null>(initialStyle);
  const [selectedColor, setSelectedColorState] = useState<ColorScheme | null>(initialColor);
  const [selectedSize, setSelectedSizeState] = useState<SizeOption | null>(initialSize);
  const [selectedTemplate, setSelectedTemplateState] = useState<Template | null>(initialTemplate);
  const [photoUrl, setPhotoUrlState] = useState(initialPhotoUrl);
  const [selectedBorder, setSelectedBorderState] = useState(initialBorder);
  const [showBorder, setShowBorderState] = useState(initialShowBorder);
  const [hasGoldFoil, setHasGoldFoilState] = useState(initialGoldFoil);
  const [titleText, setTitleTextState] = useState(initialTitle);
  const [nameText, setNameTextState] = useState(initialName);
  const [dateText, setDateTextState] = useState(initialDate);
  const [selectedFont, setSelectedFontState] = useState(initialFont);
  const [selectedPattern, setSelectedPatternState] = useState(initialPattern);
  const [textColor, setTextColorState] = useState(initialTextColor);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [historyOrders, setHistoryOrders] = useState<HistoryOrder[]>(initialOrders);
  const [currentScheme, setCurrentScheme] = useState<DesignScheme | null>(initialScheme);

  const setSelectedStyle = useCallback((style: WeddingStyle | null) => {
    setSelectedStyleState(style);
    try { Taro.setStorageSync(STORAGE_KEY_STYLE, style ? JSON.stringify(style) : ''); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setSelectedColor = useCallback((color: ColorScheme | null) => {
    setSelectedColorState(color);
    try { Taro.setStorageSync(STORAGE_KEY_COLOR, color ? JSON.stringify(color) : ''); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setSelectedSize = useCallback((size: SizeOption | null) => {
    setSelectedSizeState(size);
    try { Taro.setStorageSync(STORAGE_KEY_SIZE, size ? JSON.stringify(size) : ''); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setSelectedTemplate = useCallback((template: Template | null) => {
    setSelectedTemplateState(template);
    try { Taro.setStorageSync(STORAGE_KEY_TEMPLATE, template ? JSON.stringify(template) : ''); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setPhotoUrl = useCallback((url: string) => {
    setPhotoUrlState(url);
    try { Taro.setStorageSync(STORAGE_KEY_PHOTO, url); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setSelectedBorder = useCallback((border: string) => {
    setSelectedBorderState(border);
    try { Taro.setStorageSync(STORAGE_KEY_BORDER, border); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setShowBorder = useCallback((show: boolean) => {
    setShowBorderState(show);
    try { Taro.setStorageSync(STORAGE_KEY_SHOW_BORDER, String(show)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setHasGoldFoil = useCallback((foil: boolean) => {
    setHasGoldFoilState(foil);
    try { Taro.setStorageSync(STORAGE_KEY_GOLD_FOIL, String(foil)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setTitleText = useCallback((text: string) => {
    setTitleTextState(text);
    try { Taro.setStorageSync(STORAGE_KEY_TITLE, text); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setNameText = useCallback((text: string) => {
    setNameTextState(text);
    try { Taro.setStorageSync(STORAGE_KEY_NAME, text); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setDateText = useCallback((text: string) => {
    setDateTextState(text);
    try { Taro.setStorageSync(STORAGE_KEY_DATE, text); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setSelectedFont = useCallback((font: string) => {
    setSelectedFontState(font);
    try { Taro.setStorageSync(STORAGE_KEY_FONT, font); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setSelectedPattern = useCallback((pattern: string) => {
    setSelectedPatternState(pattern);
    try { Taro.setStorageSync(STORAGE_KEY_PATTERN, pattern); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const setTextColor = useCallback((color: string) => {
    setTextColorState(color);
    try { Taro.setStorageSync(STORAGE_KEY_TEXT_COLOR, color); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
  }, []);

  const addGuest = useCallback((guest: Guest) => {
    setGuests(prev => {
      const next = [...prev, guest];
      try { Taro.setStorageSync(STORAGE_KEY_GUESTS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
      return next;
    });
  }, []);

  const updateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setGuests(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...updates } : g);
      try { Taro.setStorageSync(STORAGE_KEY_GUESTS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
      return next;
    });
  }, []);

  const removeGuest = useCallback((id: string) => {
    setGuests(prev => {
      const next = prev.filter(g => g.id !== id);
      try { Taro.setStorageSync(STORAGE_KEY_GUESTS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
      return next;
    });
  }, []);

  const addTable = useCallback((table: Table) => {
    setTables(prev => {
      const next = [...prev, table];
      try { Taro.setStorageSync(STORAGE_KEY_TABLES, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
      return next;
    });
  }, []);

  const addHistoryOrder = useCallback((order: HistoryOrder) => {
    setHistoryOrders(prev => {
      const next = [order, ...prev];
      try { Taro.setStorageSync(STORAGE_KEY_ORDERS, JSON.stringify(next)); } catch (e) { console.error('[DesignContext] 存储失败:', e); }
      return next;
    });
  }, []);

  const saveDesignScheme = useCallback((name?: string) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const scheme: DesignScheme = {
      id: generateId(),
      name: name || `${nameText}的婚礼设计`,
      style: selectedStyle,
      color: selectedColor,
      size: selectedSize,
      template: selectedTemplate,
      photoUrl,
      borderStyle: selectedBorder,
      showBorder,
      hasGoldFoil,
      textColor,
      titleText,
      nameText,
      dateText,
      selectedFont,
      selectedPattern,
      updateTime: timeStr
    };
    setCurrentScheme(scheme);
    try { Taro.setStorageSync(STORAGE_KEY_SCHEME, JSON.stringify(scheme)); } catch (e) { console.error('[DesignContext] 存储方案失败:', e); }
  }, [selectedStyle, selectedColor, selectedSize, selectedTemplate, photoUrl, selectedBorder, showBorder, hasGoldFoil, textColor, titleText, nameText, dateText, selectedFont, selectedPattern]);

  return (
    <DesignContext.Provider
      value={{
        selectedStyle, selectedColor, selectedSize, selectedTemplate,
        photoUrl, selectedBorder, showBorder, hasGoldFoil,
        titleText, nameText, dateText, selectedFont, selectedPattern, textColor,
        guests, tables, historyOrders, currentScheme,
        setSelectedStyle, setSelectedColor, setSelectedSize, setSelectedTemplate,
        setPhotoUrl, setSelectedBorder, setShowBorder, setHasGoldFoil,
        setTitleText, setNameText, setDateText, setSelectedFont, setSelectedPattern, setTextColor,
        addGuest, updateGuest, removeGuest, addTable, addHistoryOrder,
        saveDesignScheme
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

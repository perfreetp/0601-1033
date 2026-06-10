import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeddingStyle, ColorScheme, SizeOption, Template } from '@/types';

interface DesignState {
  selectedStyle: WeddingStyle | null;
  selectedColor: ColorScheme | null;
  selectedSize: SizeOption | null;
  selectedTemplate: Template | null;
  setSelectedStyle: (style: WeddingStyle | null) => void;
  setSelectedColor: (color: ColorScheme | null) => void;
  setSelectedSize: (size: SizeOption | null) => void;
  setSelectedTemplate: (template: Template | null) => void;
}

const DesignContext = createContext<DesignState | undefined>(undefined);

export const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyle | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorScheme | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <DesignContext.Provider
      value={{
        selectedStyle,
        selectedColor,
        selectedSize,
        selectedTemplate,
        setSelectedStyle,
        setSelectedColor,
        setSelectedSize,
        setSelectedTemplate
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

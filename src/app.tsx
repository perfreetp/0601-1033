import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { DesignProvider } from './store/DesignContext';
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] 婚礼创意设计平台初始化');
  }, []);

  useDidShow(() => {
    console.log('[App] 小程序显示');
  });

  useDidHide(() => {
    console.log('[App] 小程序隐藏');
  });

  return <DesignProvider>{props.children}</DesignProvider>;
}

export default App;

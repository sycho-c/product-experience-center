import React from 'react';
import ReactDOM from 'react-dom/client';
import { enableMapSet } from 'immer';
import App from './App';
import './index.css';

// talkStore 의 emittedIds: Set<string> 처럼 immer 가 Set/Map 을 다룰 수 있도록 활성화.
enableMapSet();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

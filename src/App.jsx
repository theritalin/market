import React, { useState, useEffect } from 'react';
import SingleCalculator from './components/SingleCalculator';
import BulkCalculator from './components/BulkCalculator';
import RatioTable from './components/RatioTable';
import { Calculator, List, DollarSign, Activity, Coins } from 'lucide-react';
import './index.css';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

function App() {
  const [activeTab, setActiveTab] = useState('single');
  
  const [currentPrice, setCurrentPrice] = useLocalStorage('ziraat_price', '');
  const [gcaa, setGcaa] = useLocalStorage('ziraat_gcaa', '');
  const [dailyExpense, setDailyExpense] = useLocalStorage('ziraat_expense', '');

  return (
    <>
      <div className="header">
        <h1>Ziraat Besi Market</h1>
        <p>Besi hayvanlarınızın canlı kilosuna göre satış ve amorti fiyatlarını hesaplayın.</p>
      </div>

      <div className="global-inputs-grid">
        <div className="global-input-section glass-panel">
          <label className="input-label">Güncel Karkas Birim Fiyatı (TL)</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={20} color="#10B981" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="number"
              className="input-field highlight"
              style={{ color: '#10B981', paddingLeft: '3rem' }}
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="Örn: 250"
              min="0"
            />
          </div>
        </div>

        <div className="global-input-section glass-panel">
          <label className="input-label">Günlük Kilo Artışı (kg)</label>
          <div style={{ position: 'relative' }}>
            <Activity size={20} color="#60A5FA" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="number"
              className="input-field"
              style={{ paddingLeft: '3rem' }}
              value={gcaa}
              onChange={(e) => setGcaa(e.target.value)}
              placeholder="Örn: 1.5"
              step="0.1"
              min="0"
            />
          </div>
        </div>

        <div className="global-input-section glass-panel">
          <label className="input-label">Günlük Masraf (TL)</label>
          <div style={{ position: 'relative' }}>
            <Coins size={20} color="#F59E0B" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="number"
              className="input-field"
              style={{ paddingLeft: '3rem' }}
              value={dailyExpense}
              onChange={(e) => setDailyExpense(e.target.value)}
              placeholder="Örn: 150"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          <Calculator size={18} />
          Tekil Hesaplama
        </button>
        <button 
          className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk')}
        >
          <List size={18} />
          Toplu Liste
        </button>
      </div>

      <div className="content-area">
        <div style={{ display: activeTab === 'single' ? 'block' : 'none' }}>
          <SingleCalculator 
            currentPrice={currentPrice} 
            gcaa={gcaa} 
            dailyExpense={dailyExpense} 
          />
        </div>
        <div style={{ display: activeTab === 'bulk' ? 'block' : 'none' }}>
          <BulkCalculator 
            currentPrice={currentPrice} 
            gcaa={gcaa} 
            dailyExpense={dailyExpense} 
          />
        </div>
      </div>

      <RatioTable currentPrice={currentPrice} />
    </>
  );
}

export default App;

import React, { useState } from 'react';
import { calculateMinPrice, calculateMaxPrice, calculateAmortization, formatCurrency } from '../data/calculations';
import { Scale, Clock } from 'lucide-react';

export default function SingleCalculator({ currentPrice, gcaa, dailyExpense }) {
  const [weight, setWeight] = useState('');

  const minPrice = calculateMinPrice(weight, currentPrice);
  const maxPrice = calculateMaxPrice(weight, currentPrice);
  const amortizeDays = calculateAmortization(minPrice, maxPrice, currentPrice, gcaa, dailyExpense);

  return (
    <div className="glass-panel slide-in">
      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <label>Canlı Ağırlık (kg)</label>
        <div style={{ position: 'relative' }}>
          <Scale size={20} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="number"
            className="input-field highlight"
            style={{ paddingLeft: '3rem' }}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Hayvanın tam kilosunu giriniz (Örn: 200)"
            min="0"
          />
        </div>
      </div>

      <div className="results-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="result-card">
          <span className="label">Tahmini Min. Fiyat (Et)</span>
          <span className="value">{formatCurrency(minPrice)}</span>
        </div>
        <div className="result-card max">
          <span className="label">Tahmini Max. Fiyat (Besilik)</span>
          <span className="value">{formatCurrency(maxPrice)}</span>
        </div>
        <div className="result-card">
          <span className="label" style={{ color: '#F1F5F9' }}>Tahmini Ortalama Fiyat</span>
          <span className="value" style={{ color: 'white' }}>{formatCurrency((minPrice + maxPrice) / 2)}</span>
        </div>
      </div>
      
      {amortizeDays !== null && weight > 0 && amortizeDays !== 0 && (
        <div className="amortization-card slide-in">
          <div className="amortize-content">
            <Clock size={24} color="#A78BFA" />
            <div>
              <span className="label">Farkı Kapatmak İçin Amorti Süresi</span>
              <span className="value">
                {amortizeDays === Infinity ? 'Zarar Gözüküyor (Amorti Etmez)' : `${amortizeDays} Gün`}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {(!weight || weight <= 0) && (
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Hesaplama için canlı ağırlık giriniz.
        </p>
      )}
    </div>
  );
}

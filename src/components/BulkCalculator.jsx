import React, { useState } from 'react';
import { calculateMinPrice, calculateMaxPrice, calculateAmortization, formatCurrency } from '../data/calculations';
import { Plus, Trash2, Scale, Clock } from 'lucide-react';

export default function BulkCalculator({ currentPrice, gcaa, dailyExpense }) {
  const [weightInput, setWeightInput] = useState('');
  const [animals, setAnimals] = useState([]);

  const handleAdd = (e) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    if (!w || w <= 0) return;
    
    setAnimals([{ id: Date.now(), weight: w }, ...animals]);
    setWeightInput('');
  };

  const handleRemove = (id) => {
    setAnimals(animals.filter(a => a.id !== id));
  };

  const calculateTotals = () => {
    let tMin = 0;
    let tMax = 0;
    animals.forEach(a => {
      tMin += calculateMinPrice(a.weight, currentPrice);
      tMax += calculateMaxPrice(a.weight, currentPrice);
    });
    return { tMin, tMax };
  };

  const { tMin, tMax } = calculateTotals();
  const aMin = animals.length ? tMin / animals.length : 0;
  const aMax = animals.length ? tMax / animals.length : 0;
  
  const bulkAmortizeDays = calculateAmortization(tMin, tMax, currentPrice, gcaa * animals.length, dailyExpense * animals.length);

  return (
    <div className="glass-panel slide-in">
      <form onSubmit={handleAdd} className="flex-row" style={{ marginBottom: '1.5rem' }}>
        <div className="input-group flex-1">
          <label>Canlı Ağırlık (kg)</label>
          <div style={{ position: 'relative' }}>
            <Scale size={20} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="number"
              className="input-field highlight"
              style={{ paddingLeft: '3rem' }}
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="Kilo girin..."
              min="0"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn" disabled={!weightInput}>
            <Plus size={20} /> Ekle
          </button>
          {animals.length > 0 && (
            <button 
              type="button" 
              className="btn" 
              onClick={() => setAnimals([])} 
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
              title="Listeyi Temizle"
            >
              <Trash2 size={20} /> 
            </button>
          )}
        </div>
      </form>

      {animals.length > 0 ? (
        <>
          <div className="list-container">
            {animals.map((animal, i) => {
              const itemMin = calculateMinPrice(animal.weight, currentPrice);
              const itemMax = calculateMaxPrice(animal.weight, currentPrice);
              const itemAmortize = calculateAmortization(itemMin, itemMax, currentPrice, gcaa, dailyExpense);
              return (
                <div key={animal.id} className="list-item slide-in">
                  <div className="list-item-stats">
                    <span className="list-item-weight">
                      <Scale size={16} color="#60A5FA" />
                      #{animals.length - i} - {animal.weight} kg
                    </span>
                    <span className="list-item-prices">
                      Min: {formatCurrency(itemMin)} <br/> Max: {formatCurrency(itemMax)}
                    </span>
                    {itemAmortize !== null && itemAmortize !== 0 && (
                      <span className="list-item-amortize" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#A78BFA', marginTop: '0.2rem' }}>
                        <Clock size={12}/> 
                        {itemAmortize === Infinity ? 'Amorti Etmez' : `${itemAmortize} günde amorti`}
                      </span>
                    )}
                  </div>
                  <button className="btn-danger-icon" onClick={() => handleRemove(animal.id)} title="Sil">
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="summary-card">
            <h3>Genel Toplamlar ({animals.length} Hayvan)</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Birim Başına (Ortalama)
              </h4>
              <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div className="result-card blue">
                  <span className="label">Birim Min (Et)</span>
                  <span className="value">{formatCurrency(aMin)}</span>
                </div>
                <div className="result-card max">
                  <span className="label">Birim Max (Besilik)</span>
                  <span className="value">{formatCurrency(aMax)}</span>
                </div>
                <div className="result-card">
                  <span className="label" style={{ color: '#F1F5F9' }}>Birim Ortalama</span>
                  <span className="value" style={{ color: 'white' }}>{formatCurrency((aMin + aMax) / 2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tüm Liste Toplamı
              </h4>
              <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div className="result-card">
                  <span className="label">Toplam Min (Et)</span>
                  <span className="value">{formatCurrency(tMin)}</span>
                </div>
                <div className="result-card max">
                  <span className="label">Toplam Max (Besilik)</span>
                  <span className="value">{formatCurrency(tMax)}</span>
                </div>
                <div className="result-card">
                  <span className="label" style={{ color: '#F1F5F9' }}>Toplam Ortalama</span>
                  <span className="value" style={{ color: 'white' }}>{formatCurrency((tMin + tMax) / 2)}</span>
                </div>
              </div>
            </div>
            
            {bulkAmortizeDays !== null && bulkAmortizeDays !== 0 && (
              <div className="amortization-card mt-1">
                <div className="amortize-content">
                  <Clock size={20} color="#A78BFA" />
                  <div>
                    <span className="label">Tümü İçin Amorti Süresi</span>
                    <span className="value">
                      {bulkAmortizeDays === Infinity ? 'Zarar Gözüküyor' : `${bulkAmortizeDays} Gün`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
          Listeye ekleme yapmak için yukarıdan hayvan kilosunu giriniz.
        </p>
      )}
    </div>
  );
}

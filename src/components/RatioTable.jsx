import React from 'react';
import { RATIO_TABLE } from '../data/constants';
import { Table, Scale, DollarSign } from 'lucide-react';
import { calculateMinPrice, calculateMaxPrice, formatCurrency } from '../data/calculations';

export default function RatioTable({ currentPrice }) {
  return (
    <div className="glass-panel slide-in" style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Table size={20} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Referans Katsayı Tablosu</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Ara kilolarda hesap makinesi listedeki en yakın değere yuvarlayarak işlem yapmaktadır.
      </p>
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th><div className="th-content"><Scale size={16}/> Canlı Ağırlık (kg)</div></th>
              <th><div className="th-content"><DollarSign size={16}/> Et Fiyatı (Min)</div></th>
              <th><div className="th-content"><DollarSign size={16}/> Besi Fiyatı (Max)</div></th>
            </tr>
          </thead>
          <tbody>
            {RATIO_TABLE.map((row, index) => {
              const minP = calculateMinPrice(row.weight, currentPrice);
              const maxP = calculateMaxPrice(row.weight, currentPrice);
              
              return (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{row.weight}</td>
                  <td style={{ color: 'var(--success)' }}>{currentPrice ? formatCurrency(minP) : '-'}</td>
                  <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{currentPrice ? formatCurrency(maxP) : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

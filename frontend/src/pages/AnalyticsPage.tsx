import React from 'react';
import { Card } from '../components/common/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Analytics.module.css';

const mockSpendingData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const mockCategoryData = [
  { name: 'Housing', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Food', value: 300 },
  { name: 'Entertainment', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const AnalyticsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Average Monthly Spend</h3>
          <p className={styles.metricValue}>$3,420</p>
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>+12% from last month</p>
        </Card>
        
        <Card className={`${styles.metricCard} ${styles.budgetCard}`}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Food Budget Usage</h3>
          <p className={styles.metricValue}>85%</p>
          <div className={styles.progressBarContainer}>
            <div className={`${styles.progressBarFill} ${styles.warning}`} style={{ width: '85%' }}></div>
          </div>
          <p style={{ color: 'var(--warning)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Warning: Nearing limit of $500
          </p>
        </Card>
      </div>

      <div className={styles.chartsGrid}>
        <Card>
          <h3>Income vs Expense Trend</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSpendingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3>Category Breakdown</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            {mockCategoryData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: COLORS[index], borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

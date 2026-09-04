import React from 'react';
import { Card } from '../components/common/Card';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

const mockSpendingData = [
  { name: 'Mon', amount: 120 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 150 },
  { name: 'Thu', amount: 400 },
  { name: 'Fri', amount: 200 },
  { name: 'Sat', amount: 600 },
  { name: 'Sun', amount: 100 },
];

export const DashboardOverview = () => {
  const { transactions } = useAppStore();
  const recentActivity = transactions.slice(0, 5); // show top 5

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Balance</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>$12,450.00</p>
        </Card>
        <Card>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monthly Income</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--success)' }}>+$4,200.00</p>
        </Card>
        <Card>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monthly Expenses</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--danger)' }}>-$1,850.00</p>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', height: '350px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Weekly Spending Trend</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSpendingData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.map(activity => (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{activity.description}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{format(activity.date, 'MMM dd, yyyy')} • {activity.category}</p>
                </div>
                <p style={{ fontWeight: 700, color: activity.type === 'INCOME' ? 'var(--success)' : 'inherit' }}>
                  {activity.type === 'INCOME' ? '+' : '-'}{activity.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

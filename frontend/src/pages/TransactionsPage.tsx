import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { DataTable } from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import { format } from 'date-fns';
import { useAppStore } from '../store/useAppStore';

export const TransactionsPage = () => {
  const { transactions, addTransaction, budgets, goals } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionTarget, setTransactionTarget] = useState<'BUDGET' | 'GOAL' | 'OTHER'>('BUDGET');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('EXPENSE');

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const newTransaction = {
      id: Date.now().toString(),
      date: new Date(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      method: 'CASH' // default mock
    };

    addTransaction(newTransaction);
    setDescription('');
    setAmount('');
    setCategory('');
    setIsModalOpen(false);
  };

  const columns: Column<typeof initialTransactions[0]>[] = [
    { 
      key: 'date', 
      header: 'Date', 
      render: (item) => format(item.date, 'MMM dd, yyyy') 
    },
    { key: 'description', header: 'Description' },
    { key: 'category', header: 'Category' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (item) => (
        <span style={{ color: item.type === 'INCOME' ? 'var(--success)' : 'var(--text-primary)', fontWeight: 'bold' }}>
          {item.type === 'INCOME' ? '+' : '-'}${item.amount.toFixed(2)}
        </span>
      )
    },
    { key: 'method', header: 'Payment Method' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Transactions History</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Transaction</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <DataTable 
          columns={columns} 
          data={transactions} 
          searchable={true} 
          searchKey="description"
          itemsPerPage={8}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleCreateTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Description" 
            placeholder="e.g. Uber Ride" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
          />
          <Input 
            label="Amount ($)" 
            type="number" 
            placeholder="15.50" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            required 
            min="0.01"
            step="0.01"
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Transaction Target</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" checked={transactionTarget === 'BUDGET'} onChange={() => { setTransactionTarget('BUDGET'); setCategory(budgets[0]?.category || ''); setType('EXPENSE'); }} /> Budget
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" checked={transactionTarget === 'GOAL'} onChange={() => { setTransactionTarget('GOAL'); setCategory(goals[0]?.name || ''); }} /> Goal
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" checked={transactionTarget === 'OTHER'} onChange={() => { setTransactionTarget('OTHER'); setCategory(''); }} /> Other
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
            {transactionTarget === 'BUDGET' ? (
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="" disabled>Select Budget Category</option>
                {budgets.map(b => (
                  <option key={b.id} value={b.category}>{b.category}</option>
                ))}
              </select>
            ) : transactionTarget === 'GOAL' ? (
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="" disabled>Select Goal</option>
                {goals.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            ) : (
              <Input 
                placeholder="e.g. Salary, Utilities, etc." 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required 
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Type</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

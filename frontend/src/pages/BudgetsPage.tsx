import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAppStore } from '../store/useAppStore';

export const BudgetsPage = () => {
  const { budgets, addBudget, transactions } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [spent, setSpent] = useState('0');

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    const newBudget = {
      id: Date.now().toString(),
      category,
      amount: parseFloat(amount),
      spent: parseFloat(spent) || 0, // initial mock value, will be dynamically added to transaction sum
      period: 'MONTHLY'
    };

    addBudget(newBudget);
    setCategory('');
    setAmount('');
    setSpent('0');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Monthly Budgets</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage limits and receive alerts before you overspend.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Create Budget</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {budgets.map(budget => {
          // Dynamically calculate spent amount from transactions
          const matchingTransactions = transactions.filter(
            t => t.type === 'EXPENSE' && t.category.trim().toLowerCase() === budget.category.trim().toLowerCase()
          );
          const actualSpent = matchingTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
          
          // Total spent = the initial mock spent value + any actual transactions
          const totalSpent = Number(budget.spent) + actualSpent;

          const usage = (totalSpent / Number(budget.amount)) * 100;
          let progressColor = 'var(--success)';
          let alertMsg = null;
          
          if (usage >= 100) {
            progressColor = 'var(--danger)';
            alertMsg = <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>Budget Exceeded!</span>;
          } else if (usage >= 80) {
            progressColor = 'var(--warning)';
            alertMsg = <span style={{ color: 'var(--warning)', fontSize: '0.875rem' }}>80% Warning: Nearing Limit</span>;
          }

          return (
            <Card key={budget.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>{budget.category}</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{budget.period}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${totalSpent}</span>
                <span style={{ color: 'var(--text-secondary)' }}>of ${budget.amount}</span>
              </div>

              <div style={{ height: '10px', background: 'var(--glass-border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ height: '100%', width: `${Math.min(usage, 100)}%`, backgroundColor: progressColor, transition: 'width 0.5s' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{usage.toFixed(1)}% Used</span>
                {alertMsg}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Budget">
        <form onSubmit={handleCreateBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Category Name" 
            placeholder="e.g. Healthcare" 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            required 
          />
          <Input 
            label="Monthly Limit ($)" 
            type="number" 
            placeholder="500" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            required 
            min="1"
          />
          <Input 
            label="Current Spent ($) [Demo Only]" 
            type="number" 
            placeholder="0" 
            value={spent} 
            onChange={e => setSpent(e.target.value)} 
            min="0"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Budget</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

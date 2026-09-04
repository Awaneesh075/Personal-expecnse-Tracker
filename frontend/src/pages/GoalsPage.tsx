import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { format, differenceInMonths } from 'date-fns';
import { useAppStore } from '../store/useAppStore';

export const GoalsPage = () => {
  const { goals, addGoal, transactions } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [current, setCurrent] = useState('0');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;

    const newGoal = {
      id: Date.now().toString(),
      name,
      target: parseFloat(target),
      current: parseFloat(current) || 0,
      deadline: new Date(deadline)
    };

    addGoal(newGoal);
    setName('');
    setTarget('');
    setCurrent('0');
    setDeadline('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Financial Goals</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track your savings targets and view monthly requirements.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Create Goal</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {goals.map(goal => {
          // Dynamically add any transactions that match this goal's name
          const matchingTransactions = transactions.filter(
            t => t.category.trim().toLowerCase() === goal.name.trim().toLowerCase()
          );
          const dynamicSaved = matchingTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
          const totalCurrent = Number(goal.current) + dynamicSaved;

          const progress = (totalCurrent / Number(goal.target)) * 100;
          const monthsLeft = differenceInMonths(new Date(goal.deadline), new Date());
          const remainingAmount = Number(goal.target) - totalCurrent;
          const requiredMonthly = monthsLeft > 0 ? (remainingAmount / monthsLeft).toFixed(2) : remainingAmount.toFixed(2);
          const isComplete = progress >= 100;

          return (
            <Card key={goal.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600, color: isComplete ? 'var(--success)' : 'var(--text-primary)' }}>
                  {isComplete ? '🎉 ' : ''}{goal.name}
                </h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Target: {format(goal.deadline, 'MMM yyyy')}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'baseline' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>${totalCurrent}</span>
                <span style={{ color: 'var(--text-secondary)' }}>of ${goal.target}</span>
              </div>

              <div style={{ height: '12px', background: 'var(--glass-border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, backgroundColor: isComplete ? 'var(--success)' : 'var(--accent-primary)', transition: 'width 1s' }} />
              </div>
              
              {!isComplete ? (
                <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Months Left:</span>
                    <span style={{ fontWeight: 600 }}>{monthsLeft}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Required Monthly Savings:</span>
                    <span style={{ fontWeight: 600, color: 'var(--warning)' }}>${requiredMonthly}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--success)', textAlign: 'center', fontWeight: 600 }}>
                  Goal Completed!
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Financial Goal">
        <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Goal Name" 
            placeholder="e.g. New Car Downpayment" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <Input 
            label="Target Amount ($)" 
            type="number" 
            placeholder="5000" 
            value={target} 
            onChange={e => setTarget(e.target.value)} 
            required 
            min="1"
          />
          <Input 
            label="Deadline" 
            type="date" 
            value={deadline} 
            onChange={e => setDeadline(e.target.value)} 
            required 
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

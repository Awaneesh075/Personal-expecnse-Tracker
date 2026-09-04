import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: string;
  category: string;
  method: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: Date;
}

interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  addTransaction: (t: Transaction) => void;
  addBudget: (b: Budget) => void;
  addGoal: (g: Goal) => void;
}

const defaultTransactions: Transaction[] = [
  { id: '1', date: new Date('2026-09-01'), description: 'Uber to Office', amount: 15.50, type: 'EXPENSE', category: 'Transport', method: 'CREDIT_CARD' },
  { id: '2', date: new Date('2026-09-01'), description: 'Salary', amount: 4500.00, type: 'INCOME', category: 'Salary', method: 'BANK_TRANSFER' },
  { id: '3', date: new Date('2026-08-30'), description: 'Grocery Store', amount: 120.00, type: 'EXPENSE', category: 'Food', method: 'DEBIT_CARD' },
];

const defaultBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', amount: 500, spent: 420, period: 'MONTHLY' },
  { id: '2', category: 'Transport', amount: 200, spent: 150, period: 'MONTHLY' },
];

const defaultGoals: Goal[] = [
  { id: '1', name: 'Emergency Fund', target: 10000, current: 4500, deadline: new Date('2027-12-31') },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: defaultTransactions,
      budgets: defaultBudgets,
      goals: defaultGoals,
      addTransaction: (t) => set((state) => {
        // If it's an expense, try to find a matching budget and update it
        let updatedBudgets = state.budgets;
        if (t.type === 'EXPENSE') {
          updatedBudgets = state.budgets.map(budget => {
            if (budget.category.toLowerCase() === t.category.toLowerCase()) {
              return { ...budget, spent: budget.spent + t.amount };
            }
            return budget;
          });
        }
        
        return { 
          transactions: [t, ...state.transactions],
          budgets: updatedBudgets
        };
      }),
      addBudget: (b) => set((state) => ({ budgets: [...state.budgets, b] })),
      addGoal: (g) => set((state) => ({ goals: [g, ...state.goals] })),
    }),
    {
      name: 'app-storage',
      // We need to parse dates back to Date objects after rehydration
      deserialize: (str) => {
        const state = JSON.parse(str);
        if (state.state && state.state.transactions) {
          state.state.transactions.forEach((t: any) => t.date = new Date(t.date));
        }
        if (state.state && state.state.goals) {
          state.state.goals.forEach((g: any) => g.deadline = new Date(g.deadline));
        }
        return state;
      },
    }
  )
);

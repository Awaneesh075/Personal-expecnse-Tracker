import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import { Users, Activity, ShieldAlert, Edit, Trash2 } from 'lucide-react';

const mockAuditLogs = [
  { id: '1', date: '2026-09-01T10:00:00Z', user: 'admin@financex.com', action: 'SYSTEM_START', details: 'System booted successfully', ip: '192.168.1.1' },
  { id: '2', date: '2026-09-01T10:15:00Z', user: 'john@doe.com', action: 'LOGIN_SUCCESS', details: 'User logged in', ip: '10.0.0.45' },
];

const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@financex.com', role: 'ADMIN', status: 'Active' },
  { id: '2', name: 'John Doe', email: 'john@doe.com', role: 'USER', status: 'Active' },
  { id: '3', name: 'Jane Doe', email: 'jane@doe.com', role: 'USER', status: 'Suspended' },
];

const mockCategories = [
  { id: '1', name: 'Housing', type: 'EXPENSE', transactions: 1540 },
  { id: '2', name: 'Food', type: 'EXPENSE', transactions: 3412 },
  { id: '3', name: 'Salary', type: 'INCOME', transactions: 412 },
];

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'USERS' | 'CATEGORIES'>('STATS');

  const auditColumns: Column<typeof mockAuditLogs[0]>[] = [
    { key: 'date', header: 'Timestamp', render: (item) => new Date(item.date).toLocaleString() },
    { key: 'user', header: 'User' },
    { key: 'action', header: 'Action', render: (item) => (
      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: item.action.includes('EXCEEDED') || item.action.includes('FAIL') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: item.action.includes('EXCEEDED') || item.action.includes('FAIL') ? 'var(--danger)' : 'var(--success)' }}>
        {item.action}
      </span>
    )},
    { key: 'details', header: 'Details' },
  ];

  const userColumns: Column<typeof mockUsers[0]>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (item) => <span style={{ fontWeight: item.role === 'ADMIN' ? 'bold' : 'normal', color: item.role === 'ADMIN' ? 'var(--warning)' : 'inherit' }}>{item.role}</span> },
    { key: 'status', header: 'Status', render: (item) => <span style={{ color: item.status === 'Active' ? 'var(--success)' : 'var(--danger)' }}>{item.status}</span> },
    { key: 'actions', header: 'Actions', render: () => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit size={16} /></button>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    )},
  ];

  const categoryColumns: Column<typeof mockCategories[0]>[] = [
    { key: 'name', header: 'Category Name' },
    { key: 'type', header: 'Type', render: (item) => <span style={{ color: item.type === 'INCOME' ? 'var(--success)' : 'inherit' }}>{item.type}</span> },
    { key: 'transactions', header: 'Total Transactions' },
    { key: 'actions', header: 'Actions', render: () => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit size={16} /></button>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Admin Portal</h2>
        <p style={{ color: 'var(--text-secondary)' }}>System statistics, User, and Category management.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('STATS')}
          style={{ background: activeTab === 'STATS' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: activeTab === 'STATS' ? '#fff' : 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >Statistics & Logs</button>
        <button 
          onClick={() => setActiveTab('USERS')}
          style={{ background: activeTab === 'USERS' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: activeTab === 'USERS' ? '#fff' : 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >User Management</button>
        <button 
          onClick={() => setActiveTab('CATEGORIES')}
          style={{ background: activeTab === 'CATEGORIES' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--accent-primary)', color: activeTab === 'CATEGORIES' ? '#fff' : 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >Category Management</button>
      </div>

      {activeTab === 'STATS' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}><Users size={32} color="var(--accent-primary)" /></div>
              <div>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Users</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700 }}>1,284</p>
              </div>
            </Card>
            <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}><Activity size={32} color="var(--success)" /></div>
              <div>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Transactions</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700 }}>45,912</p>
              </div>
            </Card>
            <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}><ShieldAlert size={32} color="var(--danger)" /></div>
              <div>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>System Alerts</h3>
                <p style={{ fontSize: '2rem', fontWeight: 700 }}>3</p>
              </div>
            </Card>
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontWeight: 600 }}>System Audit Logs</h3>
            </div>
            <DataTable columns={auditColumns} data={mockAuditLogs} searchable={true} searchKey="user" itemsPerPage={5} />
          </Card>
        </>
      )}

      {activeTab === 'USERS' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 600 }}>User Management</h3>
          </div>
          <DataTable columns={userColumns} data={mockUsers} searchable={true} searchKey="email" itemsPerPage={10} />
        </Card>
      )}

      {activeTab === 'CATEGORIES' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 600 }}>Global Category Management</h3>
          </div>
          <DataTable columns={categoryColumns} data={mockCategories} searchable={true} searchKey="name" itemsPerPage={10} />
        </Card>
      )}
    </div>
  );
};

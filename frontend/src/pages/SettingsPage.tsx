import React from 'react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';

export const SettingsPage = () => {
  const user = useAuthStore(state => state.user);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Profile Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account details and preferences.</p>
      </div>

      <Card>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Personal Information</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Full Name" defaultValue={user?.name || ''} />
            <Input label="Email Address" defaultValue={user?.email || ''} type="email" disabled />
          </div>
          <Input label="Currency Preference" defaultValue="USD ($)" />
          
          <div style={{ marginTop: '1rem' }}>
            <Button>Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', color: 'var(--danger)' }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <div>
          <Button variant="danger">Delete Account</Button>
        </div>
      </Card>
    </div>
  );
};

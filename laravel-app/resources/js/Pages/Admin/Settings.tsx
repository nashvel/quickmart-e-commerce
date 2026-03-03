import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Save, Settings as SettingsIcon, Mail, CreditCard, Truck } from 'lucide-react';

interface Settings {
  site_name: string;
  site_email: string;
  support_email: string;
  currency: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  maintenance_mode: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

// Mock data
const mockSettings: Settings = {
  site_name: 'E-Commerce Platform',
  site_email: 'admin@example.com',
  support_email: 'support@example.com',
  currency: 'PHP',
  tax_rate: 12,
  shipping_fee: 50,
  free_shipping_threshold: 1000,
  maintenance_mode: false,
  email_notifications: true,
  sms_notifications: false,
};

const Card = ({ children, title, icon }: { children: React.ReactNode; title: string; icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-primary/10 rounded-full">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const FormGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {children}
  </div>
);

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
  />
);

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      console.log('Settings saved:', settings);
    }, 1000);
  };

  return (
    <DashboardLayout role="admin">
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-gray-50 min-h-screen">
        <div className="pt-4 sm:pt-6 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="mt-1 text-sm text-gray-600">
                Configure system-wide settings and preferences.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-4 sm:mt-0 flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
            >
              <Save className="mr-2" size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card title="General Settings" icon={<SettingsIcon className="text-primary" size={24} />}>
              <FormGroup label="Site Name">
                <Input
                  type="text"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup label="Site Email">
                <Input
                  type="email"
                  name="site_email"
                  value={settings.site_email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup label="Support Email">
                <Input
                  type="email"
                  name="support_email"
                  value={settings.support_email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup label="Currency">
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="PHP">PHP - Philippine Peso</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </FormGroup>
            </Card>

            {/* Email Settings */}
            <Card title="Email Configuration" icon={<Mail className="text-primary" size={24} />}>
              <FormGroup label="Email Notifications">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email_notifications"
                    checked={settings.email_notifications}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable email notifications
                  </span>
                </label>
              </FormGroup>
              <FormGroup label="SMS Notifications">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sms_notifications"
                    checked={settings.sms_notifications}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable SMS notifications
                  </span>
                </label>
              </FormGroup>
            </Card>

            {/* Payment Settings */}
            <Card title="Payment Settings" icon={<CreditCard className="text-blue-600" size={24} />}>
              <FormGroup label="Tax Rate (%)">
                <Input
                  type="number"
                  name="tax_rate"
                  value={settings.tax_rate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </FormGroup>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Tax rate will be applied to all orders.
                </p>
              </div>
            </Card>

            {/* Shipping Settings */}
            <Card title="Shipping Settings" icon={<Truck className="text-blue-600" size={24} />}>
              <FormGroup label="Default Shipping Fee (₱)">
                <Input
                  type="number"
                  name="shipping_fee"
                  value={settings.shipping_fee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </FormGroup>
              <FormGroup label="Free Shipping Threshold (₱)">
                <Input
                  type="number"
                  name="free_shipping_threshold"
                  value={settings.free_shipping_threshold}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </FormGroup>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  Orders above ₱{settings.free_shipping_threshold.toLocaleString()} will have free shipping.
                </p>
              </div>
            </Card>

            {/* System Settings */}
            <div className="lg:col-span-2">
              <Card title="System Settings" icon={<SettingsIcon className="text-blue-600" size={24} />}>
                <FormGroup label="Maintenance Mode">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Enable maintenance mode (site will be unavailable to users)
                    </span>
                  </label>
                </FormGroup>
                {settings.maintenance_mode && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> Maintenance mode is enabled. Users will not be able to access the site.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

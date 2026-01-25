'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Settings, Palette, School, Bell, Shield, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [schoolName, setSchoolName] = useState('Demo School');

  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#EC4899', // Pink
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage school settings and white-label customization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Info */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <School className="w-5 h-5" />
              School Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Name</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">School Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    DS
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                    Upload New
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  defaultValue="admin@demoschool.edu"
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* White Label / Theme */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              White-Label Customization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={`w-10 h-10 rounded-lg transition-transform ${
                        primaryColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Custom Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none font-mono transition-colors"
                  />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <button 
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Email notifications for new registrations', enabled: true },
                { label: 'SMS alerts for attendance issues', enabled: true },
                { label: 'Push notifications for urgent updates', enabled: false },
                { label: 'Weekly summary reports', enabled: true },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">{item.label}</span>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.enabled ? 'bg-green-500' : 'bg-muted'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-6' : ''}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your admin password</p>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage your logged-in devices</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

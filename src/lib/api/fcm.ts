// lib/api/fcm.ts
import { apiClient } from '@/lib/api/client/api'; // Adjust the import path as needed

export interface RegisterDevicePayload {
  registration_id: string;
  type?: 'web' | 'android' | 'ios';
  name?: string;
}

export interface SendNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface Device {
  id: string;
  registration_id: string;
  type: string;
  name?: string;
  created_at: string;
}

// Register FCM device with Django backend (via Next.js API route)
export const registerDevice = async (payload: RegisterDevicePayload) => {
  const response = await apiClient<Device>('/fcm/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to register device: ${response.status}`);
  }

  return response.data;
};

// Send notification to current user (via Next.js API route)
export const sendNotificationToSelf = async (payload: SendNotificationPayload) => {
  const response = await apiClient<{ success: boolean; message?: string }>('/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(response.data?.message || `Failed to send notification: ${response.status}`);
  }

  return response.data;
};

// Get list of user's devices (via Next.js API route)
export const getUserDevices = async () => {
  const response = await apiClient<Device[]>('/fcm/devices', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to get devices: ${response.status}`);
  }

  return response.data;
};

// Delete device (via Next.js API route)
export const deleteDevice = async (deviceId: string) => {
  const response = await apiClient<void>(`/fcm/devices/${deviceId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete device: ${response.status}`);
  }

  return response.data;
};
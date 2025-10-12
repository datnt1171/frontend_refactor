// lib/api/fcm.ts
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

// Register FCM device with Django backend (via Next.js API route)
export const registerDevice = async (payload: RegisterDevicePayload) => {
  const response = await fetch('/api/fcm/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register device');
  }

  return response.json();
};

// Send notification to current user (via Next.js API route)
export const sendNotificationToSelf = async (payload: SendNotificationPayload) => {
  const response = await fetch('/api/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send notification');
  }

  return response.json();
};

// Get list of user's devices (via Next.js API route)
export const getUserDevices = async () => {
  const response = await fetch('/api/fcm/devices', {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get devices');
  }

  return response.json();
};

// Delete device (via Next.js API route)
export const deleteDevice = async (deviceId: string) => {
  const response = await fetch(`/api/fcm/devices/${deviceId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete device');
  }

  return response.json();
};
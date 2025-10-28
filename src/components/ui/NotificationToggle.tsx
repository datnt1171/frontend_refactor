"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestNotificationPermission } from "@/lib/firebase";
import { registerDevice, getUserDevices, deleteDevice } from "@/lib/api/fcm";

export function NotificationToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  // Check if notifications are already enabled on mount
  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      // Check browser permission
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = Notification.permission;
        
        if (permission === "granted") {
          // Check if device is registered in backend
          const devices = await getUserDevices();
          const webDevice = devices.find((d: any) => d.type === "web");
          
          if (webDevice) {
            setIsEnabled(true);
            setCurrentDeviceId(webDevice.id);
          }
        }
      }
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      if (isEnabled) {
        // Disable notifications - delete device registration
        if (currentDeviceId) {
          await deleteDevice(currentDeviceId);
          setIsEnabled(false);
          setCurrentDeviceId(null);
          alert("Notifications disabled. You won't receive push notifications anymore.");
        }
      } else {
        // Enable notifications - request permission and register
        const token = await requestNotificationPermission();
        
        if (!token) {
          alert("Permission denied. Please allow notifications in your browser settings");
          setIsLoading(false);
          return;
        }

        // Register device with backend
        const response = await registerDevice({
          registration_id: token,
          type: "web",
          name: `Web Browser - ${new Date().toLocaleDateString()}`,
        });

        setIsEnabled(true);
        setCurrentDeviceId(response.id);
        alert("Notifications enabled. You'll now receive push notifications.");
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to update notification settings"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if browser doesn't support notifications
  if (typeof window !== "undefined" && !("Notification" in window)) {
    return null;
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isEnabled ? "default" : "outline"}
      size="default"
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isEnabled ? (
        <>
          <Bell className="h-4 w-4" />
          Notifications On
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          Enable Notifications
        </>
      )}
    </Button>
  );
}
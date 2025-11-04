"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { requestNotificationPermission } from "@/lib/firebase";
import { registerDevice, deleteDevice } from "@/lib/api/fcm";

interface NotificationToggleProps {
  currentDeviceId?: string | null;
}

export function NotificationToggle({ 
  currentDeviceId: initialDeviceId = null 
}: NotificationToggleProps) {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(!!initialDeviceId);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(initialDeviceId);

  // Sync with prop changes
  useEffect(() => {
    setIsEnabled(!!initialDeviceId);
    setCurrentDeviceId(initialDeviceId);
  }, [initialDeviceId]);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);

    try {
      if (!checked) {
        // Disable notifications - delete device registration
        if (currentDeviceId) {
          await deleteDevice(currentDeviceId);
          setIsEnabled(false);
          setCurrentDeviceId(null);
          router.refresh(); // Re-fetch server data
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
        router.refresh(); // Re-fetch server data
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to update notification settings"}`);
      // Revert the switch state on error
      setIsEnabled(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if browser doesn't support notifications
  if (typeof window !== "undefined" && !("Notification" in window)) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Label 
        htmlFor="notifications" 
        className="flex items-center gap-2 cursor-pointer"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Push Notifications
      </Label>
      <Switch 
        id="notifications" 
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
    </div>
  );
}
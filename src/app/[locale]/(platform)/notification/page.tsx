"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestNotificationPermission } from "@/lib/firebase";
import { registerDevice, sendNotificationToSelf } from "@/lib/api/fcm";

export default function NotificationPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const handleRegisterDevice = async () => {
    setIsRegistering(true);
    setMessage({ type: "", text: "" });

    try {
      // Request notification permission and get FCM token
      const token = await requestNotificationPermission();
      
      if (!token) {
        setMessage({
          type: "error",
          text: "Failed to get notification permission. Please allow notifications in your browser.",
        });
        setIsRegistering(false);
        return;
      }

      setFcmToken(token);

      // Register device with backend
      await registerDevice({
        registration_id: token,
        type: "web",
        name: `Web Browser - ${new Date().toLocaleDateString()}`,
      });
      
      setMessage({
        type: "success",
        text: "Device registered successfully! You can now receive notifications.",
      });
    } catch (error) {
      console.error("Error registering device:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to register device",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendNotification = async () => {
    if (!fcmToken) {
      setMessage({
        type: "error",
        text: "Please register your device first",
      });
      return;
    }

    setIsSending(true);
    setMessage({ type: "", text: "" });

    try {
      await sendNotificationToSelf({
        title: "Test Notification",
        body: "This is a test notification from your PWA!",
        data: {
          url: window.location.origin,
          timestamp: new Date().toISOString(),
        },
      });

      setMessage({
        type: "success",
        text: "Notification sent successfully! Check your notifications.",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send notification",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">
            Push Notifications
          </h1>
          <p className="text-slate-600">
            Test Firebase Cloud Messaging
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Actions
            </CardTitle>
            <CardDescription>
              Register your device and send test notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Register Device Button */}
            <Button
              onClick={handleRegisterDevice}
              disabled={isRegistering}
              className="w-full"
              size="lg"
              variant={fcmToken ? "outline" : "default"}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  {fcmToken ? "✓ Device Registered" : "1. Register Device"}
                </>
              )}
            </Button>

            {/* Send Notification Button */}
            <Button
              onClick={handleSendNotification}
              disabled={isSending || !fcmToken}
              className="w-full"
              size="lg"
              variant="default"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  2. Send Test Notification
                </>
              )}
            </Button>

            {/* Token Display */}
            {fcmToken && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-1">
                  FCM Token:
                </p>
                <p className="text-xs text-green-700 font-mono break-all">
                  {fcmToken.substring(0, 50)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Alert */}
        {message.text && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className={
              message.type === "success"
                ? "border-green-500 bg-green-50 text-green-900"
                : ""
            }
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>1. Click "Register Device" to enable notifications</p>
            <p>2. Allow notifications when prompted by your browser</p>
            <p>3. Click "Send Test Notification" to test</p>
            <p>4. Try minimizing the browser to test background notifications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
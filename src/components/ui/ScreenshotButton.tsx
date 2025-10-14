'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { domToPng } from 'modern-screenshot';

interface ScreenshotButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
  children?: React.ReactNode;
  imageTitle?: string;
  buttonText?: string;
  hideScreenshotClass?: boolean;
}

export const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({
  targetId,
  filename = 'screenshot.png',
  className,
  buttonText = 'Screenshot',
  children = (
    <>
      <Camera className="w-4 h-4 mr-2" />
      {buttonText}
    </>
  ),
  imageTitle,
  hideScreenshotClass = true,
}) => {
  const handleScreenshot = async () => {
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error(`Element with id "${targetId}" not found`);
        return;
      }

      // Find all scrollable parent containers
      const scrollableElements: HTMLElement[] = [];
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll' ||
            computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll' ||
            computedStyle.overflowX === 'auto' || computedStyle.overflowX === 'scroll') {
          scrollableElements.push(parent);
        }
        parent = parent.parentElement;
      }

      // Store original styles
      const originalStyles = scrollableElements.map(el => ({
        element: el,
        overflow: el.style.overflow,
        overflowX: el.style.overflowX,
        overflowY: el.style.overflowY,
        height: el.style.height,
        maxHeight: el.style.maxHeight,
      }));

      // Also store target element styles
      const targetOriginalStyles = {
        overflow: element.style.overflow,
        overflowX: element.style.overflowX,
        overflowY: element.style.overflowY,
        height: element.style.height,
        maxHeight: element.style.maxHeight,
      };

      // Temporarily modify styles to show full content
      scrollableElements.forEach(el => {
        el.style.overflow = 'visible';
        el.style.overflowX = 'visible';
        el.style.overflowY = 'visible';
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      });

      // Modify target element
      element.style.overflow = 'visible';
      element.style.overflowX = 'visible';
      element.style.overflowY = 'visible';
      element.style.height = 'auto';
      element.style.maxHeight = 'none';

      // Wait for layout changes
      await new Promise(resolve => setTimeout(resolve, 200));
      const hideElements = hideScreenshotClass 
        ? element.querySelectorAll('.screenshot-hide')
        : [];
      
      hideElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      // Take screenshot with modern-screenshot
      const dataUrl = await domToPng(element, {
        backgroundColor: '#ffffff',
        quality: 1,
        scale: 2,
      });

      // Restore all original styles
      originalStyles.forEach(({ element, overflow, overflowX, overflowY, height, maxHeight }) => {
        element.style.overflow = overflow;
        element.style.overflowX = overflowX;
        element.style.overflowY = overflowY;
        element.style.height = height;
        element.style.maxHeight = maxHeight;
      });

      // Restore target element styles
      element.style.overflow = targetOriginalStyles.overflow;
      element.style.overflowX = targetOriginalStyles.overflowX;
      element.style.overflowY = targetOriginalStyles.overflowY;
      element.style.height = targetOriginalStyles.height;
      element.style.maxHeight = targetOriginalStyles.maxHeight;
      hideElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      // If imageTitle is provided, add it to the image using canvas
      let finalDataUrl = dataUrl;
      if (imageTitle) {
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        const padding = 20;
        const titleHeight = 40;
        
        canvas.width = img.width;
        canvas.height = img.height + titleHeight;

        // Fill background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw title
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(imageTitle, padding, titleHeight / 2);

        // Draw original image below title
        ctx.drawImage(img, 0, titleHeight);

        finalDataUrl = canvas.toDataURL('image/png', 1);
      }

      // Download the image
      const link = document.createElement('a');
      link.download = filename;
      link.href = finalDataUrl;
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  return (
    <Button onClick={handleScreenshot} className={className}>
      {children}
    </Button>
  );
};
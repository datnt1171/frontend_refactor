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
}

export const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({
  targetId,
  filename = 'screenshot.png',
  className,
  children = (
    <>
      <Camera className="w-4 h-4 mr-2" />
      Screenshot
    </>
  ),
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

      // Download the image
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
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

// Alternative approach: Target the table directly instead of container
export const TableScreenshotButton: React.FC<ScreenshotButtonProps> = ({
  targetId,
  filename = 'table-screenshot.png',
  className,
  children = (
    <>
      <Camera className="w-4 h-4 mr-2" />
      Table Screenshot
    </>
  ),
}) => {
  const handleScreenshot = async () => {
    try {
      // Target the actual table element, not its container
      const tableElement = document.querySelector(`#${targetId} table`) || 
                          document.getElementById(targetId);
      
      if (!tableElement) {
        console.error(`Table element not found`);
        return;
      }

      const dataUrl = await domToPng(tableElement as HTMLElement, {
        backgroundColor: '#ffffff',
        quality: 1,
        scale: 2,
        filter: (node: Node) => {
          if (node instanceof HTMLElement) {
            return !node.classList.contains('scrollbar') && !node.style.overflow;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
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

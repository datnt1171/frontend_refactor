"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NumberRangePickerProps {
  min: number;
  max: number;
  value: { gte?: number | string; lte?: number | string };
  onChange: (value: { gte?: number; lte?: number }) => void;
  label: string;
  highlightThreshold?: number;
  columns?: number;
}

export function NumberRangePicker({ 
  min, 
  max, 
  value, 
  onChange, 
  label,
  highlightThreshold,
  columns = 7
}: NumberRangePickerProps) {
  const [open, setOpen] = useState(false);

  // Convert string values to numbers for comparison
  const gteNum = value.gte ? Number(value.gte) : undefined;
  const lteNum = value.lte ? Number(value.lte) : undefined;

  const handleNumberClick = (num: number) => {
    const currentFrom = gteNum;
    const currentTo = lteNum;

    // If both are set, start new selection
    if (currentFrom && currentTo) {
      onChange({ gte: num });
    }
    // If only 'from' is set
    else if (currentFrom && !currentTo) {
      // Clicking same number as 'from' - set as 'to' (allows same-number range)
      if (num === currentFrom) {
        onChange({ gte: num, lte: num });
      }
      // Clicking before 'from' - reset
      else if (num < currentFrom) {
        onChange({ gte: num });
      }
      // Clicking after 'from' - set as 'to'
      else {
        onChange({ gte: currentFrom, lte: num });
      }
    }
    // Neither set - set 'from'
    else {
      onChange({ gte: num });
    }
  };

  const isInRange = (num: number) => {
    if (!gteNum) return false;
    if (!lteNum) return num === gteNum;
    return num >= gteNum && num <= lteNum;
  };

  const isRangeStart = (num: number) => num === gteNum;
  const isRangeEnd = (num: number) => num === lteNum;
  const shouldHighlight = (num: number) => highlightThreshold !== undefined && num <= highlightThreshold;

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const displayText = gteNum && lteNum ? `${gteNum} - ${lteNum}` : label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !gteNum && !lteNum && "text-muted-foreground"
          )}
        >
          <span className="text-sm">{displayText}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="center" side="left">
        <div 
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={cn(
                "h-9 w-9 p-0 text-sm rounded-md font-normal transition-colors relative",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isInRange(num) && "bg-accent",
                (isRangeStart(num) || isRangeEnd(num)) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              {num}
              {shouldHighlight(num) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
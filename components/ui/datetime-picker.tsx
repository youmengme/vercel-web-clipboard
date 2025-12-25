"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
}: DateTimePickerProps) {
  const [dateStr, setDateStr] = React.useState("");
  const [hours, setHours] = React.useState("12");
  const [minutes, setMinutes] = React.useState("00");
  const [seconds, setSeconds] = React.useState("00");

  React.useEffect(() => {
    if (value) {
      const date = new Date(value);
      setDateStr(date.toISOString().split("T")[0]);
      setHours(date.getHours().toString().padStart(2, "0"));
      setMinutes(date.getMinutes().toString().padStart(2, "0"));
      setSeconds(date.getSeconds().toString().padStart(2, "0"));
    } else {
      const now = new Date();
      const future = new Date(now.getTime() + 10 * 60 * 1000); // Default 10 minutes
      setDateStr(future.toISOString().split("T")[0]);
      setHours(future.getHours().toString().padStart(2, "0"));
      setMinutes(future.getMinutes().toString().padStart(2, "0"));
      setSeconds(future.getSeconds().toString().padStart(2, "0"));
    }
  }, []);

  // Get min and max dates (minimum 10 minutes from now)
  const now = new Date();
  const minDateTime = new Date(now.getTime() + 10 * 60 * 1000);
  const minDate = minDateTime.toISOString().split("T")[0];
  const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const handleDateChange = (newDate: string) => {
    setDateStr(newDate);
    updateDateTime(newDate, hours, minutes, seconds);
  };

  const handleTimeChange = (
    newHours: string,
    newMinutes: string,
    newSeconds: string
  ) => {
    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
    updateDateTime(dateStr, newHours, newMinutes, newSeconds);
  };

  const updateDateTime = (
    d: string,
    h: string,
    m: string,
    s: string
  ) => {
    if (!d) return;

    const date = new Date(d);
    date.setHours(parseInt(h), parseInt(m), parseInt(s), 0);

    // Validate date is at least 10 minutes in the future and within 30 days
    const now = new Date();
    const minDateTime = new Date(now.getTime() + 10 * 60 * 1000);
    const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (date < minDateTime) {
      return; // Date must be at least 10 minutes in the future
    }

    if (date > maxDate) {
      return; // Date must be within 30 days
    }

    onChange(date);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const isValidDate = dateStr >= minDate && dateStr <= maxDate;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">
            过期日期
          </label>
          <div className="relative">
            <Input
              type="date"
              min={minDate}
              max={maxDate}
              value={dateStr}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={disabled}
              className={cn(
                "pl-10",
                !isValidDate && dateStr && "border-destructive"
              )}
            />
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex gap-1">
          <div className="w-20">
            <label className="mb-1.5 block text-sm font-medium">时</label>
            <Input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => {
                const val = e.target.value.padStart(2, "0").slice(0, 2);
                if (parseInt(val) <= 23) {
                  handleTimeChange(val, minutes, seconds);
                }
              }}
              disabled={disabled}
            />
          </div>
          <div className="w-20">
            <label className="mb-1.5 block text-sm font-medium">分</label>
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => {
                const val = e.target.value.padStart(2, "0").slice(0, 2);
                if (parseInt(val) <= 59) {
                  handleTimeChange(hours, val, seconds);
                }
              }}
              disabled={disabled}
            />
          </div>
          <div className="w-20">
            <label className="mb-1.5 block text-sm font-medium">秒</label>
            <Input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => {
                const val = e.target.value.padStart(2, "0").slice(0, 2);
                if (parseInt(val) <= 59) {
                  handleTimeChange(hours, minutes, val);
                }
              }}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {value && (
        <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            过期时间: {value.toLocaleString("zh-CN")}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
          >
            清除
          </Button>
        </div>
      )}

      {!value && (
        <div className="rounded-md border border-warning bg-warning/10 px-3 py-2">
          <p className="text-sm text-warning-foreground">
            未设置过期时间，默认 10 分钟后自动删除
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        * 过期时间必须在 10 分钟后且 30 天内
      </p>
    </div>
  );
}

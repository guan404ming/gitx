"use client";

import { useState, useEffect, useRef } from "react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  onRangeChange: (start: string, end: string) => void;
  defaultPreset?: "week" | "month" | "all";
  showAllTime?: boolean;
}

export function DateRangePicker({ onRangeChange, defaultPreset = "week", showAllTime = false }: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [activePreset, setActivePreset] = useState<string>("");
  const initialized = useRef(false);

  const applyPreset = (preset: string) => {
    const now = new Date();
    let start: Date, end: Date;
    if (preset === "all") {
      setRange(undefined);
      setActivePreset("all");
      onRangeChange("2008-01-01", format(now, "yyyy-MM-dd"));
      return;
    }
    if (preset === "week") {
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else {
      start = startOfMonth(now);
      end = endOfMonth(now);
    }
    setRange({ from: start, to: end });
    setActivePreset(preset);
    onRangeChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      applyPreset(defaultPreset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);
    setActivePreset("");
    if (selected?.from && selected?.to) {
      onRangeChange(
        format(selected.from, "yyyy-MM-dd"),
        format(selected.to, "yyyy-MM-dd")
      );
    }
  };

  const label = activePreset === "all"
    ? "All Time"
    : range?.from
    ? range.to
      ? `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`
      : format(range.from, "MMM d, yyyy")
    : "Pick a date range";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={activePreset === "week" ? "default" : "outline"}
        size="sm"
        onClick={() => applyPreset("week")}
      >
        This Week
      </Button>
      <Button
        variant={activePreset === "month" ? "default" : "outline"}
        size="sm"
        onClick={() => applyPreset("month")}
      >
        This Month
      </Button>
      {showAllTime && (
        <Button
          variant={activePreset === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("all")}
        >
          All Time
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(!range && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

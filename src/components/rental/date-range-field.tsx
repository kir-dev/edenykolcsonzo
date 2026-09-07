"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type Control } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

// One side (start or end) of the rental date-range form: a date picker, a time input,
// and an optional comment. Shared between the two nearly-identical halves of
// StartRentalForm to keep that file's line count in check.
export function DateRangeField({
  control,
  dateFieldName,
  timeFieldName,
  commentFieldName,
  dateLabel,
  timeLabel,
  commentLabel,
  autoFocusCalendar,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  dateFieldName: string;
  timeFieldName: string;
  commentFieldName: string;
  dateLabel: string;
  timeLabel: string;
  commentLabel: string;
  autoFocusCalendar?: boolean;
}) {
  return (
    <div className="flex flex-col space-y-6 not-md:mb-6">
      <FormField
        control={control}
        name={dateFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{dateLabel}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus={autoFocusCalendar}
                />
              </PopoverContent>
            </Popover>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={timeFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{timeLabel}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={commentFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{commentLabel}</FormLabel>
            <FormControl>
              <Textarea className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

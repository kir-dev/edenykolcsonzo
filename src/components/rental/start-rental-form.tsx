"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";
import { RentingDetails } from "~/types/renting";

const now = new Date();

const formSchema = z
  .object({
    startDate: z
      .date()
      .min(now, "The start date should not be before the current date"),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:MM"),
    startDateComment: z.string().optional(),
    endDate: z.date(),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:MM"),
    endDateComment: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "The end date should be after the start date",
    path: ["endDate"],
  });

export default function StartRentalForm({
  onSubmit,
}: {
  onSubmit: (details: RentingDetails) => void;
}) {
  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: now,
      startTime: "08:00",
      startDateComment: "",
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      endTime: "20:00",
      endDateComment: "",
    },
  });

  return (
    <Form {...formState}>
      <form
        onSubmit={formState.handleSubmit((data) =>
          onSubmit(data as RentingDetails),
        )}
        className="flex w-fit flex-col justify-center space-y-4 p-4"
      >
        <div className="mb-12 flex w-full justify-center space-x-20">
          <div className="flex flex-col space-y-6">
            <FormField
              control={formState.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kölcsönzés kezdete</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formState.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Átvétel ideje</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formState.control}
              name="startDateComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Megjegyzés a kezdő dátumhoz</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-6">
            <FormField
              control={formState.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kölcsönzés vége</FormLabel>
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formState.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leadás ideje</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formState.control}
              name="endDateComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Megjegyzés a befejezési időponthoz</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="mt-12">
          Rendelés megkezdése
        </Button>
      </form>
    </Form>
  );
}

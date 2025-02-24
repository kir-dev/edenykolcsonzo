"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";

import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

const now = new Date();

const formSchema = z
  .object({
    startDate: z
      .date()
      .min(now, "The start date should not be before the current date"),
    startTime: z.string(),
    startDateComment: z.string().optional(),
    endDate: z.date(),
    endTime: z.string(),
    endDateComment: z.string().optional(),
    rentAsACircle: z.boolean(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "The end date should be after the start date",
    path: ["endDate"],
  });

export default function StartRentalForm() {
  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: now,
      startDateComment: "",
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      endDateComment: "",
      rentAsACircle: false,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...formState}>
      <form
        onSubmit={formState.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center"
      >
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
                      variant={"outline"}
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
              <FormDescription></FormDescription>
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                      variant={"outline"}
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
              <FormDescription></FormDescription>
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

        <FormField
          control={formState.control}
          name="rentAsACircle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kölcsönzés körként</FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Rendelés megkezdése</Button>
      </form>
    </Form>
  );
}

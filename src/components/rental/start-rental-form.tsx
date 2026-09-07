"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { RentingDetails } from "~/types/renting";

import { Input } from "../ui/input";

const now = new Date();

const formSchema = z
  .object({
    title: z.string().min(1, "Adj nevet a bérlésnek"),
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
    groupId: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "The end date should be after the start date",
    path: ["endDate"],
  });

export default function StartRentalForm({
  onSubmit,
  defaultTitle,
  defaultGroupId,
}: {
  onSubmit: (details: RentingDetails) => void;
  defaultTitle?: string;
  defaultGroupId?: number;
}) {
  const { data: groups } = api.groups.getMine.useQuery();

  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle ?? "",
      startDate: now,
      startTime: "08:00",
      startDateComment: "",
      endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      endTime: "20:00",
      endDateComment: "",
      groupId: defaultGroupId ? String(defaultGroupId) : undefined,
    },
  });

  // Repeating a past rental resolves its title/group asynchronously (after this form has
  // already mounted with empty defaults), so push the values in once they arrive.
  useEffect(() => {
    if (defaultTitle !== undefined) {
      formState.setValue("title", defaultTitle);
    }
    if (defaultGroupId !== undefined) {
      formState.setValue("groupId", String(defaultGroupId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTitle, defaultGroupId]);

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg">
      <Form {...formState}>
        <form
          onSubmit={formState.handleSubmit((data) =>
            onSubmit({
              ...data,
              groupId: data.groupId ? parseInt(data.groupId) : undefined,
            }),
          )}
          className="flex w-fit flex-col justify-center space-y-4 p-4"
        >
          <FormField
            control={formState.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Bérlés neve</FormLabel>
                <FormControl>
                  <Input placeholder="Pl. Gólyatábor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formState.control}
            name="groupId"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Csoport (opcionális)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Nincs csoport kiválasztva" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groups?.map((group) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mb-12 flex w-full items-center justify-center not-md:flex-col md:space-x-20">
            <div className="flex flex-col space-y-6 not-md:mb-6">
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
    </div>
  );
}

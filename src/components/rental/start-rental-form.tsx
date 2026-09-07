"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { RentingDetails } from "~/types/renting";

import { Input } from "../ui/input";
import { DateRangeField } from "./date-range-field";

const now = new Date();

const formSchema = z
  .object({
    title: z.string().min(1, "Adj nevet a bérlésnek"),
    contactPhone: z.string().min(1, "Adj meg egy telefonszámot"),
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
  const { data: currentUser } = api.users.getCurrentUser.useQuery();
  const utils = api.useUtils();

  const updatePhoneNumberMutation = api.users.updatePhoneNumber.useMutation({
    onSuccess: () => {
      toast.success("Telefonszám elmentve a profilodban!");
      utils.users.getCurrentUser.invalidate();
    },
    onError: (error) => {
      toast.error(`Hiba történt: ${error.message}`);
    },
  });

  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultTitle ?? "",
      contactPhone: "",
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
  }, [defaultTitle, defaultGroupId, formState]);

  // Auto-fill the contact phone from the user's profile once it loads. Only do this
  // once (while the field is still untouched) so it doesn't clobber what they typed.
  useEffect(() => {
    if (
      currentUser?.phoneNumber &&
      !formState.formState.dirtyFields.contactPhone
    ) {
      formState.setValue("contactPhone", currentUser.phoneNumber);
    }
  }, [currentUser?.phoneNumber, formState]);

  const contactPhone = formState.watch("contactPhone");
  const phoneDiffersFromProfile =
    contactPhone.length > 0 &&
    contactPhone !== (currentUser?.phoneNumber ?? "");

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
            name="contactPhone"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Kapcsolattartó telefonszám</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Pl. +36 30 123 4567"
                      {...field}
                    />
                  </FormControl>
                  {phoneDiffersFromProfile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={updatePhoneNumberMutation.isPending}
                      onClick={() =>
                        updatePhoneNumberMutation.mutate({
                          phoneNumber: contactPhone,
                        })
                      }
                    >
                      Mentés a profilba
                    </Button>
                  )}
                </div>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
            <DateRangeField
              control={formState.control}
              dateFieldName="startDate"
              timeFieldName="startTime"
              commentFieldName="startDateComment"
              dateLabel="Kölcsönzés kezdete"
              timeLabel="Átvétel ideje"
              commentLabel="Megjegyzés a kezdő dátumhoz"
              autoFocusCalendar
            />
            <DateRangeField
              control={formState.control}
              dateFieldName="endDate"
              timeFieldName="endTime"
              commentFieldName="endDateComment"
              dateLabel="Kölcsönzés vége"
              timeLabel="Leadás ideje"
              commentLabel="Megjegyzés a befejezési időponthoz"
            />
          </div>

          <Button type="submit" className="mt-12">
            Rendelés megkezdése
          </Button>
        </form>
      </Form>
    </div>
  );
}

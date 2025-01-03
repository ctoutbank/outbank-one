"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ConfigurationSchema,
  schemaConfiguration,
} from "../schema/configurations-schema";
import {
  insertConfigurationFormAction,
  updateConfigurationFormAction,
} from "../_actions/configuration-formActions";

interface ConfigurationFormProps {
  initialData?: ConfigurationSchema;
  isEditing?: boolean;
}

export function ConfigurationForm({
  initialData,
  isEditing,
}: ConfigurationFormProps) {
  const router = useRouter();
  const form = useForm<ConfigurationSchema>({
    resolver: zodResolver(schemaConfiguration),
    defaultValues: initialData || {
      slug: "",
      active: true,
      lockCpAnticipationOrder: false,
      lockCnpAnticipationOrder: false,
      url: "",
    },
  });

  async function onSubmit(data: ConfigurationSchema) {
    try {
      if (isEditing) {
        await updateConfigurationFormAction(data);
      } else {
        await insertConfigurationFormAction(data);
      }
      router.push("/portal/configurations");
      router.refresh();
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lockCpAnticipationOrder"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Lock CP Anticipation Order</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lockCnpAnticipationOrder"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Lock CNP Anticipation Order</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">
            {isEditing ? "Update" : "Create"} Configuration
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/configurations")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

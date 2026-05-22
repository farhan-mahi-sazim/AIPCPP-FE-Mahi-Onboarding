import React from "react";
import { Controller } from "react-hook-form";

import { TextInput, Textarea, Checkbox, Button, Group, Stack } from "@mantine/core";

import { IDocumentEditFormProps } from "../document-details.types";

const DocumentEditForm: React.FC<IDocumentEditFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isCreateNewVersion,
  setIsCreateNewVersion,
  showCreateNewOption,
}) => {
  const { control, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Stack gap="md">
        <Controller
          name="summary_title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label="Document Title"
              placeholder="e.g., Annual Financial Report 2024"
              error={error?.message}
              disabled={isSubmitting}
              classNames={{
                input: "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
                label: "text-outline font-medium text-xs mb-1",
              }}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label="Category"
              placeholder="e.g., Finance, Legal, HR"
              error={error?.message}
              disabled={isSubmitting}
              classNames={{
                input: "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
                label: "text-outline font-medium text-xs mb-1",
              }}
            />
          )}
        />

        <Controller
          name="summary"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Textarea
              {...field}
              label="Summary"
              placeholder="Provide a comprehensive summary..."
              minRows={5}
              maxRows={12}
              error={error?.message}
              disabled={isSubmitting}
              classNames={{
                input: "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
                label: "text-outline font-medium text-xs mb-1",
              }}
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextInput
              {...field}
              label="Tags (comma-separated)"
              placeholder="e.g., revenue, growth, forecast"
              error={error?.message}
              disabled={isSubmitting}
              description="Separate tags with commas"
              classNames={{
                input: "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
                label: "text-outline font-medium text-xs mb-1",
                description: "text-outline/70 text-xs mt-1",
              }}
            />
          )}
        />

        {showCreateNewOption && (
          <Checkbox
            label="Save as new version (retains historical version)"
            checked={isCreateNewVersion}
            onChange={(event) => setIsCreateNewVersion(event.currentTarget.checked)}
            disabled={isSubmitting}
            classNames={{
              label: "text-on-surface text-sm select-none cursor-pointer",
              input:
                "cursor-pointer border-white/15 bg-surface-container checked:bg-indigo-500 checked:border-indigo-500",
            }}
          />
        )}

        <Group justify="flex-end" mt="md" gap="sm">
          <Button
            variant="subtle"
            color="gray"
            onClick={onCancel}
            disabled={isSubmitting}
            className="hover:bg-white/5 text-outline hover:text-on-surface"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6"
          >
            {isCreateNewVersion ? "Create Override" : "Save Changes"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default DocumentEditForm;

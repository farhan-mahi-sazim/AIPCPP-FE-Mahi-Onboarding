import React from "react";

import { TextInput, Textarea, Checkbox, Button, Group, Stack } from "@mantine/core";
import { Controller } from "react-hook-form";

import { STRINGS } from "@/shared/constants/strings.constants";

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
              label={STRINGS.details.form.titleLabel}
              placeholder={STRINGS.details.form.titlePlaceholder}
              error={error?.message}
              disabled={isSubmitting}
              classNames={{
                input:
                  "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
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
              label={STRINGS.details.form.categoryLabel}
              placeholder={STRINGS.details.form.categoryPlaceholder}
              error={error?.message}
              disabled={isSubmitting}
              classNames={{
                input:
                  "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
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
              label={STRINGS.details.form.summaryLabel}
              placeholder={STRINGS.details.form.summaryPlaceholder}
              autosize
              minRows={4}
              maxRows={16}
              error={error?.message}
              disabled={isSubmitting}
              classNames={{
                input:
                  "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
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
              label={STRINGS.details.form.tagsLabel}
              placeholder={STRINGS.details.form.tagsPlaceholder}
              error={error?.message}
              disabled={isSubmitting}
              description={STRINGS.details.form.tagsDescription}
              classNames={{
                input:
                  "bg-surface-container/50 border-white/5 text-on-surface focus:border-indigo-500",
                label: "text-outline font-medium text-xs mb-1",
                description: "text-outline/70 text-xs mt-1",
              }}
            />
          )}
        />

        {showCreateNewOption && (
          <Checkbox
            label={STRINGS.details.form.saveAsNewVersion}
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
            {STRINGS.details.form.cancel}
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6"
          >
            {isCreateNewVersion ? STRINGS.details.createOverride : STRINGS.details.form.saveChanges}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default DocumentEditForm;

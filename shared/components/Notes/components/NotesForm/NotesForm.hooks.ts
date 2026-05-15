import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { showNotification } from "@mantine/notifications";

import { NOTIFICATION_AUTO_CLOSE_TIMEOUT_IN_MILLISECONDS } from "@/shared/constants/app.constants";
import { parseApiErrorMessage } from "@/shared/utils/errors";

import { TNotesFormProps } from "../../Notes.types";
import {
  notesFormInitialValues,
  notesFormZodResolver,
  TNotesFormValidationSchema,
} from "./NotesForm.helpers";

const useNotesForm = ({ entityId, createNote }: TNotesFormProps) => {
  const createNoteForm = useForm<TNotesFormValidationSchema>({
    defaultValues: notesFormInitialValues,
    resolver: notesFormZodResolver,
    shouldUnregister: true,
  });

  const { reset } = createNoteForm;

  const [isError, setIsError] = useState(false);

  const onSubmit: SubmitHandler<TNotesFormValidationSchema> = async (
    values,
  ) => {
    try {
      await createNote({
        body: values,
        id: entityId,
      }).unwrap();

      showNotification({
        title: "Noted.",
        message: "Note created successfully.",
        autoClose: NOTIFICATION_AUTO_CLOSE_TIMEOUT_IN_MILLISECONDS,
        color: "green",
      });
    } catch (err) {
      setIsError(true);
      showNotification({
        title: "Could not create the note",
        message: parseApiErrorMessage(err),
        autoClose: NOTIFICATION_AUTO_CLOSE_TIMEOUT_IN_MILLISECONDS,
        color: "red",
      });
    } finally {
      reset();
    }
  };

  return {
    createNoteForm,
    onSubmit,
    isError,
  };
};

export default useNotesForm;

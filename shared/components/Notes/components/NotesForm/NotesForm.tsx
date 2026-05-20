import { Alert, Button } from "@mantine/core";
import { TextInput } from "react-hook-form-mantine";
import { FaExclamationCircle } from "react-icons/fa";
import { RxPlusCircled } from "react-icons/rx";

import { TNotesFormProps } from "../../Notes.types";
import useNotesForm from "./NotesForm.hooks";
import { useNotesFormStyles } from "./NotesForm.styles";

const Notes: React.FC<TNotesFormProps> = ({ createNote, entityId }) => {
  const { classes } = useNotesFormStyles();

  const {
    createNoteForm: {
      handleSubmit,
      formState: { isSubmitting },
      control,
    },
    onSubmit,
    isError,
  } = useNotesForm({
    entityId,
    createNote,
  });

  return (
    <>
      {isError ? (
        <Alert icon={<FaExclamationCircle size="1rem" />} title="Something went wrong" color="red">
          Could not create the note
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          name="note"
          control={control}
          required
          radius="md"
          placeholder="Add a note"
          disabled={isSubmitting}
          rightSection={
            <Button type="submit" className={classes.button} disabled={isSubmitting}>
              <RxPlusCircled size={20} />
            </Button>
          }
        />
      </form>
    </>
  );
};

export default Notes;

import { Container, Title } from "@mantine/core";

import NotesForm from "./components/NotesForm";
import NotesList from "./components/NotesList";
import { TNotesProps } from "./Notes.types";

const Notes: React.FC<TNotesProps> = ({
  fetchNotes,
  createNote,
  entityId,
  data,
  error,
  isLoading,
}) => (
  <Container fluid m="xl">
    <Title fw="lighter">Notes</Title>
    <NotesList
      entityId={entityId}
      fetchNotes={fetchNotes}
      data={data}
      error={error}
      isLoading={isLoading}
    />
    <NotesForm entityId={entityId} createNote={createNote} />
  </Container>
);

export default Notes;

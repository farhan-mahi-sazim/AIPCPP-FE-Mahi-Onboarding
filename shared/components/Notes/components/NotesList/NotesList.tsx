import { useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

import { Alert, Card, Text } from "@mantine/core";
import dayjs from "dayjs";

import LoadingComponent from "@/shared/components/LoadingComponent";
import NoData from "@/shared/components/NoData";
import { DATE_AND_TIME_FORMAT } from "@/shared/constants/app.constants";

import { TNotesListProps } from "../../Notes.types";
import { useNotesListStyles } from "./NotesList.styles";

const NotesList: React.FC<TNotesListProps> = ({
  entityId,
  fetchNotes,
  data,
  isLoading,
  error,
}) => {
  const { classes } = useNotesListStyles();

  useEffect(() => {
    async function fetchData() {
      await fetchNotes(entityId).unwrap();
    }

    if (!entityId) {
      return;
    }

    fetchData();
  }, [entityId, fetchNotes]);

  if (isLoading) {
    return <LoadingComponent visible={true} />;
  }

  if (error) {
    return (
      <Alert
        icon={<FaExclamationCircle size="1rem" />}
        title="Something went wrong"
        color="red"
      >
        Could not fetch notes.
      </Alert>
    );
  }

  return (
    <>
      {data && data.length > 0 ? (
        data.map((note: (typeof data)[number]) => (
          <Card key={note.id} className={classes.note} p="0.5em 0.7em">
            <Text>{note.note}</Text>
            <Text className={classes.timeStamp}>
              <IoTimeOutline />
              {dayjs(note.createdAt).format(DATE_AND_TIME_FORMAT)}
            </Text>
          </Card>
        ))
      ) : (
        <NoData description="No Notes" />
      )}
    </>
  );
};

export default NotesList;

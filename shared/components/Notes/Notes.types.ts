import {
  useCreateApplicantNoteMutation,
  useLazyGetApplicantNotesQuery,
} from "@/shared/redux/rtk-apis/modules/applicant-notes/applicant-notes.api";
import {
  useLeaseNoteMutation,
  useLazyLeaseNotesQuery,
} from "@/shared/redux/rtk-apis/modules/lease-notes/lease-notes.api";
import {
  usePropertyNoteMutation,
  useLazyPropertyNotesQuery,
} from "@/shared/redux/rtk-apis/modules/property-notes/property-notes.api";
import {
  useCreateTaskNoteMutation,
  useLazyGetTaskNotesQuery,
} from "@/shared/redux/rtk-apis/modules/task-notes/task-notes.api";
import {
  useLazyGetUserProfileNotesQuery,
  useCreateUserProfileNoteMutation,
} from "@/shared/redux/rtk-apis/modules/user-profile-notes/user-profile-notes.api";

type TFetch =
  | ReturnType<typeof useLazyLeaseNotesQuery>
  | ReturnType<typeof useLazyPropertyNotesQuery>
  | ReturnType<typeof useLazyGetTaskNotesQuery>
  | ReturnType<typeof useLazyGetUserProfileNotesQuery>
  | ReturnType<typeof useLazyGetApplicantNotesQuery>;
type TNoteId = {
  entityId: string;
};

export type TNotesListProps = {
  fetchNotes: TFetch[0];
  data: TFetch[1]["data"];
  error: TFetch[1]["error"];
  isLoading: TFetch[1]["isLoading"];
} & TNoteId;

export type TNotesFormProps = {
  createNote:
    | ReturnType<typeof useLeaseNoteMutation>[0]
    | ReturnType<typeof usePropertyNoteMutation>[0]
    | ReturnType<typeof useCreateTaskNoteMutation>[0]
    | ReturnType<typeof useCreateUserProfileNoteMutation>[0]
    | ReturnType<typeof useCreateApplicantNoteMutation>[0];
} & TNoteId;

export type TNotesProps = TNotesListProps & TNotesFormProps;

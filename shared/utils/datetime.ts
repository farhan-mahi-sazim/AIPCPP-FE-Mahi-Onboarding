import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { EDateFormat } from "../typedefs/enums";

dayjs.extend(utc);

export const formatDate = (
  dateTimeIsoString: string,
  outputFormat: EDateFormat = EDateFormat.SHORT,
): string => dayjs.utc(dateTimeIsoString).format(outputFormat);

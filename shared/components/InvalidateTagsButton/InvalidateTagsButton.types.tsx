import blcApi from "@/shared/redux/rtk-apis/blc/blc.api";

type TTagTypes = Parameters<typeof blcApi.util.invalidateTags>[0];

export type TInvalidateTagButtonProps = {
  tags: TTagTypes;
  buttonText: string;
};

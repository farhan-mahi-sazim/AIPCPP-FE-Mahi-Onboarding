import React from "react";

import { Button } from "@mantine/core";
import { useDispatch } from "react-redux";

import blcApi from "@/shared/redux/rtk-apis/blc/blc.api";
import { TAppDispatch } from "@/shared/redux/store";

import { TInvalidateTagButtonProps } from "./InvalidateTagsButton.types";

const InvalidateTagsButton: React.FC<TInvalidateTagButtonProps> = ({ tags, buttonText }) => {
  const dispatch = useDispatch<TAppDispatch>();

  const handleInvalidateTag = () => {
    dispatch(blcApi.util.invalidateTags([...tags]));
  };

  return (
    <Button onClick={handleInvalidateTag} color="green.9">
      {buttonText}
    </Button>
  );
};

export default InvalidateTagsButton;

import { Button } from "@mantine/core";
import { FaArrowLeft } from "react-icons/fa";

import { useBackButtonStyles } from "./BackButton.style";

const BackButton: React.FC = () => {
  const { classes } = useBackButtonStyles();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Button
      className={classes.backButton}
      leftIcon={<FaArrowLeft size={15} />}
      onClick={handleGoBack}
    >
      Go Back
    </Button>
  );
};

export default BackButton;

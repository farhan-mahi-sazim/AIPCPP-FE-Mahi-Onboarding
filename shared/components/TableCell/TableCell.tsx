import { useTableCellStyles } from "./TableCell.styles";

const TableCell: React.FC<React.ComponentPropsWithoutRef<"td">> = ({ children, ...props }) => {
  const { classes } = useTableCellStyles();
  const title = typeof children === "string" ? children : "";

  return (
    <td {...props} className={classes.cell} title={title}>
      {children}
    </td>
  );
};

export default TableCell;

import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:not(:last-child)": {
      marginBottom: "2rem",
    },
  },
  subtitle: {
    maxWidth: 700,
    display: "inline-block",
  },
}));

function SectionHeader(props) {
  const classes = useStyles();
  const { subtitle, title, size, className, ...otherProps } = props;
  if (!title && !subtitle) {
    return null;
  }
  return (
    <Box
      component="header"
      className={classes.root + (props.className ? ` ${props.className}` : "")}
      {...otherProps}
    >
      {title && (
        <Typography
          variant={`h${size}`}
          gutterBottom={props.subtitle ? true : false}
        >
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="subtitle1" className={classes.subtitle}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default SectionHeader;

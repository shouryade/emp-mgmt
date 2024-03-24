import * as React from "react";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AuthSection from "./AuthSection";
import SectionHeader from "./SectionHeader";
import { useRouter } from "../util/router";

const CredentialsBox = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Box>
        Employee Email: jane@example.com
        <br />
        Employee Password: password
        <br />
        HR Email: hr@gmail.com
        <br />
        HR Password: password
        <br />
      </Box>
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundImage:
      "url(https://www2.deloitte.com/content/dam/Deloitte/us/Images/Showcase/genai-cfo-insights.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backdropFilter: "blur(10px)",
  },
  paper: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2, 2, 2, 2),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
}));

export default function SignUpSide(props) {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        component={Paper}
        elevation={6}
        square
        className={classes.paper}
      >
        <Box textAlign={props.textAlign}>
          <SectionHeader
            title={props.title}
            subtitle={props.subtitle}
            size={props.headerSize}
          />
          <CredentialsBox />
        </Box>
        <AuthSection
          bgColor={props.bgColor}
          size={props.size}
          bgImage={props.bgImage}
          bgImageOpacity={props.bgImageOpacity}
          type="signup"
          afterAuthPath={router.query.next || "/dashboard"}
        />
        <Link href="/auth/signin" style={{ padding: "20px" }}>
          Already Signed Up? Login here
        </Link>
      </Grid>
    </Grid>
  );
}

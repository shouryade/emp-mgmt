import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "../../util/auth.js";
import { useForm } from "react-hook-form";
import {
  useAllLeaveApplications,
  updateAllLeaveApplications,
  createAllLeaveApplications,
} from "../../util/db.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: 24,
  },
}));

function EditAllLeaveApplicationsModal(props) {
  const classes = useStyles();

  const auth = useAuth();
  const [formAlert, setFormAlert] = useState(null);
  const [pending, setPending] = useState(false);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch AllLeaveApplications if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new AllLeaveApplications.
  const { data: allLeaveApplicationsData, status: allLeaveApplicationsStatus } =
    useAllLeaveApplications(props.id);

  // If we are updating an existing AllLeaveApplications
  // don't show modal until AllLeaveApplications data is fetched.
  if (props.id && allLeaveApplicationsStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.id
      ? updateAllLeaveApplications(props.id, data)
      : createAllLeaveApplications({
          owner: auth.user.id,
          section: props.section,
          ...data,
        });

    query
      .then(() => {
        // Let parent know we're done so they can hide modal
        props.onDone();
      })
      .catch((error) => {
        // Hide pending indicator
        setPending(false);
        // Show error alert message
        setFormAlert({
          type: "error",
          message: error.message,
        });
      });
  };

  return (
    <Dialog open={true} onClose={props.onDone}>
      <DialogTitle>
        {props.id && <>Update</>}
        {!props.id && <>Create</>}
        {` `}AllLeaveApplications
      </DialogTitle>
      <DialogContent className={classes.content}>
        {formAlert && (
          <Box mb={4}>
            <Alert severity={formAlert.type}>{formAlert.message}</Alert>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container={true} spacing={3}>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="number"
                label="Employee Code"
                name="empCode"
                defaultValue={
                  allLeaveApplicationsData && allLeaveApplicationsData.name
                }
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                autoFocus={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Full Name"
                name="name"
                defaultValue={
                  allLeaveApplicationsData && allLeaveApplicationsData.name
                }
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                autoFocus={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Leave type"
                name="leaveType"
                defaultValue={
                  allLeaveApplicationsData && allLeaveApplicationsData.name
                }
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="From Date"
                name="fromDate"
                defaultValue={
                  allLeaveApplicationsData && allLeaveApplicationsData.name
                }
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="To Date"
                name="toDate"
                defaultValue={
                  allLeaveApplicationsData && allLeaveApplicationsData.name
                }
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Reason for leaving"
                name="leaveReason"
                defaultValue={
                  allLeaveApplicationsData && allLeaveApplicationsData.name
                }
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={pending}
              >
                {!pending && <span>Save</span>}
                {pending && <CircularProgress size={28} />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAllLeaveApplicationsModal;

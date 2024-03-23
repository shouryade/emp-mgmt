import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "../../util/auth.js";
import { useForm } from "react-hook-form";
import { useUsers, updateUsers, createUsers } from "../../util/db.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: 24,
  },
}));

function EditUsersModal(props) {
  const classes = useStyles();

  const auth = useAuth();
  const [formAlert, setFormAlert] = useState(null);
  const [pending, setPending] = useState(false);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch Users if props.vals is defined
  // Otherwise query does nothing and we assume
  // we are creating a new Users.
  const { data: usersData, status: usersStatus } = useUsers(props.vals);

  // If we are updating an existing Users
  // don't show modal until Users data is fetched.
  if (props.vals && usersStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.vals
      ? updateUsers(props.vals, data)
      : createUsers({ owner: auth.user.id, section: props.section, ...data });

    query
      .then(() => {
        props.onDone();
      })
      .catch((error) => {
        setPending(false);
        setFormAlert({
          type: "error",
          message: error.message,
        });
      });
  };

  return (
    <Dialog open={true} onClose={props.onDone}>
      <DialogTitle>
        {props.vals && <>Update</>}
        {!props.vals && <>Create</>}
        {` `}Users
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
                type="text"
                label="First Name"
                name="firstName"
                defaultValue={usersData && usersData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                autoFocus={true}
                inputRef={register({
                  required: "Please enter a title",
                })}
              />
            </Grid>

            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Middle Name"
                name="middleName"
                defaultValue={usersData && usersData.name}
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
                label="Last Name"
                name="lastName"
                defaultValue={usersData && usersData.name}
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
                label="Gender"
                name="gender"
                defaultValue={usersData && usersData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register({
                  required: "Please enter gender",
                })}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Email"
                name="email"
                defaultValue={usersData && usersData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register({
                  required: "Please enter a title",
                })}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="phone"
                label="Contact No."
                name="number"
                defaultValue={usersData && usersData.name}
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
                label="Date of Joining"
                name="jobDate"
                defaultValue={usersData && usersData.name}
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

export default EditUsersModal;

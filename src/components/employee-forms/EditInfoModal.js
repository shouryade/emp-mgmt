import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "../../util/auth.js";
import { useForm } from "react-hook-form";
import { useInfo, updateInfo, createInfo } from "../../util/db.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: 24,
  },
}));

function EditInfoModal(props) {
  const classes = useStyles();

  const auth = useAuth();
  const [formAlert, setFormAlert] = useState(null);
  const [pending, setPending] = useState(false);
  const [value, setValue] = React.useState("female");

  const handleChange = (event) => {
    console.log(event.target);
    setValue(event.target.value);
  };

  const { register, handleSubmit, errors } = useForm();

  const { data: infoData, status: infoStatus } = useInfo(props.id);

  if (props.id && infoStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    console.log(data);
    setPending(true);

    const query = props.id
      ? updateInfo(props.id, data)
      : createInfo({ owner: auth.user.id, section: props.section, ...data });

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
        {props.id && <>Update</>}
        {!props.id && <>Create</>}
        {` `}Info
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
                defaultValue={infoData && infoData.name}
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
                label="Middle Name"
                name="middleName"
                defaultValue={infoData && infoData.name}
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
                defaultValue={infoData && infoData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <RadioGroup
                aria-label="gender"
                name="gender"
                defaultValue={infoData && infoData.gender}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio inputRef={register} />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio inputRef={register} />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio inputRef={register} />}
                  label="Other"
                />
              </RadioGroup>
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="phone"
                label="Contact No"
                name="contact"
                defaultValue={infoData && infoData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                name="email"
                defaultValue={infoData && infoData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                inputRef={register}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="number"
                label="PANcard"
                name="pan"
                defaultValue={infoData && infoData.name}
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

export default EditInfoModal;

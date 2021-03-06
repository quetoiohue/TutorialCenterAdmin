import { Button, Toolbar } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import CustomizedModal from "../../../partials/content/CustomizedModal";
import { FormTextField, validateForm } from "../../../partials/content/Form";
import userAction from "../../../store/ducks/actions/users";

const initialFormState = {
  name: "",
  password: "123123",
  password_confirmation: "123123",
  email: ""
  // role: [],
};

const AddUserForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = React.useState(initialFormState);
  const [isValidate, setIsValidate] = React.useState(true);

  const { name, password, password_confirmation, email } = formState;

  const handleChange = ({ name, value }) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = event => {
    event.preventDefault();
    const isValidateForm = validateForm(formState);
    setIsValidate(isValidateForm);

    if (!validateForm(formState)) return;
    console.log("Submitted");
    dispatch(userAction.addUser(formState));
    setFormState(initialFormState);
    handleClose();
  };

  const SubmitForm = (
    <form onSubmit={onSubmit}>
      <FormTextField
        label={"Name"}
        name="name"
        value={name}
        onChange={handleChange}
        error={!isValidate && "Name is required"}
      />
      <FormTextField
        label={"Email"}
        name="email"
        value={email}
        onChange={handleChange}
        error={!isValidate && "Email is required"}
      />
      <FormTextField
        label={"Password"}
        name="password"
        value={password}
        onChange={handleChange}
        error={!isValidate && "Password is required"}
        type="password"
      />
      <FormTextField
        label={"Password Confirm"}
        name="password_confirmation"
        value={password_confirmation}
        onChange={handleChange}
        error={!isValidate && "Password Confirm is required"}
        type="password"
      />
      <Toolbar
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={handleClose}
          style={{ marginLeft: "16px" }}
        >
          Cancel
        </Button>
      </Toolbar>
    </form>
  );
  return (
    <CustomizedModal
      open={open}
      handleClose={handleClose}
      children={SubmitForm}
    />
  );
};

AddUserForm.propTypes = {};

export default AddUserForm;

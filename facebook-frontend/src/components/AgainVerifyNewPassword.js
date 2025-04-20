import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";

const AgainVerifyNewPassword = () => {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      newpassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
      otp: Yup.number()
        .typeError("OTP must be a number")
        .required("OTP is required"),
      newpassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:4000/user/againVerify/New_password", // Ensure this matches the backend route
          values
        );
        alert(response.data); // Show success message
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert(error.response?.data || "An error occurred. Please try again.");
      }
    },
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 4, p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ width: "300px" }}>
        <TextField
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          id="otp"
          name="otp"
          label="OTP"
          value={formik.values.otp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.otp && Boolean(formik.errors.otp)}
          helperText={formik.touched.otp && formik.errors.otp}
        />
        <TextField
          fullWidth
          margin="normal"
          id="newpassword"
          name="newpassword"
          label="New Password"
          type="password"
          value={formik.values.newpassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newpassword && Boolean(formik.errors.newpassword)}
          helperText={formik.touched.newpassword && formik.errors.newpassword}
        />
        <Button
          fullWidth
          type="submit"
          variant="outlined"
          style={{marginBottom: "22px", background: "#414141", color: "white"}}
          sx={{ mt: 2 }}
        >
          Reset Password
        </Button>
      </form>
    </Box>
  );
};

export default AgainVerifyNewPassword;

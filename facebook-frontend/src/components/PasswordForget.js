// src/pages/PasswordForget.jsx
import React from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";

const PasswordForget = () => {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:4000/user/passwordForget", values);
        alert("OTP sent successfully. Please check your email.");
        navigate('/newPassowrdSet')
      } catch (error) {
        alert("Error: " + error.response?.data || error.message);
      }
    },
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4 }}>
      <Typography variant="h4">Forgot Password</Typography>
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
        <Button
          fullWidth
          type="submit"
          variant="outlined" 
          style={{marginBottom: "22px", background: "#414141", color: "white"}} 
          sx={{ mt: 2, mb: 2 }}
        >
          Send OTP
        </Button>
      </form>
    </Box>
  );
};

export default PasswordForget;

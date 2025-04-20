import { Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";




// const Login = ({ navigate }) => {
const Login = () => {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "At least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:4000/user/login", values);
        localStorage.setItem("token", response.data.token); // Store token in local storage
        alert("Login successful");
        navigate("/timeline");
      } catch (error) {
        alert("Login failed: " + error.response?.data || error.message);
      }
    },
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 4 }}
    >
      <Typography variant="h4">Login</Typography>
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
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          fullWidth
          type="submit"
          variant="outlined"
          style={{marginBottom: "22px", background: "#414141", color: "white"}}
          sx={{ mt: 2, mb: 2 }}
        >
          Login
        </Button>
      </form>
      <Link style={{marginBottom: "12px"}} to="/password-forget">Forget-Password</Link>
      <Link to="/">Sign-Up</Link>
    </Box>
  );
};

export default Login;

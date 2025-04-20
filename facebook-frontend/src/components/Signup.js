import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Box} from '@mui/material';
import { useNavigate } from "react-router";

const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
    age: Yup.number().min(18, 'Must be 18 or older').required('Required'),
});

function Signup() {
    let navigate = useNavigate();
    const handleSignup = async (values) => {
        try {
            const response = await axios.post('http://localhost:4000/user/signup', values);
            alert(response.data.message);
            if (response.data.message.includes('Please verify your OTP')) {
                navigate('/otp-verify')
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
            <h2>Signup</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '', age: '' }}
                validationSchema={SignupSchema}
                onSubmit={(values) => handleSignup(values)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Box mb={2}>
                            <Field name="name" as={TextField} label="Name" fullWidth error={!!errors.name && touched.name} helperText={touched.name && errors.name} />
                        </Box>
                        <Box mb={2}>
                            <Field name="email" as={TextField} label="Email" fullWidth error={!!errors.email && touched.email} helperText={touched.email && errors.email} />
                        </Box>
                        <Box mb={2}>
                            <Field name="password" as={TextField} label="Password" type="password" fullWidth error={!!errors.password && touched.password} helperText={touched.password && errors.password} />
                        </Box>
                        <Box mb={2}>
                            <Field name="age" as={TextField} label="Age" type="number" fullWidth error={!!errors.age && touched.age} helperText={touched.age && errors.age} />
                        </Box>
                        <Button style={{marginBottom: "22px", background: "#414141", color: "white"}} type="submit" variant="outlined" fullWidth>Signup</Button>
                        <Link to="/login">LOGIN</Link>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default Signup;

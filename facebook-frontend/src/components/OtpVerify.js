import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from "react-router";

const OtpSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    otp: Yup.string().length(4, 'Must be 4 digits').required('Required'),
});

function OtpVerify() {
    let navigate = useNavigate();
    const handleOtpVerify = async (values) => {
        try {
            const response = await axios.post('http://localhost:4000/user/otpVerify', values);
            console.log(values);
            
            alert(response.data.message);
            if (response.data.message.includes('successfully')) {
                navigate('/login')
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
            <h2>Verify OTP</h2>
            <Formik
                initialValues={{ email: '', otp: '' }}
                validationSchema={OtpSchema}
                onSubmit={(values) => handleOtpVerify(values)}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Box mb={2}>
                            <Field name="email" as={TextField} label="Email" fullWidth error={!!errors.email && touched.email} helperText={touched.email && errors.email} />
                        </Box>
                        <Box mb={2}>
                            <Field name="otp" as={TextField} label="OTP" fullWidth error={!!errors.otp && touched.otp} helperText={touched.otp && errors.otp} />
                        </Box>
                        <Button 
                        type="submit"
                        variant="outlined" 
                        style={{marginBottom: "22px", background: "#414141", color: "white"}} 
                        fullWidth>
                        Verify OTP
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default OtpVerify;

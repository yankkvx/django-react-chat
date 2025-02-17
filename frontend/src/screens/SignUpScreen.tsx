import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Link} from "react-router";
import { useAuthServiceContext } from "../context/AuthContext";
import Header from "../components/Header";
import { useState } from "react";
const SignUpScreen = () => {
    const { signUp } = useAuthServiceContext();
    const [preview, setPreview] = useState<string | null>(null);

    // Formik hook to manage form state, validation and submission
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            profile_image: null,
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};
            if (!values.username) {
                errors.username = "This field is required";
            } else if (!values.email) {
                errors.email = "This field is required";
            } else if (!values.password) {
                errors.password = "This field is required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            const { username, email, password, profile_image } = values;
            // Creating FormData object to submit the form data including image
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            if (profile_image) formData.append("profile_image", profile_image);

            // Calling the signUp function from authService and handling errors based on status code
            const status = await signUp(formData);
            if (status == 409) {
                formik.setErrors({
                    username: "This username is already taken.",
                    email: "This email is already associated with an account.",
                });
            }
            if (status == 400) {
                formik.setErrors({
                    password:
                        "Password must be at least 8 characters long and cannot contain spaces.",
                });
            }
        },
    });

    // Function to handle file input change (image selection)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            formik.setFieldValue("profile_image", file);

            // Creating FileReader to show image preview after selection
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box>
            <Header />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        marginTop: 15,
                    }}
                >
                    <Typography
                        variant="h5"
                        noWrap
                        component="h1"
                        sx={{ fontWeight: 500, pb: 2 }}
                    >
                        Sign Up
                    </Typography>
                    {/* Form for user input */}
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Box sx={{ textAlign: "center" }}>
                            {/* Profile image upload UI */}
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    margin: "0 auto",
                                    border: "1px solid",
                                    borderColor: "inherit",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    document
                                        .getElementById("profile-image-input")
                                        ?.click()
                                }
                            >
                                {/* Conditionally render profile image */}
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profile Preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                            sx={{
                                                color: "inherit",
                                                fontSize: "12px",
                                                marginBottom: 0.5,
                                            }}
                                        >
                                            <strong>Profile Image</strong>
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "inherit",
                                                fontSize: "12px",
                                            }}
                                        >
                                            Click to upload
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            {/* Hidden file input for image selection */}
                            <input
                                type="file"
                                id="profile-image-input"
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Box>
                        <TextField
                            sx={{ mt: 2 }}
                            autoFocus
                            fullWidth
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={
                                !!formik.touched.username &&
                                !!formik.errors.username
                            }
                            helperText={
                                formik.touched.username &&
                                formik.errors.username
                            }
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            autoFocus
                            fullWidth
                            label="Email"
                            id="email"
                            name="email"
                            type="text"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={
                                !!formik.touched.email && !!formik.errors.email
                            }
                            helperText={
                                formik.touched.email && formik.errors.email
                            }
                        />

                        <TextField
                            sx={{ mt: 2 }}
                            fullWidth
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={
                                !!formik.touched.password &&
                                !!formik.errors.password
                            }
                            helperText={
                                formik.touched.password &&
                                formik.errors.password
                            }
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                            <Button
                                disableElevation
                                variant="outlined"
                                sx={{
                                    color: "inherit",
                                    "&:hover": {
                                        color: "green",
                                    },
                                    borderColor: "inherit",
                                }}
                                type="submit"
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                            <Typography color="inherit">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                >
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default SignUpScreen;

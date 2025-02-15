import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";
import { useAuthServiceContext } from "../context/AuthContext";
import Header from "../components/Header";

const LoginScreen = () => {
    const { login } = useAuthServiceContext();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};
            if (!values.username) {
                errors.username = "This field is required";
            }
            if (!values.password) {
                errors.password = "This field is required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            const { username, password } = values;
            const status = await login(username, password);
            if (status == 401) {
                formik.setErrors({
                    username:
                        "Incorrect username or password. Please try again.",
                    password:
                        "Incorrect username or password. Please try again.",
                });
            }
        },
    });
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
                        Log In
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}>
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
                                LogIn
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
                                New to FlowTalk?{" "}
                                <Link
                                    to="/sign-up"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
export default LoginScreen;

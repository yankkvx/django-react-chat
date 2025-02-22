import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAuthServiceContext } from "../context/AuthContext";
import Header from "../components/Header";
import axios from "axios";
import { MAIN_URL, MEDIA_URL } from "../api-config";

const EditProfileScreen = () => {
    const { editUser, getUserDetails } = useAuthServiceContext();
    const [preview, setPreview] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState(false)

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            profile_image: null as string | null,
        },
        onSubmit: async (values) => {
            const { username, email, password, profile_image } = values;
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            if (profile_image) formData.append("profile_image", profile_image);
            await editUser(formData);
            setSuccessMessage(true)
        },
    });

    useEffect(() => {
        const loadUserData = async() => {
            try {
                const userData = await getUserDetails()
                formik.setValues({
                    username: userData.username,
                    email: userData.email,
                    password: "",
                    profile_image: userData.profile_image || null,
                });
                if (userData.profile_image) {
                    setPreview(`${MEDIA_URL}${userData.profile_image}`);
                } else {
                    setPreview(null)
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadUserData();
    }, [getUserDetails]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            formik.setFieldValue("profile_image", file);
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
            <Container component="main" maxWidth="lg">
                <Grid container spacing={4} sx={{ mt: 5 }}>
                    <Grid item xs={12} md={5}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography
                                variant="h5"
                                textAlign="center"
                                component="h1"
                                sx={{ fontWeight: 500, pb: 2 }}
                            >
                                Edit User
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={formik.handleSubmit}
                            >
                                <Box sx={{ textAlign: "center", mb: 2 }}>
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
                                                .getElementById(
                                                    "profile-image-input"
                                                )
                                                ?.click()
                                        }
                                    >
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
                                                        fontSize: "12px",
                                                        marginBottom: 0.5,
                                                    }}
                                                >
                                                    <strong>
                                                        Profile Image
                                                    </strong>
                                                </Typography>
                                                <Typography
                                                    sx={{ fontSize: "12px" }}
                                                >
                                                    Click to upload
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
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
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                />
                                <TextField
                                    sx={{ mt: 2 }}
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                                <TextField
                                    sx={{ mt: 2 }}
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                    }}
                                >
                                    <Button variant="outlined" type="submit">
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Paper elevation={3} sx={{ p: 3}}>
                            <Typography variant="h6">User servers</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar open={successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(false)}>
                <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{width: '100%'}}>
                    Profile updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditProfileScreen;

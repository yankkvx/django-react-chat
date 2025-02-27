import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
} from "@mui/material";
import { useFormik } from "formik";
import useServerService from "../../services/ServerServices";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

const ServerSection = () => {
    const { serverId: serverIdFromUrl } = useParams<{ serverId: string }>();
    const serverId = serverIdFromUrl ? Number(serverIdFromUrl) : null;

    const { getServer, getCategories, createCategory, editServer } =
        useServerService();
    const [notification, setNotification] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
        icon: null as File | null,
    });
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );

    const [categoriesFetched, setCategoriesFetched] = useState(false);

    useEffect(() => {
        if (!categoriesFetched) {
            const fetchCategories = async () => {
                try {
                    const categoriesData = await getCategories();
                    setCategories(categoriesData);
                    setCategoriesFetched(true);
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            };
            fetchCategories();
        }
    }, [categoriesFetched, getCategories]);

    useEffect(() => {
        const fetchServerData = async () => {
            if (serverId) {
                try {
                    const serverData = await getServer(serverId);
                    const categoryId =
                        categories.find(
                            (cat) => cat.name === serverData.category
                        )?.id || null;

                    setSelectedCategory(categoryId);
                    formik.setValues({
                        name: serverData.name || "",
                        category: categoryId || null,
                        description: serverData.description || "",
                        image: serverData.image || null,
                    });
                } catch (error) {
                    console.error("Error fetching server data:", error);
                }
            }
        };

        if (categoriesFetched) {
            fetchServerData();
        }
    }, [serverId, categoriesFetched, categories, getServer]);

    const handleCreateCategory = async () => {
        try {
            const formData = new FormData();
            formData.append("name", newCategory.name);
            formData.append("description", newCategory.description);
            if (newCategory.icon) {
                formData.append("icon", newCategory.icon);
            }

            const response = await createCategory(formData);
            if (response?.id) {
                setCategories([...categories, response]);
                setSelectedCategory(Number(response.id));
                formik.setFieldValue("category", Number(response.id));
            }
            setNewCategory({
                name: "",
                description: "",
                icon: null as File | null,
            });
            setOpenDialog(false);
            setNotification("Category created successfully!");
        } catch (error) {
            console.error("Error creating category:", error);
            setNotification("Failed to create category.");
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            category: selectedCategory,
            description: "",
            image: null as string | File | null,
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.category !== null) {
                formData.append("category", values.category.toString());
            }
            formData.append("description", values.description);

            if (values.image instanceof File) {
                formData.append("image", values.image);
            }

            await editServer(Number(serverId), formData);
            setSuccessMessage(true);
        },
    });

    return (
        <>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                name="name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formik.values.category ?? ""}
                                    onChange={(e) => {
                                        if (e.target.value === "new") {
                                            setOpenDialog(true);
                                            return;
                                        }
                                        formik.handleChange(e);
                                    }}
                                    error={
                                        !!formik.touched.category &&
                                        !!formik.errors.category
                                    }
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="new">
                                        + Create New Category
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={3}
                                required
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                name="description"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(event) => {
                                        if (event.target.files?.[0]) {
                                            formik.setFieldValue(
                                                "image",
                                                event.target.files[0]
                                            );
                                        }
                                    }}
                                />
                            </Button>
                            <Typography
                                variant="body2"
                                sx={{ ml: 2, display: "inline" }}
                            >
                                {formik.values.image instanceof File
                                    ? formik.values.image.name
                                    : "Current image"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ ml: 2, display: "inline" }}
                            >
                                {formik.values.image instanceof File
                                    ? formik.values.image.name
                                    : "No image selected"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                            >
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Category Name"
                        value={newCategory.name}
                        onChange={(e) =>
                            setNewCategory({
                                ...newCategory,
                                name: e.target.value,
                            })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={newCategory.description}
                        onChange={(e) =>
                            setNewCategory({
                                ...newCategory,
                                description: e.target.value,
                            })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Icon"
                        type="file"
                        inputProps={{ accept: "image/*" }}
                        onChange={(e) => {
                            const fileInput = e.target as HTMLInputElement;
                            setNewCategory({
                                ...newCategory,
                                icon: fileInput.files
                                    ? fileInput.files[0]
                                    : null,
                            });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateCategory} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage(false)}
            >
                <Alert
                    onClose={() => setSuccessMessage(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Server updated successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default ServerSection;

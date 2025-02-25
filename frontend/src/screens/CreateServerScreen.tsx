import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import useServerService from "../services/ServerServices";
import { useNavigate } from "react-router";

const CreateServerScreen = () => {
    const { getCategories, createCategory, createServer } = useServerService();
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [imageName, setImageName] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
        icon: "",
    });
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );

    const [notification, setNotification] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error(error);
                throw error;
            }
        };
        fetchCategories();
    }, [getCategories]);

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
            setNewCategory({ name: "", description: "", icon: "" });
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
            image: null,
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};
            if (!values.name) {
                errors.name = "This field is required";
            }
            if (!values.category) {
                errors.category = "This field is required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.category !== null) {
                formData.append("category", values.category.toString());
            } else {
                setNotification("Category is required");
                return;
            }
            formData.append("description", values.description);
            if (values.image) {
                formData.append("image", values.image);
            }

            try {
                const response = await createServer(formData);
                console.log("Server created:", response);
                setNotification("Server successfully created!");
                navigate(`/server/${response.id}`);
            } catch (error) {
                console.error("Error creating server:", error);
                setNotification("Failed to create server.");
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
                        component="h1"
                        sx={{ fontWeight: 500, pb: 2 }}
                    >
                        Create Server
                    </Typography>
                    {notification && (
                        <Typography sx={{ color: "green", mt: 2 }}>
                            {notification}
                        </Typography>
                    )}
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            sx={{ mt: 2 }}
                            fullWidth
                            label="Server Name"
                            id="name"
                            name="name"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={
                                !!formik.touched.name && !!formik.errors.name
                            }
                            helperText={
                                formik.touched.name && formik.errors.name
                            }
                        />
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

                        <TextField
                            sx={{ mt: 2 }}
                            fullWidth
                            label="Description"
                            id="description"
                            name="description"
                            multiline
                            rows={3}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            
                            <TextField
                                fullWidth
                                value={imageName}
                                placeholder="No file chosen"
                                InputProps={{ readOnly: true }}
                            />
                            <Button variant="contained" component='label' size='small' sx={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(event) => {
                                        if (event.currentTarget.files) {
                                            const file =
                                                event.currentTarget.files[0];
                                            formik.setFieldValue("image", file);
                                            setImageName(file.name);
                                        }
                                    }}
                                />
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
                            <Button variant="outlined" type="submit">
                                Create Server
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
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
                        onChange={(e) =>
                            setNewCategory({
                                ...newCategory,
                                icon: e.target.files ? e.target.files[0] : null,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateCategory} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateServerScreen;

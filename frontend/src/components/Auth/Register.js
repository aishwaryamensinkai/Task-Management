import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6 || formData.name.length < 3) {
      console.error(
        "Please ensure your password is at least 6 characters and your name is at least 3 characters."
      );
      return;
    }
    try {
      const data = await register(formData);
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

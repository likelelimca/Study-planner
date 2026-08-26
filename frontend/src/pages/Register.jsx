import { useState } from "react";
import { Box, Button, Input, Stack, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { api } from "@/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register({ fullName, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6} size="lg" textAlign="center">Create Account</Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <Button type="submit" colorPalette="teal" loading={loading}>Register</Button>
        </Stack>
      </form>
      <Text mt={4} textAlign="center" fontSize="sm">
        Already have an account? <ChakraLink asChild color="teal.600"><Link to="/login">Log in</Link></ChakraLink>
      </Text>
    </Box>
  );
}

import { useState } from "react";
import { Box, Button, Input, Stack, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { api, saveSession } from "@/api";

export default function Login() {
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
      const data = await api.login({ email, password });
      saveSession(data.token, data.fullName);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6} size="lg" textAlign="center">Log In</Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <Button type="submit" colorPalette="teal" loading={loading}>Log In</Button>
        </Stack>
      </form>
      <Text mt={4} textAlign="center" fontSize="sm">
        No account yet? <ChakraLink asChild color="teal.600"><Link to="/register">Register</Link></ChakraLink>
      </Text>
    </Box>
  );
}

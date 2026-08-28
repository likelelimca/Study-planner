import { useState } from "react";
import { Box, Button, Input, Stack, Heading, Text, Link as ChakraLink, HStack } from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router";
import { api, saveSession } from "@/api";
import { colors } from "@/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const justVerified = location.state?.justVerified;
  const justReset = location.state?.justReset;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      saveSession(data.token, data.fullName);
      navigate("/dashboard");
    } catch (err) {
      if (err.data?.needsVerification) {
        navigate("/verify-otp", { state: { email: err.data.email } });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg={colors.paper} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box maxW="400px" w="100%" bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px" p={8}
        boxShadow="0 6px 20px rgba(27,42,74,0.06)">
        <Heading className="font-display" mb={1} fontSize="2xl" color={colors.ink}>Welcome back</Heading>
        <Text fontSize="sm" color={colors.inkSoft} mb={6}>Log in to your study desk.</Text>
        {justVerified && (
          <Text fontSize="sm" color={colors.forest} mb={4}>Your email is verified — you can log in now.</Text>
        )}
        {justReset && (
          <Text fontSize="sm" color={colors.forest} mb={4}>Password reset — log in with your new password.</Text>
        )}
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required borderColor={colors.line} borderRadius="4px" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required borderColor={colors.line} borderRadius="4px" />
            {error && <Text color={colors.clay} fontSize="sm">{error}</Text>}
            <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }}
              borderRadius="4px" loading={loading}>Log in</Button>
          </Stack>
        </form>
        <HStack mt={5} justify="center" gap={1} fontSize="sm">
          <ChakraLink asChild color={colors.inkSoft}><Link to="/forgot-password">Forgot password?</Link></ChakraLink>
        </HStack>
        <Text mt={2} textAlign="center" fontSize="sm" color={colors.inkSoft}>
          No account yet? <ChakraLink asChild color={colors.ink} fontWeight="600"><Link to="/register">Register</Link></ChakraLink>
        </Text>
      </Box>
    </Box>
  );
}

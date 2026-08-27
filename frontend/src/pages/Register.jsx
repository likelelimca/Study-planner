import { useState, useMemo } from "react";
import { Box, Button, Input, Stack, Heading, Text, Link as ChakraLink, HStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { api } from "@/api";
import { colors } from "@/theme";

const requirements = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "A lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "An uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "A number", test: (pw) => /[0-9]/.test(pw) },
];

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = useMemo(
    () => requirements.map((req) => ({ ...req, met: req.test(password) })),
    [password]
  );
  const passwordValid = passwordChecks.every((c) => c.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setPasswordTouched(true);
      setError("Password doesn't meet all the requirements below.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({ fullName, email, password });
      navigate("/verify-otp", { state: { email, otpExpiresInSeconds: data.otpExpiresInSeconds } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg={colors.paper} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box maxW="400px" w="100%" bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px" p={8}
        boxShadow="0 6px 20px rgba(27,42,74,0.06)">
        <Heading className="font-display" mb={1} fontSize="2xl" color={colors.ink}>Set up your desk</Heading>
        <Text fontSize="sm" color={colors.inkSoft} mb={6}>Create an account to start tracking.</Text>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}
              required borderColor={colors.line} borderRadius="4px" />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required borderColor={colors.line} borderRadius="4px" />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordTouched(true)}
              required
              borderColor={colors.line}
              borderRadius="4px"
            />

            {passwordTouched && (
              <Stack gap={1} pl={1}>
                {passwordChecks.map((check) => (
                  <HStack key={check.label} gap={2}>
                    <Text
                      className="font-mono"
                      fontSize="xs"
                      color={check.met ? colors.forest : colors.inkSoft}
                    >
                      {check.met ? "✓" : "○"}
                    </Text>
                    <Text fontSize="xs" color={check.met ? colors.forest : colors.inkSoft}>
                      {check.label}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            )}

            {error && <Text color={colors.clay} fontSize="sm">{error}</Text>}
            <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }}
              borderRadius="4px" loading={loading}>Register</Button>
          </Stack>
        </form>
        <Text mt={5} textAlign="center" fontSize="sm" color={colors.inkSoft}>
          Already have an account? <ChakraLink asChild color={colors.ink} fontWeight="600"><Link to="/login">Log in</Link></ChakraLink>
        </Text>
      </Box>
    </Box>
  );
}

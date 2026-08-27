import { useState } from "react";
import { Box, Button, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { api } from "@/api";
import { colors } from "@/theme";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // If someone lands here directly without registering first, there's no
  // email to verify against — send them back to register instead.
  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await api.verifyOtp({ email, otp });
      navigate("/login", { state: { justVerified: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setResending(true);
    try {
      const data = await api.resendOtp({ email });
      setInfo(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <Box bg={colors.paper} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box maxW="400px" w="100%" bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px" p={8}
        boxShadow="0 6px 20px rgba(27,42,74,0.06)">
        <Heading className="font-display" mb={1} fontSize="2xl" color={colors.ink}>Check your email</Heading>
        <Text fontSize="sm" color={colors.inkSoft} mb={6}>
          We sent a 6-digit code to <Text as="span" fontWeight="600" color={colors.ink}>{email}</Text>.
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Input
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              textAlign="center"
              fontSize="xl"
              letterSpacing="0.3em"
              className="font-mono"
              borderColor={colors.line}
              borderRadius="4px"
            />
            {error && <Text color={colors.clay} fontSize="sm">{error}</Text>}
            {info && <Text color={colors.forest} fontSize="sm">{info}</Text>}
            <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }}
              borderRadius="4px" loading={loading}>Verify</Button>
          </Stack>
        </form>
        <Text mt={5} textAlign="center" fontSize="sm" color={colors.inkSoft}>
          Didn't get it?{" "}
          <Text as="span" color={colors.ink} fontWeight="600" cursor="pointer" onClick={!resending ? handleResend : undefined}>
            {resending ? "Sending..." : "Resend code"}
          </Text>
        </Text>
      </Box>
    </Box>
  );
}

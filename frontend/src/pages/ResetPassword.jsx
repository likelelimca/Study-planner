import { useState, useEffect, useRef, useMemo } from "react";
import { Box, Button, Input, Stack, Heading, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { api } from "@/api";
import { colors } from "@/theme";
import { passwordRequirements } from "@/utils/passwordRequirements";
import PasswordChecklist from "@/components/PasswordChecklist";
import { notifyError, notifySuccess } from "@/utils/notify";

const DEFAULT_EXPIRY_SECONDS = 600;

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    location.state?.otpExpiresInSeconds ?? DEFAULT_EXPIRY_SECONDS
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const passwordChecks = useMemo(
    () => passwordRequirements.map((req) => ({ ...req, met: req.test(newPassword) })),
    [newPassword]
  );
  const passwordValid = passwordChecks.every((c) => c.met);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const expired = secondsLeft <= 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      setPasswordTouched(true);
      notifyError("New password doesn't meet all the requirements below.");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ email, otp, newPassword });
      navigate("/login", { state: { justReset: true } });
    } catch (err) {
      notifyError(err.message);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp("");
    setResending(true);
    try {
      const data = await api.forgotPassword({ email });
      notifySuccess(data.message);
      setSecondsLeft(data.otpExpiresInSeconds ?? DEFAULT_EXPIRY_SECONDS);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <Box bg={colors.paper} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box maxW="400px" w="100%" bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px" p={8}
        boxShadow="0 6px 20px rgba(27,42,74,0.06)">
        <Heading className="font-display" mb={1} fontSize="2xl" color={colors.ink}>Enter your code</Heading>
        <Text fontSize="sm" color={colors.inkSoft} mb={2}>
          We sent a reset code to <Text as="span" fontWeight="600" color={colors.ink}>{email}</Text>.
        </Text>
        <Text className="font-mono" fontSize="sm" color={expired ? colors.clay : colors.inkSoft} mb={6}>
          {expired ? "Code expired" : `Expires in ${minutes}:${seconds}`}
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Input
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              disabled={expired}
              textAlign="center"
              fontSize="xl"
              letterSpacing="0.3em"
              className="font-mono"
              borderColor={colors.line}
              borderRadius="4px"
            />

            <Input
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setPasswordTouched(true)}
              required
              disabled={expired}
              borderColor={colors.line}
              borderRadius="4px"
            />

            {passwordTouched && <PasswordChecklist checks={passwordChecks} />}

            <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }}
              borderRadius="4px" loading={loading} disabled={expired}>
              Reset password
            </Button>
          </Stack>
        </form>

        <Text mt={5} textAlign="center" fontSize="sm" color={colors.inkSoft}>
          {expired ? "Your code expired." : "Didn't get it?"}{" "}
          <Text as="span" color={colors.ink} fontWeight="600" cursor="pointer" onClick={!resending ? handleResend : undefined}>
            {resending ? "Sending..." : "Resend code"}
          </Text>
        </Text>
      </Box>
    </Box>
  );
}

import { Box, Flex, Heading, Button, HStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { clearSession } from "@/api";

export default function Navbar() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName");

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <Box bg="teal.600" px={6} py={3}>
      <Flex justify="space-between" align="center">
        <Heading size="md" color="white">
          <Link to="/dashboard">Study Planner</Link>
        </Heading>
        <HStack gap={5} color="white">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/subjects">Subjects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/schedule">Schedule</Link>
          <HStack gap={3}>
            <Box fontSize="sm">Hi, {fullName}</Box>
            <Button size="sm" onClick={handleLogout} colorPalette="red" variant="solid">
              Logout
            </Button>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}

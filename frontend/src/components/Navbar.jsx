import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router";
import { clearSession } from "@/api";
import { colors } from "@/theme";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Subjects", to: "/subjects" },
  { label: "Tasks", to: "/tasks" },
  { label: "Schedule", to: "/schedule" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = localStorage.getItem("fullName");

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <Box bg={colors.ink} px={{ base: 4, md: 8 }} py={4}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Text className="font-display" fontSize="xl" fontWeight="600" color={colors.paper} letterSpacing="0.01em">
          <Link to="/dashboard">Study Planner</Link>
        </Text>

        <HStack gap={{ base: 4, md: 7 }} wrap="wrap">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Text
                key={item.to}
                className="font-mono"
                fontSize="xs"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color={active ? colors.highlighter : "rgba(251,248,242,0.7)"}
                borderBottomWidth="2px"
                borderBottomColor={active ? colors.highlighter : "transparent"}
                pb={1}
                _hover={{ color: colors.highlighter }}
                transition="color 0.15s ease"
              >
                <Link to={item.to}>{item.label}</Link>
              </Text>
            );
          })}
        </HStack>

        <HStack gap={4}>
          <Text fontSize="sm" color="rgba(251,248,242,0.8)">{fullName}</Text>
          <Button
            size="sm"
            onClick={handleLogout}
            bg="transparent"
            color={colors.paper}
            borderWidth="1px"
            borderColor="rgba(251,248,242,0.35)"
            _hover={{ bg: "rgba(251,248,242,0.1)" }}
          >
            Log out
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}

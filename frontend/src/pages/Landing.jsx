import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { Link } from "react-router";

export default function Landing() {
  return (
    <Box textAlign="center" mt={24}>
      <Heading size="2xl" mb={4}>Study Planner</Heading>
      <Text fontSize="lg" color="gray.500" mb={8}>
        Organize your subjects, tasks, and study sessions in one place.
      </Text>
      <Stack direction="row" gap={4} justify="center">
        <Button asChild colorPalette="teal" size="lg">
          <Link to="/login">Log In</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/register">Register</Link>
        </Button>
      </Stack>
      <Text mt={12} fontSize="sm" color="gray.400">Built by Likeleli Ruth Sesinyi</Text>
    </Box>
  );
}

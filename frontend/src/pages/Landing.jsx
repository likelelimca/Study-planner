import { Box, Heading, Text, Button, Stack, HStack } from "@chakra-ui/react";
import { Link } from "react-router";
import { colors } from "@/theme";

export default function Landing() {
  return (
    <Box bg={colors.paper} minH="100vh" px={6} py={{ base: 16, md: 24 }}>
      <Box maxW="1000px" mx="auto">
        <HStack justify="space-between" align="flex-start" gap={16} wrap="wrap-reverse">
          <Box maxW="480px">
            <Text className="font-mono" fontSize="xs" letterSpacing="0.08em" textTransform="uppercase" color={colors.inkSoft} mb={4}>
              For students juggling more than one subject
            </Text>
            <Heading className="font-display" fontSize={{ base: "4xl", md: "5xl" }} lineHeight="1.1" color={colors.ink} mb={6}>
              Keep every{" "}
              <Box as="span" position="relative" display="inline-block">
                deadline
                <Box
                  position="absolute"
                  left="-2%"
                  right="-2%"
                  bottom="0.06em"
                  height="0.4em"
                  bg={colors.highlighter}
                  opacity={0.55}
                  zIndex={-1}
                />
              </Box>{" "}
              on one card.
            </Heading>
            <Text fontSize="lg" color={colors.inkSoft} mb={8} lineHeight="1.6">
              Subjects, tasks, and study sessions — organized the way you'd
              lay out index cards on a desk, not buried in another app's
              inbox.
            </Text>
            <Stack direction="row" gap={4}>
              <Button asChild size="lg" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }} borderRadius="4px">
                <Link to="/register">Get started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" borderColor={colors.line} color={colors.ink} borderRadius="4px">
                <Link to="/login">Log in</Link>
              </Button>
            </Stack>
          </Box>

          <Box position="relative" width="280px" height="220px" display={{ base: "none", md: "block" }}>
            <IndexCardVisual
              rotate="-6deg"
              top="10px"
              left="40px"
              tab={colors.clay}
              title="Data Structures"
              line1="Assignment 3"
              line2="Due Fri"
            />
            <IndexCardVisual
              rotate="3deg"
              top="60px"
              left="0px"
              tab={colors.highlighter}
              title="NLP Seminar"
              line1="Read Ch. 4"
              line2="Tue 9:00"
            />
            <IndexCardVisual
              rotate="-2deg"
              top="115px"
              left="70px"
              tab={colors.forest}
              title="Deep Learning"
              line1="Lab session"
              line2="Completed"
            />
          </Box>
        </HStack>

        <Text mt={20} fontSize="sm" color={colors.inkSoft} textAlign="center">
          Built by Likeleli Ruth Sesinyi
        </Text>
      </Box>
    </Box>
  );
}

function IndexCardVisual({ rotate, top, left, tab, title, line1, line2 }) {
  return (
    <Box
      position="absolute"
      top={top}
      left={left}
      width="210px"
      bg="white"
      borderWidth="1px"
      borderColor={colors.line}
      borderRadius="4px"
      boxShadow="0 6px 20px rgba(27,42,74,0.12)"
      p={4}
      pl={5}
      transform={`rotate(${rotate})`}
      _before={{
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "4px",
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px",
        background: tab,
      }}
    >
      <Text className="font-display" fontWeight="600" fontSize="sm" color={colors.ink} mb={1}>
        {title}
      </Text>
      <Text className="font-mono" fontSize="xs" color={colors.inkSoft}>
        {line1}
      </Text>
      <Text className="font-mono" fontSize="xs" color={colors.inkSoft}>
        {line2}
      </Text>
    </Box>
  );
}

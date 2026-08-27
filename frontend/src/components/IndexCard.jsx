import { Box } from "@chakra-ui/react";
import { colors } from "@/theme";

export default function IndexCard({ tabColor = colors.ink, children, ...props }) {
  return (
    <Box
      position="relative"
      bg="white"
      borderWidth="1px"
      borderColor={colors.line}
      borderRadius="4px"
      pl={5}
      pr={4}
      py={4}
      _before={{
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "4px",
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px",
        background: tabColor,
      }}
      transition="transform 0.15s ease, box-shadow 0.15s ease"
      _hover={{ transform: "translateX(2px)", boxShadow: "0 2px 10px rgba(27,42,74,0.08)" }}
      {...props}
    >
      {children}
    </Box>
  );
}

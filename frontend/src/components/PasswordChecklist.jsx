import { Stack, HStack, Text } from "@chakra-ui/react";
import { colors } from "@/theme";

export default function PasswordChecklist({ checks }) {
  return (
    <Stack gap={1} pl={1}>
      {checks.map((check) => (
        <HStack key={check.label} gap={2}>
          <Text className="font-mono" fontSize="xs" color={check.met ? colors.forest : colors.inkSoft}>
            {check.met ? "✓" : "○"}
          </Text>
          <Text fontSize="xs" color={check.met ? colors.forest : colors.inkSoft}>
            {check.label}
          </Text>
        </HStack>
      ))}
    </Stack>
  );
}

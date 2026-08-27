import { useEffect, useState } from "react";
import { Box, SimpleGrid, Heading, Text, Stack, HStack, Badge } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import IndexCard from "@/components/IndexCard";
import { api } from "@/api";
import { colors, priorityColor } from "@/theme";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard().then(setStats).catch((err) => setError(err.message));
  }, []);

  return (
    <Box bg={colors.paper} minH="100vh">
      <Navbar />
      <Box p={{ base: 5, md: 8 }} maxW="900px" mx="auto">
        <Heading className="font-display" mb={7} color={colors.ink}>Dashboard</Heading>

        {error && <Text color={colors.clay}>{error}</Text>}

        {stats && (
          <>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={12}>
              <StatCard tab={colors.ink} label="Subjects" value={stats.subjectCount} />
              <StatCard tab={colors.inkSoft} label="Total Tasks" value={stats.totalTasks} />
              <StatCard tab={colors.forest} label="Completed" value={stats.completedTasks} />
              <StatCard tab={colors.highlighter} label="Completion" value={`${stats.completionRate}%`} />
            </SimpleGrid>

            <Text className="font-mono" fontSize="xs" letterSpacing="0.08em" textTransform="uppercase" color={colors.inkSoft} mb={3}>
              Upcoming deadlines
            </Text>
            <Stack gap={3}>
              {stats.upcomingDeadlines.length === 0 && (
                <Text color={colors.inkSoft}>Nothing due yet — add a task with a deadline to see it here.</Text>
              )}
              {stats.upcomingDeadlines.map((task) => (
                <IndexCard key={task._id} tabColor={priorityColor[task.priority]}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="600" color={colors.ink}>{task.title}</Text>
                      <Text fontSize="sm" color={colors.inkSoft}>{task.subjectId?.name}</Text>
                    </Box>
                    <Stack align="end" gap={1}>
                      <Badge className="font-mono" bg={priorityColor[task.priority]} color="white" fontSize="2xs">
                        {task.priority}
                      </Badge>
                      <Text fontSize="sm" color={colors.inkSoft}>{new Date(task.deadline).toLocaleDateString()}</Text>
                    </Stack>
                  </HStack>
                </IndexCard>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}

function StatCard({ tab, label, value }) {
  return (
    <IndexCard tabColor={tab} textAlign="left">
      <Text className="font-mono" fontSize="2xs" letterSpacing="0.06em" textTransform="uppercase" color={colors.inkSoft} mb={1}>
        {label}
      </Text>
      <Text className="font-display" fontSize="2xl" fontWeight="700" color={colors.ink}>
        {value}
      </Text>
    </IndexCard>
  );
}

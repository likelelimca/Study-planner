import { useEffect, useState } from "react";
import { Box, SimpleGrid, Stat, Heading, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import { api } from "@/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard().then(setStats).catch((err) => setError(err.message));
  }, []);

  return (
    <Box>
      <Navbar />
      <Box p={8}>
        <Heading mb={6}>Dashboard</Heading>

        {error && <Text color="red.500">{error}</Text>}

        {stats && (
          <>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={5} mb={10}>
              <StatCard label="Subjects" value={stats.subjectCount} />
              <StatCard label="Total Tasks" value={stats.totalTasks} />
              <StatCard label="Completed" value={stats.completedTasks} />
              <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
            </SimpleGrid>

            <Heading size="md" mb={4}>Upcoming Deadlines</Heading>
            <VStack align="stretch" gap={3}>
              {stats.upcomingDeadlines.length === 0 && (
                <Text color="gray.500">No upcoming deadlines. Add a task with a deadline to see it here.</Text>
              )}
              {stats.upcomingDeadlines.map((task) => (
                <HStack key={task._id} p={4} borderWidth={1} borderRadius="md" justify="space-between">
                  <Box>
                    <Text fontWeight="bold">{task.title}</Text>
                    <Text fontSize="sm" color="gray.500">{task.subjectId?.name}</Text>
                  </Box>
                  <VStack align="end" gap={1}>
                    <Badge colorPalette={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "gray"}>
                      {task.priority}
                    </Badge>
                    <Text fontSize="sm">{new Date(task.deadline).toLocaleDateString()}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </>
        )}
      </Box>
    </Box>
  );
}

function StatCard({ label, value }) {
  return (
    <Box borderWidth={1} borderRadius="lg" p={5} textAlign="center">
      <Stat.Root>
        <Stat.Label>{label}</Stat.Label>
        <Stat.ValueText fontSize="2xl">{value}</Stat.ValueText>
      </Stat.Root>
    </Box>
  );
}

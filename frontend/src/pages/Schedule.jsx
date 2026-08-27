import { useEffect, useState } from "react";
import { Box, Heading, Input, Button, Stack, HStack, Text, IconButton, NativeSelect, Textarea } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import IndexCard from "@/components/IndexCard";
import { api } from "@/api";
import { colors } from "@/theme";

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const loadData = () => {
    api.getSchedules().then(setSchedules).catch((err) => setError(err.message));
    api.getSubjects().then(setSubjects).catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!subjectId) {
      setError("Add a subject first, then pick it here.");
      return;
    }
    try {
      await api.createSchedule({ subjectId, date, startTime, endTime, notes });
      setDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteSchedule(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const sortedSchedules = [...schedules].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Box bg={colors.paper} minH="100vh">
      <Navbar />
      <Box p={{ base: 5, md: 8 }} maxW="700px" mx="auto">
        <Heading className="font-display" mb={7} color={colors.ink}>Study schedule</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={3} mb={10} p={5} bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px">
            <NativeSelect.Root>
              <NativeSelect.Field value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
                borderColor={colors.line} borderRadius="4px">
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
              borderColor={colors.line} borderRadius="4px" />

            <HStack>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required
                borderColor={colors.line} borderRadius="4px" />
              <Text color={colors.inkSoft} fontSize="sm">to</Text>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required
                borderColor={colors.line} borderRadius="4px" />
            </HStack>

            <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
              borderColor={colors.line} borderRadius="4px" />

            {error && <Text color={colors.clay} fontSize="sm">{error}</Text>}
            <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }} borderRadius="4px">
              Add session
            </Button>
          </Stack>
        </form>

        <Stack gap={3}>
          {sortedSchedules.length === 0 && <Text color={colors.inkSoft}>No sessions scheduled yet — add one above.</Text>}
          {sortedSchedules.map((session) => (
            <IndexCard key={session._id} tabColor={colors.forest}>
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="600" color={colors.ink}>{session.subjectId?.name}</Text>
                  <Text fontSize="sm" color={colors.inkSoft} className="font-mono">
                    {new Date(session.date).toLocaleDateString()} · {session.startTime}–{session.endTime}
                  </Text>
                  {session.notes && <Text fontSize="sm" color={colors.inkSoft} mt={1}>{session.notes}</Text>}
                </Box>
                <IconButton aria-label="Delete" size="sm" variant="ghost" color={colors.clay} onClick={() => handleDelete(session._id)}>
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </IndexCard>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

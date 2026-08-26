import { useEffect, useState } from "react";
import { Box, Heading, Input, Button, Stack, HStack, Text, IconButton, NativeSelect, Textarea } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import { api } from "@/api";

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
    <Box>
      <Navbar />
      <Box p={8} maxW="700px" mx="auto">
        <Heading mb={6}>Study Schedule</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={3} mb={8} p={5} borderWidth={1} borderRadius="lg">
            <NativeSelect.Root>
              <NativeSelect.Field value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

            <HStack>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              <Text>to</Text>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </HStack>

            <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

            {error && <Text color="red.500" fontSize="sm">{error}</Text>}
            <Button type="submit" colorPalette="teal">Add Session</Button>
          </Stack>
        </form>

        <Stack gap={3}>
          {sortedSchedules.length === 0 && <Text color="gray.500">No sessions scheduled yet — add one above.</Text>}
          {sortedSchedules.map((session) => (
            <HStack key={session._id} p={4} borderWidth={1} borderRadius="md" justify="space-between">
              <Box>
                <Text fontWeight="bold">{session.subjectId?.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(session.date).toLocaleDateString()} · {session.startTime} – {session.endTime}
                </Text>
                {session.notes && <Text fontSize="sm">{session.notes}</Text>}
              </Box>
              <IconButton aria-label="Delete" size="sm" variant="ghost" colorPalette="red" onClick={() => handleDelete(session._id)}>
                <LuTrash2 />
              </IconButton>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

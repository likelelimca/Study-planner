import { useEffect, useState } from "react";
import { Box, Heading, Input, Button, Stack, HStack, Text, IconButton, NativeSelect, Checkbox, Badge } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import { api } from "@/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const loadData = () => {
    api.getTasks().then(setTasks).catch((err) => setError(err.message));
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
      await api.createTask({ title, subjectId, deadline: deadline || undefined, priority });
      setTitle("");
      setDeadline("");
      setPriority("medium");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.updateTask(task._id, { completed: !task.completed });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box p={8} maxW="700px" mx="auto">
        <Heading mb={6}>Tasks</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={3} mb={8} p={5} borderWidth={1} borderRadius="lg">
            <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <NativeSelect.Root>
              <NativeSelect.Field value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

            <NativeSelect.Root>
              <NativeSelect.Field value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            {error && <Text color="red.500" fontSize="sm">{error}</Text>}
            <Button type="submit" colorPalette="teal">Add Task</Button>
          </Stack>
        </form>

        <Stack gap={3}>
          {tasks.length === 0 && <Text color="gray.500">No tasks yet — add one above.</Text>}
          {tasks.map((task) => (
            <HStack key={task._id} p={4} borderWidth={1} borderRadius="md" justify="space-between">
              <HStack>
                <Checkbox.Root checked={task.completed} onCheckedChange={() => toggleComplete(task)}>
                  <Checkbox.Control />
                </Checkbox.Root>
                <Box>
                  <Text textDecoration={task.completed ? "line-through" : "none"} color={task.completed ? "gray.400" : "inherit"}>
                    {task.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {task.subjectId?.name}{task.deadline && ` · Due ${new Date(task.deadline).toLocaleDateString()}`}
                  </Text>
                </Box>
              </HStack>
              <HStack>
                <Badge colorPalette={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "gray"}>
                  {task.priority}
                </Badge>
                <IconButton aria-label="Delete" size="sm" variant="ghost" colorPalette="red" onClick={() => handleDelete(task._id)}>
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

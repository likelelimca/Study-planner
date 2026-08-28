import { useEffect, useState } from "react";
import { Box, Heading, Input, Button, Stack, HStack, Text, IconButton, NativeSelect, Checkbox, Badge } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import IndexCard from "@/components/IndexCard";
import { api } from "@/api";
import { colors, priorityColor } from "@/theme";
import { notifyError, notifySuccess } from "@/utils/notify";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");

  const loadData = () => {
    api.getTasks().then(setTasks).catch((err) => notifyError(err.message));
    api.getSubjects().then(setSubjects).catch((err) => notifyError(err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId) {
      notifyError("Add a subject first, then pick it here.");
      return;
    }
    try {
      await api.createTask({ title, subjectId, deadline: deadline || undefined, priority });
      notifySuccess("Task added");
      setTitle("");
      setDeadline("");
      setPriority("medium");
      loadData();
    } catch (err) {
      notifyError(err.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.updateTask(task._id, { completed: !task.completed });
      loadData();
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      notifySuccess("Task deleted");
      loadData();
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <Box bg={colors.paper} minH="100vh">
      <Navbar />
      <Box p={{ base: 5, md: 8 }} maxW="700px" mx="auto">
        <Heading className="font-display" mb={7} color={colors.ink}>Tasks</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={3} mb={10} p={5} bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px">
            <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required
              borderColor={colors.line} borderRadius="4px" />

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

            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              borderColor={colors.line} borderRadius="4px" />

            <NativeSelect.Root>
              <NativeSelect.Field value={priority} onChange={(e) => setPriority(e.target.value)}
                borderColor={colors.line} borderRadius="4px">
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }} borderRadius="4px">
              Add task
            </Button>
          </Stack>
        </form>

        <Stack gap={3}>
          {tasks.length === 0 && <Text color={colors.inkSoft}>No tasks yet — add one above.</Text>}
          {tasks.map((task) => (
            <IndexCard key={task._id} tabColor={priorityColor[task.priority]}>
              <HStack justify="space-between">
                <HStack>
                  <Checkbox.Root checked={task.completed} onCheckedChange={() => toggleComplete(task)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control borderColor={colors.line} />
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  <Box>
                    <Text textDecoration={task.completed ? "line-through" : "none"} color={task.completed ? colors.inkSoft : colors.ink} fontWeight="600">
                      {task.title}
                    </Text>
                    <Text fontSize="sm" color={colors.inkSoft}>
                      {task.subjectId?.name}{task.deadline && ` · Due ${new Date(task.deadline).toLocaleDateString()}`}
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <Badge className="font-mono" bg={priorityColor[task.priority]} color="white" fontSize="2xs">
                    {task.priority}
                  </Badge>
                  <IconButton aria-label="Delete" size="sm" variant="ghost" color={colors.clay} onClick={() => handleDelete(task._id)}>
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </HStack>
            </IndexCard>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

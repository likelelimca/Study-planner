export const passwordRequirements = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "A lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "An uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "A number", test: (pw) => /[0-9]/.test(pw) },
];

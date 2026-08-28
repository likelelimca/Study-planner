import { toaster } from "@/components/ui/toaster";

export function notifyError(description) {
  toaster.create({
    description,
    type: "error",
    duration: 4000,
  });
}

export function notifySuccess(description) {
  toaster.create({
    description,
    type: "success",
    duration: 3000,
  });
}

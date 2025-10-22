import { toast as shadToast } from "sonner";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
};

export const toast = ({ title, description, variant = "default" }: ToastOptions) => {
  switch (variant) {
    case "success":
      shadToast.success(title, { description });
      break;
    case "destructive":
      shadToast.error(title, { description });
      break;
    default:
      shadToast(title, { description });
  }
};

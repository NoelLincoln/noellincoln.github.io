import { toast } from "sonner";

export async function handleAsync<T>(
  fn: () => Promise<T>,
  messages: { success: string; error: string }
): Promise<T | null> {
  try {
    const result = await fn();
    toast.success(messages.success);
    return result;
  } catch {
    toast.error(messages.error);
    return null;
  }
}

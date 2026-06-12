import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import { handleAsync } from "./handle-async";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("handleAsync", () => {
  it("returns the result and shows a success toast on success", async () => {
    const result = await handleAsync(() => Promise.resolve({ id: 1 }), {
      success: "Done!",
      error: "Failed.",
    });

    expect(result).toEqual({ id: 1 });
    expect(toast.success).toHaveBeenCalledWith("Done!");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("returns null and shows an error toast on failure", async () => {
    const result = await handleAsync(() => Promise.reject(new Error("boom")), {
      success: "Done!",
      error: "Failed.",
    });

    expect(result).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("Failed.");
    expect(toast.success).not.toHaveBeenCalled();
  });
});

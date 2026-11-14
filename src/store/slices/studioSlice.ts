import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export type GenKind = "image" | "video" | "audio";

export interface Generation {
  _id: string;
  kind: GenKind;
  prompt: string;
  status: "queued" | "processing" | "completed" | "failed";
  outputs: string[];
  thumbnail?: string;
  model?: string;
  creditsUsed?: number;
  aspectRatio?: string;
  createdAt: string;
  mock?: boolean;
}

interface StudioState {
  items: Generation[];
  loading: boolean;
  generating: boolean;
  error: string | null;
}

const initialState: StudioState = {
  items: [],
  loading: false,
  generating: false,
  error: null,
};

export const fetchGenerations = createAsyncThunk(
  "studio/fetch",
  async (kind: GenKind | "all" = "all") => {
    const q = kind === "all" ? "" : `?kind=${kind}`;
    const res = await fetch(`/api/generations${q}`);
    if (!res.ok) throw new Error("Failed to load creations");
    const data = await res.json();
    return data.items as Generation[];
  }
);

export const createGeneration = createAsyncThunk(
  "studio/create",
  async (payload: {
    kind: GenKind;
    prompt: string;
    aspectRatio?: string;
    model?: string;
    duration?: number;
  }) => {
    const res = await fetch(`/api/generate/${payload.kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Generation failed");
    return data as { generation: Generation; credits: number };
  }
);

const studioSlice = createSlice({
  name: "studio",
  initialState,
  reducers: {
    prependGeneration(state, action: PayloadAction<Generation>) {
      state.items.unshift(action.payload);
    },
    clearStudioError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenerations.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchGenerations.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchGenerations.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || null;
      })
      .addCase(createGeneration.pending, (s) => {
        s.generating = true;
        s.error = null;
      })
      .addCase(createGeneration.fulfilled, (s, a) => {
        s.generating = false;
        s.items.unshift(a.payload.generation);
      })
      .addCase(createGeneration.rejected, (s, a) => {
        s.generating = false;
        s.error = a.error.message || "Generation failed";
      });
  },
});

export const { prependGeneration, clearStudioError } = studioSlice.actions;
export default studioSlice.reducer;

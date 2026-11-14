import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "starter" | "premium" | "business";
  credits: number;
  createdAt?: string;
}

interface AuthState {
  user: UserProfile | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const data = await post("/api/auth/login", payload);
    return data.user as UserProfile;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: { name: string; email: string; password: string }) => {
    const data = await post("/api/auth/register", payload);
    return data.user as UserProfile;
  }
);

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  const data = await res.json();
  return data.user as UserProfile;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredits(state, action: PayloadAction<number>) {
      if (state.user) state.user.credits = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "authenticated";
      })
      .addCase(fetchMe.rejected, (s) => {
        s.user = null;
        s.status = "unauthenticated";
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.status = "unauthenticated";
      });

    for (const thunk of [loginUser, registerUser]) {
      builder
        .addCase(thunk.pending, (s) => {
          s.status = "loading";
          s.error = null;
        })
        .addCase(thunk.fulfilled, (s, a) => {
          s.user = a.payload as UserProfile;
          s.status = "authenticated";
        })
        .addCase(thunk.rejected, (s, a) => {
          s.status = "unauthenticated";
          s.error = a.error.message || "Something went wrong";
        });
    }
  },
});

export const { setCredits, clearError } = authSlice.actions;
export default authSlice.reducer;

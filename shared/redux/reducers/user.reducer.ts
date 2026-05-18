import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { TRootState } from "@/shared/redux/store";

interface IAuthenticatedUser {
  userId: number | null;
  email: string | null;
  name: string | null;
}

const initialState: IAuthenticatedUser = {
  userId: null,
  email: null,
  name: null,
};

export const authenticatedUserSlice = createSlice({
  name: "authenticatedUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthenticatedUser>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.userId = action.payload.userId;
    },

    clearUser: (state) => {
      state.email = null;
      state.name = null;
      state.userId = null;
    },
  },
});

export const { setUser, clearUser } = authenticatedUserSlice.actions;

export const selectUserId = (state: TRootState) => state.authenticatedUser.userId;

export default authenticatedUserSlice.reducer;

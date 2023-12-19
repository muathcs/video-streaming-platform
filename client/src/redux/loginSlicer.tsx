import { createSlice } from "@reduxjs/toolkit";

export interface signedState {
  signed: Boolean;
}

const initialState: signedState = {
  signed: false,
};

console.log("signed", initialState);
export const signedReducer = createSlice({
  name: "signed",
  initialState,
  reducers: {
    setSigned: (state, action) => {
      console.log("payload: ", action.payload);
      state.signed = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSigned } = signedReducer.actions;

export default signedReducer.reducer;

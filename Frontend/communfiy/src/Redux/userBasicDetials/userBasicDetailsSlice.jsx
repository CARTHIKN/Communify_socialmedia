import { createSlice } from "@reduxjs/toolkit";
import userimg from "../../images/user.png"


export const userBasicDetailsSlice = createSlice({
  name: "user_basic_details",
  initialState: {
    username: null,
    profile_picture: userimg,
  },

  reducers: {
    set_user_basic_details: (state, actions) => {
      state.username = actions.payload.username;
      state.profile_picture = actions.payload.profile_pic;
    },

  },

});


export const {set_user_basic_details} = userBasicDetailsSlice.actions
export default userBasicDetailsSlice.reducer
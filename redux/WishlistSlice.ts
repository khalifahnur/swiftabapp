import { RestaurantParam } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface WishlistState {
    value: string;
    wishlist: RestaurantParam[];
}

const initialState: WishlistState = {
    value: '',
    wishlist: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<RestaurantParam>) => {
            state.wishlist.push(action.payload);
        },
        removeToWishlist: (state, action: PayloadAction<string>) => {
            state.wishlist = state.wishlist.filter((item) => item._id !== action.payload);
        },
    },
});


export const { addToWishlist, removeToWishlist, } = cartSlice.actions;
export default cartSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import counterCart from '../CartSlice'
import wishlistItem from '../WishlistSlice'

export const Store = configureStore({
    reducer:{
        cart:counterCart,
        wishlist:wishlistItem,
    }
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch;
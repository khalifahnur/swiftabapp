import { ReservationResponse } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface menuItems{
    _id: string;
    name: string | string[];
    image:string | null | string[];
    cost: number;
    description:string;
    quantity:number;
    rate:number;
}
export interface CartItem {
    menu:menuItems[];
    restaurantId:string;
    reservationData:ReservationResponse
    userId:string
}

export interface CartState {
    value: number;
    cart: CartItem[];
}

const initialState: CartState = {
    value: 0,
    cart: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const { restaurantId, reservationData, menu, userId } = action.payload;
        
            const existingCartItem = state.cart.find(item => item.restaurantId === restaurantId);
        
            if (existingCartItem) {
                menu.forEach(newMenuItem => {
                    const existingMenuItem = existingCartItem.menu.find(m => m._id === newMenuItem._id);        
                    if (existingMenuItem) {
                        existingMenuItem.quantity += newMenuItem.quantity;
                    } else {
                        existingCartItem.menu.push(newMenuItem);
                    }
                });
            } else {
                const newMenuWithIds = menu.map(m => ({
                    ...m,
                    id: m._id ,
                }));
        
                state.cart.push({
                    restaurantId,
                    reservationData,
                    menu: newMenuWithIds,
                    userId
                });
            }
        
            console.log("Updated cart:", state.cart.flatMap((item)=>item.menu));
        },
        

        removeItems: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.map((item) => ({
                ...item,
                menu: item.menu.filter((menuItem) => menuItem._id !== action.payload),
            })).filter(item => item.menu.length > 0);
        },

        emptyCart: (state) => {
            state.cart = [];
        }
    },
});



export const { addToCart, removeItems, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;

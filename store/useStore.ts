import { create } from 'zustand';

interface StoreState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  guestCount: number;
  setGuestCount: (count: number) => void;

  selectedTableId: string | null;
  setSelectedTable: (tableId: string) => void;

  selectedStartTime: string | null;
  setSelectedStartTime: (time: string) => void;

  selectedEndTime: string | null;
  setSelectedEndTime: (time: string) => void;

  selectedFloorTxt: string;
  setSelectedFloorTxt: (floor: string) => void;

  hasActiveReservation: boolean;
  setHasActiveReservation: (hasReservation: boolean) => void;

  isRemind: boolean;
  setIsRemind: (isRemind:boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  selectedDate: "",
  setSelectedDate: (date) => set({ selectedDate: date }),

  guestCount: 1,
  setGuestCount: (count) => set({ guestCount: count }),

  selectedTableId: null,
  setSelectedTable: (tableId) => set({ selectedTableId: tableId }),

  selectedStartTime: null,
  setSelectedStartTime: (time) => set({ selectedStartTime: time }),

  selectedEndTime: null,
  setSelectedEndTime: (time) => set({ selectedEndTime: time }),

  selectedFloorTxt: "",
  setSelectedFloorTxt: (floor) => {
    set((state) => ({
      ...state,
      selectedFloorTxt: floor,
    }));
  },

  hasActiveReservation: false, 
  setHasActiveReservation: (hasReservation) =>
    set({ hasActiveReservation: hasReservation }),

  isRemind: false,
  setIsRemind: (reminder) => set({ isRemind: reminder }),
}));

export default useStore;

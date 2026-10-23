import type { TaskPriority } from "@ape/shared";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type PriorityFilter = "all" | TaskPriority;

interface TaskUiState {
  searchQuery: string;
  priorityFilter: PriorityFilter;
  bookmarkedIds: string[];
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (filter: PriorityFilter) => void;
  toggleBookmark: (id: string) => void;
  resetFilters: () => void;
}

export const useTaskUiStore = create<TaskUiState>()(
  immer((set) => ({
    searchQuery: "",
    priorityFilter: "all",
    bookmarkedIds: ["1"],
    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),
    setPriorityFilter: (filter) =>
      set((state) => {
        state.priorityFilter = filter;
      }),
    toggleBookmark: (id) =>
      set((state) => {
        const index = state.bookmarkedIds.indexOf(id);
        if (index >= 0) {
          state.bookmarkedIds.splice(index, 1);
        } else {
          state.bookmarkedIds.push(id);
        }
      }),
    resetFilters: () =>
      set((state) => {
        state.searchQuery = "";
        state.priorityFilter = "all";
      }),
  })),
);

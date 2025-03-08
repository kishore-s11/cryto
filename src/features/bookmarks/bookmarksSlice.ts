import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface Bookmark {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

interface BookmarksState {
  bookmarks: Bookmark[];
}

const initialState: BookmarksState = {
  bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
};

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<Bookmark>) => {
      const index = state.bookmarks.findIndex((bookmark) => bookmark.id === action.payload.id);
      
      if (index >= 0) {
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.push(action.payload);
      }
      
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },
  },
});

export const { toggleBookmark } = bookmarksSlice.actions;

export const selectBookmarks = (state: RootState) => state.bookmarks.bookmarks;

export default bookmarksSlice.reducer;
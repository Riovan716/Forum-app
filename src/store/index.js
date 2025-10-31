import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import leaderboardsReducer from '../features/leaderboards/leaderboardsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    leaderboards: leaderboardsReducer,
  },
});

export default store;

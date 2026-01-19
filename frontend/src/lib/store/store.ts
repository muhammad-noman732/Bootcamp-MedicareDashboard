import { configureStore } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from './middleware/errorMiddleware';
import { api } from './services/api';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer
    },

    middleware: (getdefaultMiddleware) =>
        getdefaultMiddleware().concat(api.middleware, rtkQueryErrorLogger)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
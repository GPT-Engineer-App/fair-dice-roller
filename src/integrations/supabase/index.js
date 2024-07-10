import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### Users

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| created_at | timestamptz | string | true     |

*/

// Hooks for Users table
export const useUsers = () => useQuery({
    queryKey: ['Users'],
    queryFn: () => fromSupabase(supabase.from('Users').select('*')),
});

export const useUser = (id) => useQuery({
    queryKey: ['Users', id],
    queryFn: () => fromSupabase(supabase.from('Users').select('*').eq('id', id).single()),
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser) => fromSupabase(supabase.from('Users').insert([newUser])),
        onSuccess: () => {
            queryClient.invalidateQueries('Users');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedUser) => fromSupabase(supabase.from('Users').update(updatedUser).eq('id', updatedUser.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('Users');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Users').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('Users');
        },
    });
};
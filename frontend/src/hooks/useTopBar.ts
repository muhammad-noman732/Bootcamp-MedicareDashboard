import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi";
import { useLogout } from "@/hooks/useLogout";

export function useTopBar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const lastPathRef = useRef(location.pathname);

    const urlSearch = useMemo(() => searchParams.get("search") || "", [searchParams]);
    const [searchValue, setSearchValue] = useState("");
    const debouncedValue = useDebounce(searchValue, 400);

    const { data: userResponse } = useGetCurrentUserQuery(undefined);
    const { handleLogout, isLoading: isLoggingOut } = useLogout();

    const formattedDate = useMemo(() => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date()).replace(/(\d+)\s/, '$1, ');
    }, []);

    const user = userResponse?.data;

    useEffect(() => {
        if (lastPathRef.current !== location.pathname) {
            setSearchValue("");
            lastPathRef.current = location.pathname;
        }
    }, [location.pathname]);

    useEffect(() => {
        // Only sync debouncedValue to URL if:
        // 1. the value actually changed
        // 2. and it's NOT just the empty value from a tab switch (unless user explicitly cleared it)

        if (searchValue === "" && urlSearch !== "") {
            // If input is empty but URL has search, we leave it alone (placeholder handles UI)
            // unless this was a manual clear? No, clear button handles manual clear.
            return;
        }

        if (debouncedValue !== urlSearch && searchValue !== "") {
            const nextParams = new URLSearchParams(searchParams.toString());
            if (debouncedValue) {
                nextParams.set("search", debouncedValue);
            } else {
                nextParams.delete("search");
            }
            nextParams.set("page", "1");
            setSearchParams(nextParams, { replace: true });
        }
    }, [debouncedValue, urlSearch, setSearchParams, searchParams, searchValue]);

    const handleSearchSubmit = useCallback(() => {
        if (searchValue) {
            const nextParams = new URLSearchParams(searchParams.toString());
            nextParams.set("search", searchValue);
            nextParams.set("page", "1");
            setSearchParams(nextParams, { replace: true });
            setSearchValue("");
        }
    }, [searchValue, searchParams, setSearchParams]);

    const handleClearSearch = useCallback(() => {
        setSearchValue("");
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("search");
        nextParams.set("page", "1");
        setSearchParams(nextParams, { replace: true });
    }, [searchParams, setSearchParams]);

    return {
        searchValue,
        setSearchValue,
        activeSearch: urlSearch,
        user,
        isLoggingOut,
        handleLogout,
        formattedDate,
        handleSearchSubmit,
        handleClearSearch
    };
}

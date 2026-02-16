import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCurrentUserQuery } from "@/lib/store/services/auth/authApi";
import { useLogout } from "@/hooks/useLogout";

export function useTopBar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(searchValue, 400);

    const activeSearch = searchParams.get("search") || "";
    const [shouldClearUrl, setShouldClearUrl] = useState(true);

    const { data: userResponse } = useGetCurrentUserQuery();
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
        const newParams = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            newParams.set("search", debouncedSearch);
            setShouldClearUrl(true);
        } else if (shouldClearUrl) {
            newParams.delete("search");
        }

        if (newParams.toString() !== searchParams.toString()) {
            if (newParams.get("search")) {
                newParams.set("page", "1");
            }
            setSearchParams(newParams, { replace: true });
        }
    }, [debouncedSearch, setSearchParams, searchParams, shouldClearUrl]);

    const handleSearchSubmit = () => {
        if (searchValue) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("search", searchValue); // Ensure URL is set immediately
            newParams.set("page", "1");
            setSearchParams(newParams, { replace: true });

            setShouldClearUrl(false);
            setSearchValue("");
        }
    };

    const handleClearSearch = () => {
        setShouldClearUrl(true);
        setSearchValue("");
    };

    return {
        searchValue,
        setSearchValue,
        activeSearch,
        user,
        isLoggingOut,
        handleLogout,
        formattedDate,
        handleSearchSubmit,
        handleClearSearch
    };
}
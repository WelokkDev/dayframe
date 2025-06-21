export const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, {
        ...options,
        credentials: "include", // ensures HttpOnly cookie is sent
    });

    if (res.status === 401) {
        // Attempt to refresh token
        const refreshRes = await fetch("http://localhost:3000/refresh", {
            method: "POST",
            credentials: "include"
        });

        if (refreshRes.ok) {
            // Retry original request
            res = await fetch(url, {
                ...options,
                credentials: "include"
            });
        }
    }

    return res;
};
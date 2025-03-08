import { getSession } from "next-auth/react";

export const userSession = async () => {
    try {
        const session = await getSession();
        return session;
    } catch (err) {
        console.error("Error fetching session:", err);
        return null;
    }
};

"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    LogOut,
    UserRound,
    Heart,
    CircleCheck,
    Sun,
    Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { userSession } from "@/app/utils/config/userSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Reusable MenuItem component
const MenuItem = ({ href, icon: Icon, label }) => (
    <DropdownMenuItem asChild>
        <Link href={href} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </Link>
    </DropdownMenuItem>
);

const UserNavigation = () => {
    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();
    const [profile, setProfile] = useState({
        isAuthenticated: false,
        name: "",
        shortname: "",
        image: "",
        loading: true,
    });

    const fetchSession = useCallback(async () => {
        try {
            const session = await userSession();
            if (session?.user) {
                const fullName = session.user.name || "User";
                setProfile({
                    isAuthenticated: true,
                    name: fullName,
                    shortname: fullName.charAt(0).toUpperCase(),
                    image: session.user.profilePic || "https://github.com/shadcn.png",
                    loading: false,
                });
            } else {
                setProfile((prev) => ({ ...prev, isAuthenticated: false, loading: false }));
            }
        } catch (err) {
            console.error("Error fetching user session:", err);
            setProfile((prev) => ({ ...prev, loading: false }));
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const handleThemeToggle = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    const themeIcon = useMemo(() => {
        return resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4 text-yellow-400" />
        ) : (
            <Moon className="h-4 w-4" />
        );
    }, [resolvedTheme]);

    return (
        <div className="flex justify-between items-center bg-indigo-700 dark:bg-[#161c27] sticky px-6 py-4 top-0 left-0 z-50">
            <Link href="/" className="text-white text-2xl font-bold">
                Events.
            </Link>
            {profile.isAuthenticated ? (
                profile.loading ? (
                    <Avatar>
                        <AvatarFallback>...</AvatarFallback>
                    </Avatar>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={profile.image} className="w-10 h-10 rounded-full object-cover" />
                                <AvatarFallback>{profile.shortname}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{profile.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <MenuItem href="/profile" icon={UserRound} label="Profile" />
                                <MenuItem href="/events/my-events" icon={Heart} label="My Events" />
                                <MenuItem href="/my-bookings" icon={CircleCheck} label="My Bookings" />
                            </DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleThemeToggle}>
                                {themeIcon}
                                <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/api/auth/signout")}>
                                <LogOut className="h-4 w-4 text-[#e23636]" />
                                <span className="text-[#e23636]">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            ) : (
                <Button onClick={() => router.push("/login")} className="bg-indigo-700 text-white hover:bg-blue-900 px-6 py-2 rounded-md cursor-pointer">
                    Login
                </Button>
            )}
        </div>
    );
};

export default UserNavigation;

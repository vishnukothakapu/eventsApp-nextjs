"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  UserRound,
  Heart,
  CalendarCheck,
  Sun,
  Moon,
  Ticket,
  Settings,
  HelpCircle,
  Sparkles,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const MenuItem = ({ href, icon: Icon, label, className }) => (
  <DropdownMenuItem className={cn("group", className)} asChild>
    <Link href={href} className="flex items-center gap-3 w-full p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
      <span className="flex items-center justify-center p-2 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-all">
        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      </span>
      <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
    </Link>
  </DropdownMenuItem>
);

const UserNavigation = () => {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState({
    isAuthenticated: false,
    name: "",
    shortname: "",
    image: "",
    email: "",
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
          shortname: fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          image: session.user.profilePic || "",
          email: session.user.email || "",
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
    setIsMounted(true);
  }, [fetchSession]);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const themeIcon = useMemo(() => {
    return resolvedTheme === "dark" ? (
      <Sun className="h-4 w-4 text-yellow-400" />
    ) : (
      <Moon className="h-4 w-4 text-indigo-700" />
    );
  }, [resolvedTheme]);

  if (!isMounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-950/90 dark:border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
     
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Eventify
          </span>
          <span className="h-6 w-2 rounded-full bg-indigo-600"></span>
        </Link>

        {profile.loading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {themeIcon}
            </Button>

            {profile.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile.image} alt={profile.name} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                        {profile.shortname}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                        {profile.name}
                      </p>
                      <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                        {profile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-800" />
                  <DropdownMenuGroup className="space-y-1 px-1">
                    <MenuItem href="/profile" icon={UserRound} label="My Profile" />
                    <MenuItem href="/events/my-events" icon={Heart} label="My Events" />
                    <MenuItem href="/my-bookings" icon={Ticket} label="My Bookings" />
                                          <DropdownMenuSeparator className="my-2 bg-gray-200 dark:bg-gray-800" />
                                          </DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/api/auth/signout")}
                    className="group px-3 py-2 focus:bg-red-50 dark:focus:bg-red-900/30 rounded-lg"
                  >
                    <span className="flex items-center justify-center p-2 rounded-lg bg-red-100/50 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-all mr-3">
                      <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </span>
                    <span className="font-medium text-red-600 dark:text-red-400">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="hidden sm:inline-flex border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 dark:shadow-indigo-900/30"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default UserNavigation;
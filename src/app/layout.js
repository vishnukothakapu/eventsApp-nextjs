import React from "react";
import localFont from "next/font/local";
import {Poppins} from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import UserNavigation from "@/app/components/UserNavigation";
import { ThemeProvider } from "@/components/theme-provider";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
});

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "Eventify - Event Management Platform",
    description: "Eventify is a powerful platform to create, manage, and share events with ease. Organize your next conference, meetup, or gathering with intuitive tools and real-time collaboration.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable}font-poppins antialiased bg-white dark:bg-[#020817] `}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserNavigation />
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
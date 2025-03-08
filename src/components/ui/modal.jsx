"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Shadcn utility for className concatenation

export const Modal = ({ isOpen, onClose, children, title,onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-[90%] max-w-lg rounded-md shadow-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✖
                    </button>
                </div>
                <div className="p-4">{children}</div>
                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={onClose}
                        className={cn(
                            "px-4 py-2 mr-2 rounded-md border",
                            "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() =>{onSave}}
                        className={cn(
                            "px-4 py-2 rounded-md border",
                            "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                    >
                       Save
                    </button>
                </div>
            </div>
        </div>
    );
};

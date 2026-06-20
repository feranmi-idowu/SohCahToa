"use client"

import { useState } from "react"
import { LoginFormTypes } from "@/lib/types"


export default function FormField ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    marginClass = "mb-4",
  }: LoginFormTypes) {
    return (
        <div className={marginClass}>
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand text-foreground"
          />
        </div>
      );
}
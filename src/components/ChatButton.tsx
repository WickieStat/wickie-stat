"use client";
import type { ReactNode } from "react";
import { openChat } from "@/lib/chatEvents";

/** A button anywhere on the site that opens the assistant. */
export default function ChatButton({
  children, message, enquiry, className = "btn btn-ghost",
}: { children: ReactNode; message?: string; enquiry?: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => openChat({ message, enquiry })}>
      {children}
    </button>
  );
}

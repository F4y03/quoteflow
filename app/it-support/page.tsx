import type { Metadata } from "next";
import { SupportConsole } from "./_components/support-console";
export const metadata: Metadata = { title: "IT Support Assistant | QuoteFlow", description: "IT operations and network diagnostic workspace" };
export default function ITSupportPage() { return <SupportConsole />; }

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 bg-white m-10 rounded-sm w-full">
      <h1 className="text-4xl font-light">
        Welcome to {""}
        <span className="text-blue-400 font-semibold"> AI Assistant</span>
      </h1>
      <h2 className=" mt-2 mb-10"> Your customisable AI chat agent that helps you manage your customer conversations </h2>
      <Link href="/create-chatbot">
        <Button className="bg-[#64b1f2]"> Let&apos;s  get started by creating your first ai-chatbot </Button>

      </Link>
    </main>
  );
}

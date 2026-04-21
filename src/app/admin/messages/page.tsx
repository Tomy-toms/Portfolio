import { prisma } from "@/lib/prisma";
import { MessagesAdmin } from "./MessagesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-ink-300">
          {messages.length} total · {messages.filter((m) => !m.read).length} unread
        </p>
      </div>
      <MessagesAdmin initialMessages={messages} />
    </div>
  );
}

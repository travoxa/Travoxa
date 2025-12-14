'use client';

import { useState } from 'react';

import type { GroupMessage } from '@/data/backpackers';

import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';

interface ChatRoomProps {
  groupId: string;
  initialMessages: GroupMessage[];
}

export default function ChatRoom({ groupId, initialMessages }: ChatRoomProps) {
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);

  const refreshMessages = async () => {
    const response = await fetch(`/api/groups/${groupId}/chat`);
    if (!response.ok) return messages;
    const data = await response.json();
    if (Array.isArray(data?.messages)) {
      setMessages(data.messages);
      return data.messages;
    }
    return messages;
  };

  const handleMessageSent = (message: GroupMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChatMessages messages={messages} onRefresh={refreshMessages} />
      <ChatInput groupId={groupId} onMessageSent={handleMessageSent} />
    </div>
  );
}

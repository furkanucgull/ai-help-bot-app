import ChatBotSessions from '@/components/ChatBotSessions';
import { GET_USER_CHATBOTS } from '@/graphql/queries/queries';
import { serverClient } from '@/lib/server/serverClient';
import { Chatbot, GetChatbotsByUserData, GetChatbotsByUserDataVariables } from '@/types/types';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const ReviewSessions = async () => {
    const { userId } = await auth();
    if (!userId) return;

    const { data, error } = await serverClient.query<GetChatbotsByUserData, GetChatbotsByUserDataVariables>({
        query: GET_USER_CHATBOTS,
    });
    if (error) {
        console.error("API Error:", error);
    }

    const chatbotsList = data.chatbotsList.filter(chatbot => chatbot.clerk_user_id === userId);
    //console.log("data", chatbotsList);
    const sortedChatbotsByUser: Chatbot[] = chatbotsList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className='flex-1 px-10'>
            <h1 className='text-xl lg:text-3xl font-semibold mt-10' >Chat Sessions</h1>
            <h2 className='mb-5'>Review all the chat sessions the chat bots have had with your customers</h2>
            <ChatBotSessions chatbots={sortedChatbotsByUser} />
        </div>
    );
};

export default ReviewSessions;
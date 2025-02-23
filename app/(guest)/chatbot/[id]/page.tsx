/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GetChatbotByIdResponse, Message, MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables } from '@/types/types';
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import startNewChat from '@/lib/startNewChat';
import Avatar from '@/components/Avatar';
import { useQuery } from '@apollo/client';
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from '@/graphql/queries/queries';
import Messages from '@/components/Messages';

function ChatbotPage() {
    const params = useParams();
    const id = params.id as string;
    const created_at = new Date().toISOString();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [chatId, setChatId] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
        GET_CHATBOT_BY_ID,
        {
            variables: { id }
        }
    );

    const { loading: loadingQuery,
        error,
        data
    } = useQuery<MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables>(GET_MESSAGES_BY_CHAT_SESSION_ID,
        {
            variables: { chat_session_id: chatId, },
            skip: !chatId,
        }
    );
    useEffect(() => {
        if (data) {
            setMessages(data.chat_sessions.messages);
        }
    }, [data]);



    const handleInformationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const chatId = await startNewChat(name, email, Number(id), created_at);
        setChatId(chatId);
        setLoading(false);
        setIsOpen(false);
    };
    return <div className='w-full flex bg-gray-100'>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='sm:max-w-[425px]'>
                <form className='flex-1' onSubmit={handleInformationSubmit}>
                    <DialogHeader>
                        <DialogTitle> Lets help you out!</DialogTitle>
                        <DialogDescription> I just need a few details to get started</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className=' grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='name' className='text-right'>
                                Name
                            </Label>
                            <Input
                                id='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='John Doe'
                                className='col-span-3'
                            />
                        </div>
                        <div className=' grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='name' className='text-right'>
                                Email
                            </Label>
                            <Input
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='example@mail.com'
                                className='col-span-3'
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='submit' disabled={!name || !email || loading}>
                            {!loading ? "Continue" : "Loading"}
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
        <div className='flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10'>
            <div className='pb-4 border-b sticky top-0 z-50 bg-[#4d7dfb] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4'>

                <Avatar seed={chatBotData?.chatbots.name!} className='h-12 w-12 bg-white rounded-full border-2 border-white' />
                <div>
                    <h1 className='truncate text-lg '>{chatBotData?.chatbots.name} </h1>
                    <p className='text-sm text-gray-300'> Typically Replies Instantly</p>
                </div>
            </div>
            <Messages
                messages={messages}
                chatbotName={chatBotData?.chatbots.name || "Unknown Bot"} />
        </div>
    </div>;
}

export default ChatbotPage;

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';


function ChatbotPage() {

    const formSchema = z.object({
        message: z.string().min(2, "Your message is too short to send"),
    });

    const params = useParams();
    const id = params.id as string;
    const created_at = new Date().toISOString();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [chatId, setChatId] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        }
    });

    const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
        GET_CHATBOT_BY_ID,
        {
            variables: { id }
        }
    );

    const { loading: loadingQuery, error, data } = useQuery<MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables>(
        GET_MESSAGES_BY_CHAT_SESSION_ID,
        {
            variables: { chat_session_id: chatId },
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
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const { message: formMessage } = values;
        const message = formMessage;
        form.reset();
        if (!name || !email) {
            setIsOpen(true);
            setLoading(false);
        }
        if (!message.trim()) {
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            content: message,
            created_at: new Date().toISOString(),
            chat_session_id: Number(chatId),
            sender: "user"
        };
        const loadingMessage: Message = {
            id: Date.now() + 1,
            content: "Thinking...",
            created_at: new Date().toISOString(),
            chat_session_id: Number(chatId),
            sender: "ai"
        };

        setMessages((prevMessages) => [
            ...prevMessages,
            userMessage,
            loadingMessage
        ]);
        try {
            const response = await fetch("/api/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    chat_session_id: Number(chatId),
                    chatbot_id: id,
                    content: message,
                    created_at: new Date().toISOString()
                })
            });
            const result = await response.json();
            console.log("result is", result);
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === loadingMessage.id
                        ? { ...msg, content: result.content, id: result.id }
                        : msg
                )
            );

        } catch (error) {
            console.log("Error sending message:", error);
        }
    };
    return (
        <div className="chat-container flex flex-col h-screen w-full bg-gray-100">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form className="flex-1" onSubmit={handleInformationSubmit}>
                        <DialogHeader>
                            <DialogTitle>Let&apos;s help you out!</DialogTitle>
                            <DialogDescription>I just need a few details to get started</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={!name || !email || loading}>
                                {!loading ? "Continue" : "Loading"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl flex-1">
                <div className="pb-4 border-b sticky top-0 z-50 bg-[#4d7dfb] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
                    <Avatar seed={chatBotData?.chatbots.name!} className="h-12 w-12 bg-white rounded-full border-2 border-white" />
                    <div>
                        <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
                        <p className="text-sm text-gray-300">Typically Replies Instantly</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <Messages messages={messages} chatbotName={chatBotData?.chatbots.name || "Unknown Bot"} />
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex items-center space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md ">
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel hidden>Message</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Type a message..." {...field} className="p-4 w-full" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="h-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>Send</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default ChatbotPage;

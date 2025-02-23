/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Message } from '@/types/types';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import Avatar from './Avatar';
import { UserCircle } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const Messages = ({ messages, chatbotName }: {
    messages: Message[],
    chatbotName: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const path = usePathname();
    const isReviewsPage = path.includes("review-sessions");
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className='flex1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white'>
            {messages.map((message) => {
                const isSender = message.sender !== "user";
                return <div key={message.id}
                    className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
                >
                    {isReviewsPage && (
                        <p className='absolute -bottom-5 text-xs text-gray-300'> sent {new Date(message.created_at).toLocaleString()}</p>
                    )}
                    <div className={`chat-image avatar w-10 ${!isSender && "-mr-4"} `}>
                        {
                            isSender ? (
                                <Avatar
                                    seed={chatbotName}
                                    className='h-12 w-12 bg-white rounded-full border-2 border-[#2991EE]'
                                />
                            ) : (
                                <UserCircle className='text-[#2991EE]' />
                            )
                        }
                    </div>
                    <p className={`chat-bubble text-white ${isSender
                        ? "chat-bubble-primary bg-[#4d7dfb]"
                        : "chat-bubble-secondary bg-gray-200 text-gray-700 "
                        } `}>
                        <ReactMarkdown
                            //className={`break-words`}
                            remarkPlugins={[remarkGfm]}
                            components={{
                                ul: ({ node, ...props }) => (
                                    <ul className='list-disc list-inside ml-5 mb-5'
                                        {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className='list-decimal list-inside ml-5 mb-5'
                                        {...props} />
                                ),
                                h1: ({ node, ...props }) => (
                                    <h1 className='text-2xl font-bold  mb-5'
                                        {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h1 className='text-xl font-bold  mb-5'
                                        {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h1 className='text-lg font-bold  mb-5'
                                        {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                    <table className='table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5'
                                        {...props} />
                                ),
                                th: ({ node, ...props }) => (
                                    <th className='text-left underline'
                                        {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                    <p className={`whitespace-break-spaces mb-5 ${message.content === "Thinking..." && "animate-pulse"} ${isSender ? "text-white" : "text-gray-700"}  `}
                                        {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                    <a
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='underline font-bold  hover:text-blue-400'
                                        {...props} />
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </p>
                </div>;
            })}
            <div></div>
        </div>
    );
};

export default Messages;
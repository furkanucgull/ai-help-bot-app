"use client";
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from '@/graphql/mutations/mutations';
import { useMutation } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


import React, { FormEvent, useState } from 'react';

function CreateChatbot() {
    const { user } = useUser();
    const [name, setName] = useState("");
    const router = useRouter();
    const createdAt = new Date().toISOString();
    const [CreateChatbot, { data, loading, error }] = useMutation(
        CREATE_CHATBOT,
        {
            variables: {
                clerk_user_id: user?.id,
                name,
                created_at: createdAt,
            }

        });
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const data = await CreateChatbot();
            setName("");
            router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);

        } catch (error) {
            console.log(error);

        }
    };
    if (!user) {
        return null;
    }
    return (
        <div className='flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10 '>

            <Avatar seed='create-chatbot' />
            <div>
                <h1 className='text-xl lg:text-3xl font-semibold'>Create</h1>
                <h2 className='font-light'>Create a new chatbot to assist you in your life</h2>
            </div>

            <form
                onSubmit={handleSubmit}
                className='flex flex-col md:flex-row gap-5 my-4'>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type='text'
                    placeholder='Enter Chatbot Name'
                    className='max-w-lg md:w-48 md:bg-amber-50'
                    required />

                <Button
                    type='submit'
                    disabled={loading || !name}
                >{loading ? "Creating Chatbot..." : "Create Chatbot"}</Button>

            </form>
            <p className='text-gray-400  text-sm'>Example: Customer Support Chatbot</p>
        </div>
    );
}

export default CreateChatbot;    
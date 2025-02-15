import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

import React from 'react';

function CreateChatbot() {
    return (
        <div className='flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10 '>

            <Avatar seed='create-chatbot' />
            <div>
                <h1 className='text-xl lg:text-3xl font-semibold'>Create</h1>
                <h2 className='font-light'>Create a new chatbot to assist you in your life</h2>
            </div>

            <form className='flex flex-col md:flex-row gap-5 my-4'>
                <Input
                    type='text'
                    placeholder='Enter Chatbot Name'
                    className='max-w-lg md:w-48 md:bg-amber-50'
                    required />

                <Button>Create chatbot</Button>

            </form>
            <p className='text-gray-400  text-sm'>Example: Customer Support Chatbot</p>
        </div>
    );
}

export default CreateChatbot;    
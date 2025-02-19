import { REMOVE_CHARACTERISTIC } from '@/graphql/mutations/mutations';
import { ChatbotCharacteristic } from '@/types/types';
import { useMutation } from '@apollo/client';
import { BadgeX } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function Characteristic({ characteristic }: { characteristic: ChatbotCharacteristic; }) {

    const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
        refetchQueries: ["GetChatbotById"]
    });
    const handleRemoveCharacteristic = async () => {
        try {
            await removeCharacteristic({
                variables: {
                    characteristicId: characteristic.id,
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <li
            key={characteristic.id}
            className='relative p-8 bg-white border rounded-md mt-4'>
            {characteristic.content}
            <BadgeX
                onClick={() => {
                    const promise = handleRemoveCharacteristic();
                    toast.promise(promise, {
                        loading: "Removing...",
                        success: "Characteristic removed",
                        error: "Failed to remove characteristic"
                    });
                }}
                className='w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50'
            />
        </li>
    );
}

export default Characteristic;
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { GET_CHATBOTS_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { Chatbot, GetChatbotsByUserData, GetChatbotsByUserDataVariables } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ViewChatbots() {

    const { userId } = await auth();

    if (!userId) {
        console.error("User ID not found!");
        return;
    }

    const { data, error } = await serverClient.query<GetChatbotsByUserData, GetChatbotsByUserDataVariables>({
        query: GET_CHATBOTS_BY_USER,
    });

    if (error) {
        console.error("API Error:", error);
    }


    const chatbotsList = data.chatbotsList.filter(chatbot => chatbot.clerk_user_id === userId);

    if (chatbotsList.length === 0) {
        return (
            <div className="flex-1 pb-20 p-10">
                <p>
                    You have not created any chatbots yet, click on the button below to create one.
                </p>
                <Link href="/create-chatbot">
                    <Button className="bg-[#64b5f5] text-white p-3 rounded-md mt-5">Create a Chatbot </Button>
                </Link>
            </div>
        );
    }

    const sortedChatbotsByUser: Chatbot[] = chatbotsList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="flex-1 pb-20 p-10">
            <h1 className="text-xl lg:text-3xl font-semibold mb-5">Active  Chatbots</h1>

            <ul>
                {sortedChatbotsByUser.map((chatbot) => (
                    <Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
                        <li className="relative p-10 border rounded-md max-w-3xl bg-white">
                            <div>
                                <div className="flex items-center space-x-4">
                                    <Avatar seed={chatbot.name} />
                                    <h2 className="text-xl font-bold">{chatbot.name}</h2>
                                </div>
                                <p className="absolute top-5 right-5 text-xs text-gray-400">
                                    Created : {new Date(chatbot.created_at).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default ViewChatbots;

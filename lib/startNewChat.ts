import client from '@/graphql/apolloClient';
import { INSERT_CHAT_SESSION, INSERT_GUEST, INSERT_MESSAGE } from '@/graphql/mutations/mutations';

async function startNewChat(guestName: string, guestEmail: string, chatbotId: number, created_at: string) {
  try {
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: { name: guestName, email: guestEmail, created_at: created_at },
    });

    const guestId = guestResult.data.insertGuests.id;
    console.log('Guest Mutation Result:', guestResult);

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: { chatbot_id: chatbotId, guest_id: guestId, created_at: created_at },
    });

    const chatSessionId = chatSessionResult.data?.insertChat_sessions?.id;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: 'ai',
        content: `Welcome ${guestName}!\n How can I assist you today? `,
        created_at: created_at,
      },
    });

    console.log('New chat session started succesfully');
    return chatSessionId;
  } catch (error) {
    console.log('Error', error);
  }
}
export default startNewChat;

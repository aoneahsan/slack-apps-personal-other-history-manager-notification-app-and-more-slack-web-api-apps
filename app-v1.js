const fs = require('fs');
const axios = require('axios');
const path = require( 'path' );

const workspaceToken = 'xoxb-2722046483618-7014233473185-wtGfN0miOLtBjyDjleYTFs1M';
const savedDataFolder = path.resolve(__dirname, './saved-data-folder');

async function fetchConversations() {
  try {
    const response = await axios.get('https://slack.com/api/conversations.list', {
      headers: {
        Authorization: `Bearer ${workspaceToken}`
      }
    });

    const conversations = response.data.channels;

    conversations.forEach(async (conversation) => {
      const conversationData = {
        id: conversation.id,
        name: conversation.name,
        // Add more properties as needed
      };

      const conversationFolder = `${savedDataFolder}/${conversationData.id}`;
      if (!fs.existsSync(conversationFolder)) {
        fs.mkdirSync(conversationFolder, { recursive: true });
      }

      const conversationFilePath = `${conversationFolder}/conversation.json`;
      fs.writeFileSync(conversationFilePath, JSON.stringify(conversationData, null, 2));

      await fetchMessages(conversationData.id, conversationFolder);

      console.log(`Conversation "${conversationData.name}" fetched and stored locally.`);
    });

    console.log('All conversations fetched and stored locally.');
  } catch (error) {
    console.error('Error fetching conversations:', error.message);
  }
}

async function fetchMessages(conversationId, conversationFolder) {
  try {
    const response = await axios.get('https://slack.com/api/conversations.history', {
      headers: {
        Authorization: `Bearer ${workspaceToken}`
      },
      params: {
        channel: conversationId
      }
    });

    const messages = response.data.messages;

    messages.forEach((message) => {
      const messageData = {
        id: message.ts,
        text: message.text,
        // Add more properties as needed
      };

      const messageFilePath = `${conversationFolder}/${messageData.id}.json`;
      fs.writeFileSync(messageFilePath, JSON.stringify(messageData, null, 2));
    });

    console.log(`Messages for conversation "${conversationId}" fetched and stored locally.`);
  } catch (error) {
    console.error(`Error fetching messages for conversation "${conversationId}":`, error.message);
  }
}

fetchConversations();



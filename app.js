const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { WebClient, LogLevel } = require('@slack/web-api');

const workspaceToken =
	'xoxb-2722046483618-7014233473185-wtGfN0miOLtBjyDjleYTFs1M';

const _slackAPIClient = new WebClient(workspaceToken, {
	logLevel: LogLevel.INFO,
});

const savedDataFolder = path.resolve(__dirname, './saved-data-folder');

async function fetchConversations() {
	try {
		// const response = await axios.get(
		// 	'https://slack.com/api/conversations.list',
		// 	{
		// 		headers: {
		// 			Authorization: `Bearer ${workspaceToken}`,
		// 		},
		// 	}
		// );

		// _slackAPIClient.conversations.list().then((response) => {
		// 	console.dir({
		// 		// ml: `Conversation "${conversationData.name}" fetched and stored locally.`,
		// 		ml: 'response list , fetched and stored locally.',
		// 		response,
		// 		channels: response.channels,
		// 	});
		// });

		_slackAPIClient.conversations
			.history({
				channel: 'C05KAUW1SH2',
				inclusive: true,
				include_all_metadata: true,
			})
			.then((response) => {
				console.dir({
					// ml: `Conversation "${conversationData.name}" fetched and stored locally.`,
					ml: 'response list , fetched and stored locally.',
					response,
					messages: response.messages,
				});

				const messageFilePath = `${savedDataFolder}/${'C05KAUW1SH2'}.json`;
				fs.writeFileSync(messageFilePath, JSON.stringify(response.messages, null, 2));
			});

		// const conversations = response.data.channels;

		// conversations.forEach(async (conversation) => {
		// 	const conversationData = {
		// 		id: conversation.id,
		// 		name: conversation.name,
		// 		// Add more properties as needed
		// 	};

		// 	await fetchMessages(conversationData.id, conversationFolder);

		// });

		console.log('All conversations fetched and stored locally.');
	} catch (error) {
		console.error('Error fetching conversations:', error.message);
	}
}

async function fetchMessages(conversationId, conversationFolder) {
	try {
		const response = await axios.get(
			'https://slack.com/api/conversations.history',
			{
				headers: {
					Authorization: `Bearer ${workspaceToken}`,
				},
				params: {
					channel: conversationId,
				},
			}
		);

		const messages = response.data.messages;

		console.log({
			ml: `Messages for conversation "${conversationId}" fetched and stored locally.`,
			messages,
			conversationFolder,
		});
	} catch (error) {
		console.error(
			`Error fetching messages for conversation "${conversationId}":`,
			error.message
		);
	}
}

fetchConversations();

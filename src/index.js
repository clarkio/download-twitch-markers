import {
  ClientCredentialsAuthProvider,
  StaticAuthProvider,
} from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import 'dotenv/config';

import { writeDataText } from './files.js';

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchChannel = process.env.TWITCH_CHANNEL;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

const authProvider = new StaticAuthProvider(clientId, accessToken, [
  'user:read:broadcast',
]);

const apiClient = new ApiClient({ authProvider });

const user = await apiClient.users.getUserByName(twitchChannel);
const videos = await apiClient.videos.getVideosByUser(user.id, {
  type: 'archive',
});

for (let i = 0; i < videos.data.length; i++) {
  const markers = await apiClient.streams.getStreamMarkersForVideo(
    videos.data[i].id
  );
  writeDataText(`${videos.data[i].title}\n`);
  for (let j = 0; j < markers.data.length; j++) {
    var date = new Date(null);
    date.setSeconds(markers.data[j]?.positionInSeconds); // specify value for SECONDS here
    var timeString = date.toISOString().substring(11, 19);
    writeDataText(`${timeString}\n`);
  }
  writeDataText(`\n`);
}

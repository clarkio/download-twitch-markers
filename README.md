# Download Twitch Markers

Download stream markers from your Twitch VODs.

## What is This?

This tool is currently intended to be run locally and manually. Clone the repo locally or run in a GitHub Codespace or GitPod. Run it whenever you need to capture your latest stream VOD markers.

Example output:

```text
Clarkio's Awesome Stream Title
00:44:36
00:58:38
01:19:03
01:35:21
01:48:35
02:27:50

Clarkio's Other Fantastic Stream Title
00:50:36
01:39:45

...
```

## Setup

### Get Twitch App Client ID and Secret

1. Go to [Twitch Dev](https://dev.twitch.tv) and sign in
1. Go to [Apps Console](https://dev.twitch.tv/console/apps) and click on "Register Your Application"
1. Enter a name of your choosing (such as "Download Twitch Markers"), a redirect of `https://localhost` and category of your choosing (such as Broadcaster Suite). Then click "Create"
1. You'll be brought back to the Apps Console. Find your new app with the name you entered and click "Manage"
1. Find the "Client ID" field and copy its value. Save it in a safe place
1. Under "Client Secret" click "New Secret" you'll be prompted with a message to confirm you want to generate a new secret. Select "OK"
1. You'll see a new block of text right above the "New Secret" button. Copy that text and save it in a safe place as well
1. Back in this project folder, find the `.env-example` file and rename it to `.env`
1. Inside this file add the values you copied in the previous step to their corresponding environment variables. For example add the "Client ID" value right after equals in `TWITCH_CLIENT_ID=`
1. Set the `TWITCH_CHANNEL` variable value to the channel you want to use and retrieve the stream markers from

### Get an Access Token

An access token is needed to get the proper permissions that grant access to retrieving the stream videos and markers on a channel. Since this tool is meant to be run on demand it doesn't have the capabilities to automatically handle generating an access token right now. Doing so would require spinning up a server to handle the authentication flow necesary to do it. Instead we'll do this manually.

1. Review the following URL and query parameters. Replace any placeholder parameter values with your corresponding details (such as your Twitch Client ID).
   ```
   https://id.twitch.tv/oauth2/authorize?client_id=<YOUR_CLIENT_ID>
    &redirect_uri=https://localhost
    &response_type=code
    &scope=user:read:broadcast
   ```
1. Open up your browser, copy and paste that URL with your update parameter values into your browser address bar. Press "Enter" to go to that URL and start the authentication flow.
1. If you're not signed in you'll be prompted to do so. Once you're signed into Twitch you'll be prompted to allow your app to have permissions to your channel. The only permission needed is based on the scope `user:read:broadcast` so that this tool can read your past stream recordings and their stream markers
1. Once you allow it you'll be redirected once or twice. Give it a chance to finish the redirects. You'll know it's done when the browser attempts to take you to `https://localhost/?code=<some-code-text-here>&scope=user%3Aread%3Abroadcast`
1. Take a look at the URL the browser stops at and find the `code` parameter and copy the value between the equals `=` and ampersand `&`. Save this code value in a safe place.
1. Next replace any placeholder parameters values with your corresponding details and the code you retrieved in the previous step
   ```
   https://id.twitch.tv/oauth2/token?client_id=<YOUR_CLIENT_ID>
     &client_secret=<YOUR_CLIENT_SECRET>
     &code=<YOUR_CODE_FROM_LAST_STEP>
     &grant_type=authorization_code
     &redirect_uri=https://localhost
   ```
1. Send a POST request using that formulated URL with your update query parameters. If you're in VS Code you can use an extension like "REST Book" or a separate toole like Insomnia or Postman
1. You should receive a response that looks similar to the following example. Copy the value for the `"access_token"` field and save it in a safe place
   ```json
   {
     "access_token": "<some-access-token-text>",
     "expires_in": 12345,
     "refresh_token": "<some-refresh-token-text>",
     "scope": ["user:read:broadcast"],
     "token_type": "bearer"
   }
   ```
1. Open your `.env` file and add this value to the `TWITCH_ACCESS_TOKEN` environment variable value after the equals `=`
1. Now you're all set up. Whew 😅

## Running the tool

1. In your terminal/command line run `npm i` to install the dependencies
1. Then run `npm start`
1. Once complete, if everything is set up properly and the tokens haven't expired yet, you should see a new `.txt` that contains your stream recording titles and the stream marker timestamps below them.
1. Done

## Troubleshooting

Your token may expire. One way to tell is you'll get an error in your terminal/command line containing a message with `401`. Go back to the "Get an Access Token" section in this document to generate a new token and update the corresponding environment variable. Then re-run the tool.

const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input
let fs = require('fs');
let cron = require('node-cron');
require('dotenv').config();



const apiId = parseInt(process.env.APIID);
const apiHash = process.env.APIHASH;
const stringSession = new StringSession(process.env.SESSIONKEY); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again




  let kicked = await client.invoke(
    new Api.channels.GetParticipants({
      channel: "-1001539705455",
      filter: new Api.ChannelParticipantsKicked({ q: "" }),
      offset: 43,
      limit: 1000,
      hash: BigInt("-4156887774564"),
    })
  );


  console.log(kicked.participants[0]); // prints the result


  for (let i = 0; i < 100; i++) {

    await client.invoke(
      new Api.channels.EditBanned({
        channel: "-1001539705455",
        participant: kicked.participants[i].peer.userId,
        bannedRights: new Api.ChatBannedRights({
          untilDate: 2147483647,
          viewMessages: false,
          sendMessages: false,
          sendMedia: false,
          sendStickers: false,
          sendGifs: false,
          sendGames: false,
          sendInline: false,
          sendPolls: false,
          changeInfo: false,
          inviteUsers: false,
          pinMessages: false,
        }),
      })
    );

    console.log(kicked.participants[i].peer.userId, " --- ", i);

  }

})();
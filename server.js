const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const cron = require('node-cron');
require('dotenv').config();


let round=1;
let totalParticipants;
let n = 0;
let userIds = [];
const apiId = parseInt(process.env.APIID);
const apiHash = process.env.APIHASH;
const stringSession = new StringSession(process.env.SESSIONKEY); // fill this later with the value from session.save()


cron.schedule('*/20 * * * *', () => {
  console.log('Running.... Round:', round++);


  (async function start() {
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
        channel: process.env.GROUPID,
        filter: new Api.ChannelParticipantsKicked({ q: "" }),
        offset: 43,
        limit: 200,
        hash: BigInt("-4156887774564"),
      })
    );

    console.log(kicked.participants.length); // prints the result


    totalParticipants = kicked.participants.length;

    for (i = 0; i < totalParticipants; i++) {
      userIds[i] = kicked.participants[i].peer.userId;
    }

    const interval = setInterval(async () => {

      for (let i = 0; i < 5; i++, n++) {

        if (totalParticipants <= n) {
          console.log('Finished.');
          clearInterval(interval);
        }

        let currentUserId = userIds[n];

        await client.invoke(
          new Api.channels.EditBanned({
            channel: process.env.GROUPID,
            participant: currentUserId,
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

        console.log(kicked.participants[n].peer.userId, " --- ", n, "--- Unbanned");

      }

    }, 5000);

  })();

});

console.log("Cron Job started");


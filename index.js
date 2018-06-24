// 
// Imports
// 
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('load-secret').get('time-bot');
const moment = require('moment-timezone');

//
// Vars
// 
const timeZones = {};

/**
 * Load timezones from each guild
 *  TimeZone is loaded and parsed from the first pinned message in the channel named 'time'
 */
const loadTimezones = () => {
  client.guilds.forEach(guild => {
    guild.channels.forEach(channel => {
      if (channel instanceof Discord.TextChannel && channel.name === 'time') {
        channel.fetchPinnedMessages().then((messages) => {
          console.log(messages.first().content);
          timeZones[guild.id] = messages.first().content.replace('timezone: ', '');
        });
      }
    });
  });
};

/**
 * Begin setting the server names to match the timezone
 */
const startClocks = () => {
  setInterval(() => {
    const now = Date.now();
    for (let guildID in timeZones) {

      // Format time to work with discord
      const timeZone = timeZones[guildID];
      const time = moment(now).tz(timeZone).format('hh:mm');
      let formattedTime = time.split('')[0] === '0'
        ? time.replace(/^.(.*)$/g, '$1')
        : time;
      formattedTime = formattedTime.split('').join(' ');

      // Apply only newly updated names to each guild
      const guild = client.guilds.get(guildID);
      if (guild.name !== formattedTime) {
        guild.setName(formattedTime);
      }
    }
  }, 1000);
};

/**
 * Handle ready event
 */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('Loading timezones...');
  loadTimezones();
  startClocks();
});

/**
 * Handle message event
 */
client.on('message', msg => {
  // TODO
});

/**
 * Login with TimeBot's Secret Token
 */
client.login(token);
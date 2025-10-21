// events/ready.js
module.exports = {
name: 'ready',
once: true,
execute(client) {
console.log(`[bot] Logged in as ${client.user.tag}`);
client.user.setActivity('Moderating', { type: 'WATCHING' });
}
};
const blockedHosts = process.env.BLOCKED_HOSTS 
  ? process.env.BLOCKED_HOSTS.split(',')
  : ['localhost', '127.0.0.1'];

module.exports = {
  validateHost: (hostname) => !blockedHosts.includes(hostname)
};

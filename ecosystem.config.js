module.exports = {
  apps: [
    {
      name: 'ahonbotto',
      script: 'yarn',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      ignore_watch: ['node_modules', 'dist', 'runtime']
    }
  ]
}
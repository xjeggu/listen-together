import LTPlayer from './ltPlayer';

async function main() {
  if (
    !Spicetify.CosmosAsync ||
    !Spicetify.Platform ||
    !Spicetify.LocalStorage
  ) {
    setTimeout(main, 1000);
    return;
  }

  const ltPlayer = new LTPlayer();
  const settings = ltPlayer.settingsManager.settings;

  console.log(settings);
  if (
    settings.autoConnect &&
    !ltPlayer.client.connected &&
    !ltPlayer.client.connecting
  ) {
    if (settings.server) {
      console.log(`Autoconnecting to ${settings.server}`);
      ltPlayer.client.connect();
    }
  }
}

export default main;

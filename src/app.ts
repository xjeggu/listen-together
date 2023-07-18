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
}

export default main;

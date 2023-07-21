import { Command } from '../interfaces';
import LTPlayer from '../ltPlayer';

export class SeekToCommand implements Command {
  constructor(private ltPlayer: LTPlayer, private milliseconds: number) {}

  execute(ogSeekTo: Function) {
    ogSeekTo(this.milliseconds);
    this.ltPlayer.requestUpdateSong(
      !Spicetify.Player.isPlaying(),
      this.milliseconds,
    );
  }

  hasPermission() {
    return this.ltPlayer.isHost;
  }

  notifyRestriction() {
    Spicetify.showNotification('Only the hosts can seek songs!');
  }

  specialAction() {
    this.notifyRestriction();
  }
}

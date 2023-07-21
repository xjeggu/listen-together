import { Command } from '../interfaces';
import LTPlayer from '../ltPlayer';
import { isListenableTrackType, getTrackType } from '../spotifyUtils';

export class PlayCommand implements Command {
  constructor(
    private ltPlayer: LTPlayer,
    private uri: any,
    private origins: any,
    private options: any,
  ) {}

  execute(ogPlay: Function) {
    this.ltPlayer.muteBeforePlay();
    ogPlay(this.uri, this.origins, this.options);
  }

  hasPermission() {
    return this.ltPlayer.isHost || this.options?.ltForced === true;
  }

  notifyRestriction() {
    Spicetify.showNotification('Only the hosts can change songs!');
  }

  specialAction() {
    this.notifyRestriction();
    if (this.options?.repeat === undefined) {
      if (typeof this.uri?.uri === 'string') {
        if (isListenableTrackType(getTrackType(this.uri.uri)))
          this.ltPlayer.requestSong(this.uri.uri);
        else if (
          typeof this.options?.skipTo?.uri === 'string' &&
          isListenableTrackType(getTrackType(this.options.skipTo.uri))
        )
          this.ltPlayer.requestSong(this.options.skipTo.uri);
      }
    }
  }
}

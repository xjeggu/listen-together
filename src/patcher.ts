import { LiteEvent } from './liteEvent';
import LTPlayer from './ltPlayer';
import { isTrackPaused } from './spotifyUtils';

import {
  PauseCommand,
  PlayCommand,
  ResumeCommand,
  SeekToCommand,
  SkipToNextCommand,
  SkipToPreviousCommand,
} from './commands';
import { Command, IOGFunctions } from './interfaces';

export let ogPlayerAPI: IOGFunctions;
export default class Patcher {
  private lastData: any = null;
  constructor(public ltPlayer: LTPlayer) {}

  private readonly onTrackChanged = new LiteEvent<string>();
  public get trackChanged() {
    return this.onTrackChanged.expose();
  }

  patchAll() {
    this.setOGFunctions();
    this.subscribeToPlayerEvents();
    this.overridePlayerFunctions();
  }

  private setOGFunctions() {
    ogPlayerAPI = {
      play: Spicetify.Platform.PlayerAPI.play.bind(
        Spicetify.Platform.PlayerAPI,
      ),
      pause: Spicetify.Platform.PlayerAPI.pause.bind(
        Spicetify.Platform.PlayerAPI,
      ),
      resume: Spicetify.Platform.PlayerAPI.resume.bind(
        Spicetify.Platform.PlayerAPI,
      ),
      seekTo: Spicetify.Platform.PlayerAPI.seekTo.bind(
        Spicetify.Platform.PlayerAPI,
      ),
      skipToNext: Spicetify.Platform.PlayerAPI.skipToNext.bind(
        Spicetify.Platform.PlayerAPI,
      ),
      skipToPrevious: Spicetify.Platform.PlayerAPI.skipToPrevious.bind(
        Spicetify.Platform.PlayerAPI,
      ),
      emitSync: Spicetify.Platform.PlayerAPI._events._emitter.emitSync.bind(
        Spicetify.Platform.PlayerAPI._events._emitter,
      ),
      setVolume: Spicetify.Platform.PlayerAPI._volume?.setVolume.bind(
        Spicetify.Platform.PlayerAPI._volume,
      ),
    };
  }

  private subscribeToPlayerEvents() {
    Spicetify.Platform.PlayerAPI._cosmos.sub(
      'sp://player/v2/main',
      this.trackChangeHandler,
    );
  }

  private trackChangeHandler = (data: any) => {
    if (!data) return;

    if (this.lastData?.track?.uri !== data?.track?.uri) {
      console.log(data);
      this.onTrackChanged.trigger(data?.track?.uri || '');
    }

    this.lastData = data;
  };

  private overridePlayerFunctions() {
    Spicetify.Platform.PlayerAPI._events._emitter.emitSync =
      this.emitSyncHandler;
    Spicetify.Platform.PlayerAPI.play = this.playHandler(ogPlayerAPI.play);
    Spicetify.Platform.PlayerAPI.pause = this.pauseHandler(ogPlayerAPI.pause);
    Spicetify.Platform.PlayerAPI.resume = this.resumeHandler(
      ogPlayerAPI.resume,
    );
    Spicetify.Platform.PlayerAPI.skipToNext = this.skipToNextHandler(
      ogPlayerAPI.skipToNext,
    );
    Spicetify.Platform.PlayerAPI.seekTo = this.seekToHandler(
      ogPlayerAPI.seekTo,
    );
    Spicetify.Platform.PlayerAPI.skipToPrevious = this.skipToPreviousHandler(
      ogPlayerAPI.skipToPrevious,
    );

    if (ogPlayerAPI.setVolume)
      Spicetify.Platform.PlayerAPI._volume.setVolume = this.setVolumeHandler;

    Spicetify.Platform.History.listen(this.historyChangeHandler);
  }

  private emitSyncHandler = (e: any, t: any) => {
    if (this.ltPlayer.client.connected && !this.ltPlayer.isHost) {
      if (t?.action === 'play' && t?.options?.ltForced !== true) return;
      if (t?.action === 'pause' && isTrackPaused()) return;
      if (t?.action === 'resume' && !isTrackPaused()) return;
    }
    return ogPlayerAPI.emitSync(e, t);
  };

  private playHandler = (ogPlay: any) => {
    return (uri: any, origins: any, options: any) => {
      const command = new PlayCommand(this.ltPlayer, uri, origins, options);
      this.restrictAccess(() => ogPlay(uri, origins, options), command);
    };
  };

  private pauseHandler = (ogPause: any) => {
    return () => {
      const command = new PauseCommand(this.ltPlayer);
      this.restrictAccess(ogPause, command);
    };
  };

  private resumeHandler = (ogResume: any) => {
    return () => {
      const command = new ResumeCommand(this.ltPlayer);
      this.restrictAccess(ogResume, command);
    };
  };

  private skipToNextHandler = (ogSkipToNext: any) => {
    return (e: any) => {
      const command = new SkipToNextCommand(this.ltPlayer, e);
      this.restrictAccess(ogSkipToNext, command);
    };
  };

  private seekToHandler = (ogSkipTo: any) => {
    return (milliseconds: number) => {
      const command = new SeekToCommand(this.ltPlayer, milliseconds);
      this.restrictAccess(ogSkipTo, command);
    };
  };

  private skipToPreviousHandler = (ogSkipToPrevious: any) => {
    return (e: any) => {
      const command = new SkipToPreviousCommand(this.ltPlayer, e);
      this.restrictAccess(ogSkipToPrevious, command);
    };
  };

  private setVolumeHandler = (e: number) => {
    if (!this.ltPlayer.client.connected || this.ltPlayer.canChangeVolume)
      ogPlayerAPI.setVolume(e);
  };

  private historyChangeHandler = ({ pathname }: { pathname?: string }) => {
    let pathParts = pathname?.split('/', 3).filter((i) => i);
    if (
      (pathParts?.length || 0) >= 2 &&
      pathParts![0].toLowerCase() == 'listentogether'
    ) {
      this.ltPlayer.ui.joinAServerQuick(decodeURIComponent(pathParts![1]));
      Spicetify.Platform.History.goBack();
    }
  };

  private restrictAccess(ogFunc: any, command: Command) {
    if (!this.ltPlayer.client.connected && !this.ltPlayer.client.connecting) {
      console.log('Not connected');
      ogFunc();
    } else if (command.hasPermission()) {
      console.log('Has permission');
      command.execute(ogFunc);
    } else {
      console.log('No permission');
      command.specialAction();
    }
  }
}

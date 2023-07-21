export interface Command {
  execute(ogFunc: Function): void;
  hasPermission(): boolean;
  notifyRestriction(): void;
  specialAction(): void; // New method
}

export interface IOGFunctions {
  play: any;
  pause: any;
  resume: any;
  seekTo: any;
  skipToNext: any;
  skipToPrevious: any;
  emitSync: any;
  setVolume: any;
}

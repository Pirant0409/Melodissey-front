declare namespace YT {
    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }
  
    class Player {
      constructor(elementId: string | HTMLElement, options: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      loadVideoById(videoId: string): void;
    }
  
    interface PlayerOptions {
      videoId: string;
      height?: string;
      width?: string;
      playerVars?: {
        autoplay?: number;
        controls?: number;
        [key: string]: any;
      };
      events?: {
        onReady?: (event: any) => void;
        onStateChange?: (event: any) => void;
      };
    }
    interface PlayerEvent {
        target: Player; // Le Player associé à cet événement
      }
    
      interface PlayerStateChangeEvent extends PlayerEvent {
        data: number; // Représente l'état actuel (ENDED, PLAYING, etc.)
      }

      interface OnStateChangeEvent extends PlayerEvent {
        data: number; // Représente l'état du lecteur (ENDED, PLAYING, PAUSED, etc.)
      }
  }
  
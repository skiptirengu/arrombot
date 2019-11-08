import { Playable } from './Playable'

export interface Playlist {
  /**
   * Playables on this playlist
   */
  playables: Playable[]
  /**
   * Playlist title
   */
  title: string
  /**
   * Playlist thumbnail
   */
  thumbnail?: string
}

export function isPlaylist(info: any): info is Playlist {
  return typeof info === 'object' && 'playables' in info && 'title' in info
}

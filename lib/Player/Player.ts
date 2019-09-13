import { inject, scoped } from 'tsyringex'
import { VoiceChannel, VoiceConnection } from 'discord.js'
import { PlayerQueue } from './PlayerQueue'
import { Playable } from './Playable'
import { UrlParser } from './Handlers/UrlParser'
import { create } from './Handlers/HandlerFactory'

@scoped()
export class Player {
  /**
   * The voice channel the bot is currently connected to
   */
  protected voiceChannel?: VoiceChannel
  /**
   * The current voice connection the bot is streaming to
   */
  protected voiceConnection?: VoiceConnection
  /**
   * Current playable
   */
  protected current?: Playable

  public constructor(
    /**
     * The current player queue
     */
    @inject(PlayerQueue) protected readonly queue: PlayerQueue,
    /**
     * URL parser
     */
    @inject(UrlParser) protected readonly parser: UrlParser
  ) {
    this.queue.on('playable', () => this.play())
  }

  public queuePlayable(channel: VoiceChannel, playable: Playable, times: number): void {
    this.voiceChannel = this.voiceChannel || channel
    Array(times)
      .fill(undefined)
      .forEach(() => this.queue.push(playable))
  }

  private play(): void {
    if (this.current) return
    this.voiceChannel!.join()
      .then((connection) => (this.voiceConnection = connection))
      .then(() => this.playNext())
      .catch(console.error)
  }

  private async playNext(): Promise<void> {
    this.current = this.queue.pop()

    if (!this.current) {
      this.disconnect()
      return
    }

    const handler = await create(this.current.uri)
    const readable = await handler.stream()

    this.voiceConnection!.play(readable)
      .on('debug', console.log)
      .on('error', console.error)
      .once('end', () => this.playNext())
  }

  private disconnect(): void {
    if (this.voiceChannel) this.voiceChannel = undefined
    if (this.voiceConnection) {
      this.voiceConnection.disconnect()
      this.voiceConnection = undefined
    }
  }
}

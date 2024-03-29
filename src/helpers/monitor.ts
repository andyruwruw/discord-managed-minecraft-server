/**
 * This class replaces console.log for a more standardized
 * way of logging.
 */

// Local Imports
import { Environment } from './environment';
import { DISCORD_CHANNEL } from '../config/discord';
import { DiscordReferences } from '../discord/discord-references';

/**
 * StOut escape code for resetting formatting.
 */
export const STD_OUT_ESCAPE_CODE_RESET = '\x1b[0m';

/**
 * Format for different monitor layers.
 */
export const STD_OUT_MONITOR_LAYER_NAME_FORMATING: Record<string, string> = {
  0: '\x1b[90m', // DEBUG Grey
  1: '\x1b[91m', // WARNING Red
  2: '\x1b[33m', // UPDATE Yellow
  3: '\x1b[32m', // SUCCESS Green
  4: '\x1b[32m', // PROGRESS Blue
};

/**
 * Format for different monitor layers.
 */
export const STD_OUT_MONITOR_LAYER_MESSAGE_FORMATING: Record<string, string> = {
  0: '\x1b[90m', // DEBUG
  1: '\x1b[37m', // WARNING
  2: '\x1b[37m', // UPDATE
  3: '\x1b[37m', // UPDATE
  4: '\x1b[37m', // UPDATE
};

/**
 * Proxy to console.
 */
export class Monitor {
  /**
   * Layers of monitor output.
   */
  static Layer: Record<string, number> = {
    DEBUG: 0,
    WARNING: 1,
    UPDATE: 2,
    SUCCESS: 3,
    PROGRESS: 4,
  };

  /**
   * Retrieves name of source.
   *
   * @param {any} source Message source. 
   * @returns {string} Name of source.
   */
  static _getSourceName(source: any): string {
    return typeof source === 'string' ? source : source.name;
  }

  /**
   * Print a statement to the console.
   *
   * @param {string} text Text to be printed.
   * @param {number} layer Layer to print text to.
   */
  static _formatMessage(
    source: any,
    text: string,
    layer = 0,
  ) {
    const nameFormat = STD_OUT_MONITOR_LAYER_NAME_FORMATING[`${layer}`];
    const textFormat = STD_OUT_MONITOR_LAYER_MESSAGE_FORMATING[`${layer}`];

    return [
      `${nameFormat}[${Monitor._getSourceName(source)}]:${STD_OUT_ESCAPE_CODE_RESET}`,
      `${textFormat}${text}${STD_OUT_ESCAPE_CODE_RESET}`,
    ]
  }

  /**
   * Print a statement to the console.
   *
   * @param {string} text Text to be printed.
   * @param {number} layer Layer to print text to.
   */
  static async log(
    source: any,
    text: string,
    layer = 0,
  ) {
    if (Monitor._shouldLog(layer)) {
      try {
        const channel = await DiscordReferences.getChannel(DISCORD_CHANNEL.CONSOLE);

        if (channel) {
          await channel.send({
            content: text,
          });
        }

        console.log(...Monitor._formatMessage(
          source,
          text,
          layer,
        ));
      } catch (error) {
        console.log(...Monitor._formatMessage(
          source,
          text,
          layer,
        ));
      }
    }
  }

  /**
   * Print a trace statement to the console.
   *
   * @param {string} text Text to be printed.
   * @param {number} layer Layer to print text to.
   */
  static async trace(
    source: any,
    text: string,
    layer = 0,
  ) {
    if (Monitor._shouldLog(layer)) {
      try {
        const channel = await DiscordReferences.getChannel(DISCORD_CHANNEL.CONSOLE);

        if (channel) {
          await channel.send({
            content: text,
          });
        }

        console.trace(...Monitor._formatMessage(
          source,
          text,
          layer,
        ));
      } catch (error) {
        console.trace(...Monitor._formatMessage(
          source,
          text,
          layer,
        ));
      }
    }
  }

  /**
   * Displays memory update.
   */
  static logMemory() {
    const mbUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 10.24) / 100;

    Monitor.log(
      Monitor,
      `Memory in Use: ${mbUsed} MB`,
      Monitor.Layer.WARNING,
    );
  }

  /**
   * Returns whether or not the layer is active.
   * @param {number} layer Monitor layer.
   * @returns {boolean} Whether the layer is active.
   */
  static _shouldLog(layer: number) {
    if (layer === Monitor.Layer.DEBUG) {
      return Environment.isDebugLayerEnabled();
    } if (layer === Monitor.Layer.WARNING) {
      return Environment.isWarningLayerEnabled();
    }
    return Environment.isUpdateLayerEnabled();
  }
}

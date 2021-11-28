// Packages
import {
  ApplicationCommandOptionData,
  CacheType,
  CommandInteractionOptionResolver,
  User,
} from 'discord.js';
import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
} from 'discord.js/typings/enums';

// Local Imports
import { Command } from './command';

const PING_NAME = 'ping';

const PING_DESCRIPTION = 'Replies with pong.';

const PING_COMMAND_OPTIONS: ApplicationCommandOptionData[] = [
  {
    type: ApplicationCommandOptionTypes.NUMBER,
    name: 'pongs',
    description: 'number of pongs to send',
    required: true,
  },
];

/**
 * Basic discord ping command.
 */
export class Ping extends Command {
  /**
   * Instantiates a new Ping command.
   */
  constructor() {
    super(
      PING_NAME,
      PING_DESCRIPTION,
      ApplicationCommandTypes.CHAT_INPUT,
      PING_COMMAND_OPTIONS,
    );
  }

  /**
   * Generates a new response for the command.
   *
   * @param {User} user User object that has username, roles, etc.
   * @param {Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>} options Options object given from the interaction, used to parse user input
   */
  generateResponse(
    user: User, /* eslint-disable-line @typescript-eslint/no-unused-vars */
    options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
  ) {
    return 'pong'.repeat(options.getNumber('pongs')!);
  }
}

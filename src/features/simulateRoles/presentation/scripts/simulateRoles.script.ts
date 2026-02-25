import Script from '../../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../../services/communityConsole/startupDataStorage/StartupDataStorage.port';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

interface RoleSimulation {
  forumId: string;
  role: number;
}

/** Maps a forum id to a role. */
type RoleSimulations = Map<string, number>;

export default class SimulateRolesScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private optionsProvider: OptionsProviderPort,
    private startupDataStorage: StartupDataStoragePort,
  ) {
    super();
  }

  async execute() {
    if (await this.optionsProvider.isEnabled('simulateroles')) {
      await this.attemptToChangeRoles();
    }
  }

  private async attemptToChangeRoles() {
    try {
      this.changeRoles();
    } catch (err) {
      console.error('[SimulateRoles] Could not simulate roles:', err);
    }
  }

  private async changeRoles() {
    const roleSimulations = await this.attemptToGetRoleSimulations();
    this.startupDataStorage.enqueueModification((startupData) => {
      const forumUsers = startupData.data?.[1]?.[2];
      if (forumUsers === undefined) {
        return startupData;
      }

      for (const forumUser of forumUsers) {
        const forumId = forumUser?.[2]?.[1]?.[1];
        const role = roleSimulations.get(forumId);
        if (role === undefined) {
          continue;
        }

        if (!(3 in forumUser)) {
          forumUser[3] = {};
        }
        if (!(1 in forumUser[3])) {
          forumUser[3][1] = {};
        }
        forumUser[3][1][3] = role;
      }

      return startupData;
    });

    // We have to apply the modification after adding it, because due to the
    // fact that we add it asynchronously, we can't rely on the
    // applyStartupDataModificationsOnStart script to wait for this to finish.
    this.startupDataStorage.applyModifications();
  }

  private async attemptToGetRoleSimulations() {
    try {
      return await this.getRoleSimulations();
    } catch (err) {
      throw new Error('Could not parse role simulations configuration.', {
        cause: err,
      });
    }
  }

  private async getRoleSimulations(): Promise<RoleSimulations> {
    return (await this.optionsProvider.getOptionValue('simulateroles_config'))
      .split('|')
      .map((rawRoleSimulation): RoleSimulation => {
        const parts = rawRoleSimulation.split(',');
        if (parts.length != 2) {
          throw new Error(
            `Role simulation "${rawRoleSimulation}" is malformed: it should be of a pair of the form "forum_id,role".`,
          );
        }
        const [forumId, role] = parts;
        return { forumId, role: parseInt(role, 10) };
      })
      .reduce((prev, curr) => {
        prev.set(curr.forumId, curr.role);
        return prev;
      }, new Map<string, number>());
  }
}

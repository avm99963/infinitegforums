import {kUserRoleEnum, kUserRoleRank} from './enums/UserRole';
import StartupData from './StartupData.js';

export default class UserModel {
  constructor(data, startupData) {
    this.data = data ?? {};
    this.startupData = startupData ?? new StartupData();
  }

  getRawAccountAbuse() {
    return this.data[8]?.[1] ?? null;
  }

  hasAccountAbuse() {
    return this.getRawAccountAbuse() !== null;
  }

  isAccountDisabled() {
    return this.hasAccountAbuse();
  }

  getRole(forumId) {
    const forumsInfo = this.startupData.getRawForumsInfo() ?? [];
    for (const f of forumsInfo) {
      const itForumId = f[1] ?? f[2]?.[1]?.[1];
      if (itForumId == forumId) {
        return f[3]?.[1]?.[3] ?? kUserRoleEnum.ROLE_USER;
      }
    }
    return kUserRoleEnum.ROLE_USER;
  }

  #isRoleAtLeast(a, b) {
    const aRank = kUserRoleRank[a] ?? 0;
    const bRank = kUserRoleRank[b] ?? 0;
    return aRank >= bRank;
  }

  getHighestRole() {
    const forumsInfo = this.startupData.getRawForumsInfo() ?? [];
    const roles = forumsInfo.map(f => {
      return f[3]?.[1]?.[3] ?? kUserRoleEnum.ROLE_USER;
    });
    return roles.reduce((prev, current) => {
      return this.#isRoleAtLeast(current, prev) ? current : prev;
    });
  }

  isAtLeastCommunityManager(forumId = null) {
    const role = forumId ? this.getRole(forumId) : this.getHighestRole();
    return this.#isRoleAtLeast(role, kUserRoleEnum.ROLE_COMMUNITY_MANAGER);
  }

  isAtLeastSilverRole(forumId = null) {
    const role = forumId ? this.getRole(forumId) : this.getHighestRole();
    return this.#isRoleAtLeast(role, kUserRoleEnum.ROLE_PRODUCT_EXPERT_LEVEL_2);
  }
}

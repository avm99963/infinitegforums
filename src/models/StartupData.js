import UserModel from './User.js';

export default class StartupDataModel {
  constructor(data) {
    this.data = data ?? {};
  }

  static buildFromCCDOM() {
    const startupData =
        document.querySelector('html')?.getAttribute?.('data-startup');
    if (!startupData) {
      console.warn('Haven\'t found CC startup data.');
      return null;
    }

    let startup;
    try {
      startup = JSON.parse(startupData);
    } catch (error) {
      console.warn('Haven\'t been able to parse CC startup data.');
    }

    return new StartupDataModel(startup);
  }

  getRawUser() {
    return this.data[1]?.[1] ?? null;
  }

  getAuthUser() {
    return this.data[2]?.[1] ?? '0';
  }

  getRawForumsInfo() {
    return this.data[1]?.[2] ?? null;
  }

  getCurrentUserModel() {
    return new UserModel(this.getRawUser(), this);
  }
}

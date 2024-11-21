import LocalStorageService from "./LocalStorage.service";

export default class switchEnvironment {
  private static _env = !!LocalStorageService.get("env");

  static get getEnv(): boolean {
    return this._env;
  }

  static set setEnv(enabled: boolean) {
    LocalStorageService.set("env", enabled);
    this._env = enabled;
  }
}

import Script from "../../common/architecture/scripts/Script";

export interface ScriptProviderPort {
  getScripts(): Script[];
}

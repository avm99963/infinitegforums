import Script from "../../common/architecture/scripts/Script";

export interface ScriptSorterPort {
  sort(scripts: Script[]): Script[];
}

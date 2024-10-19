import { Context } from "../entrypoint/Context";
import Script from "./Script";

/**
 * @deprecated
 */
export default interface ScriptProvider {
  getScripts(context: Context): Script[];
}

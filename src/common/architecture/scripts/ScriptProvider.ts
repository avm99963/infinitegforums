import { Context } from "../entrypoint/Context";
import Script from "./Script";

export default interface ScriptProvider {
  getScripts(context: Context): Script[];
}

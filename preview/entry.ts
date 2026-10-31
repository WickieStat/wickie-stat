// Bundled into the static preview so its chatbot uses the exact same logic and knowledge as the site.
import * as config from "../src/lib/config";
import { QUICK_REPLIES, WELCOME_MESSAGE } from "../src/lib/chatTypes";
import { demoReply } from "../src/lib/demoBot";
import * as flow from "../src/lib/enquiryFlow";
import { SERVICES } from "../src/lib/knowledge";

(window as unknown as { WSC: unknown }).WSC = { config, demoReply, flow, SERVICES, QUICK_REPLIES, WELCOME_MESSAGE };

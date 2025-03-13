import {TYPE as Assertion} from "@/jmeter/components/assertions/assertion";
import {TYPE as Configuration} from "@/jmeter/components/configurations/configuration";
import {TYPE as Controller} from "@/jmeter/components/controllers/controller";
import {TYPE as Listener} from "@/jmeter/components/listeners/listener";
import {TYPE as PostProcessor} from "@/jmeter/components/post-processors/post-processor";
import {TYPE as PreProcessor} from "@/jmeter/components/pre-processors/pre-processor";
import {TYPE as Sampler} from "@/jmeter/components/samplers/sampler";
import {TYPE as Timer} from "@/jmeter/components/timers/timer";
import {TYPE as TestPlan} from "@/jmeter/components/others/test-plan";
import {TYPE as ThreadGroup} from "@/jmeter/components/thread-groups/thread-group";
import {TYPE as UnsupportedComponent} from "@/jmeter/components/others/unspported-component";

const ICONS = {};
ICONS[Assertion] = "el-icon-finished";
ICONS[Configuration] = "el-icon-setting";
ICONS[Controller] = "el-icon-share";
ICONS[Listener] = "el-icon-view";
ICONS[PostProcessor] = "el-icon-sold-out";
ICONS[PreProcessor] = "el-icon-sell";
ICONS[Sampler] = "el-icon-link";
ICONS[Timer] = "el-icon-timer";
ICONS[TestPlan] = "el-icon-tickets";
ICONS[ThreadGroup] = "el-icon-s-unfold";
ICONS[UnsupportedComponent] = "el-icon-warning";

export const getIcon = (component) => {
  return ICONS[component.$type] || "";
}

export default {getIcon}

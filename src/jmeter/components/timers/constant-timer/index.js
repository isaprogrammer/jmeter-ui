import Timer from "@/jmeter/components/timers/timer";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "ConstantTimerGui",
      testclass: "ConstantTimer",
      testname: "Constant Timer",
      enabled: "true"
    },
  }
};

export default class ConstantTimer extends Timer {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);
    this.delay = this.initStringProp('ConstantTimer.delay');
  }
}

export const schema = {
  ConstantTimer: ConstantTimer
}


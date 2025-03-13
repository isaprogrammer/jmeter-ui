import Assertion from "@/jmeter/components/assertions/assertion";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "DurationAssertionGui",
      testclass: "DurationAssertion",
      testname: "Duration Assertion",
      enabled: "true"
    },
  }
};

export default class DurationAssertion extends Assertion {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);

    this.duration = this.initStringProp("DurationAssertion.duration")
    this.scope = this.initStringProp("Assertion.scope")
  }
}

export const schema = {
  DurationAssertion: DurationAssertion
}

import PostProcessor from "@/jmeter/components/post-processors/post-processor";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "JSONPostProcessorGui",
      testclass: "JSONPostProcessor",
      testname: "JSON PostProcessor",
      enabled: "true"
    },
  }
};

export default class JSONPostProcessor extends PostProcessor {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);
    this.scope = this.initStringProp("Sample.scope")
    this.variable = this.initStringProp("Scope.variable")
    this.referenceNames = this.initStringProp("JSONPostProcessor.referenceNames")
    this.jsonPathExprs = this.initStringProp("JSONPostProcessor.jsonPathExprs")
    this.matchNumber = this.initStringProp("JSONPostProcessor.match_number")
    this.defaultValues = this.initStringProp("JSONPostProcessor.defaultValues")
    this.computeConcat = this.initBoolProp("JSONPostProcessor.compute_concat")
  }
}

export const schema = {
  JSONPostProcessor: JSONPostProcessor
}


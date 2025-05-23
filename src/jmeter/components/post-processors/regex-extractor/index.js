import PostProcessor from "@/jmeter/components/post-processors/post-processor";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "RegexExtractorGui",
      testclass: "RegexExtractor",
      testname: "Regex Extractor",
      enabled: "true"
    },
  }
};

export default class RegexExtractor extends PostProcessor {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);
    this.scope = this.initStringProp("Sample.scope")
    this.variable = this.initStringProp("Scope.variable")
    this.useHeaders = this.initStringProp("RegexExtractor.useHeaders", "false")
    this.refName = this.initStringProp("RegexExtractor.refname")
    this.regex = this.initStringProp("RegexExtractor.regex")
    this.template = this.initStringProp("RegexExtractor.template")
    this.matchNumber = this.initStringProp("RegexExtractor.match_number")
    this.default = this.initStringProp("RegexExtractor.default")
    this.defaultEmpty = this.initBoolProp("RegexExtractor.default_empty_value")
  }
}

export const schema = {
  RegexExtractor: RegexExtractor
}


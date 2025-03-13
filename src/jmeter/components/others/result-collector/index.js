import HashTreeElement from "@/jmeter/utils/hashtree";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "ViewResultsFullVisualizer",
      testclass: "ResultCollector",
      testname: "View Results Tree",
      enabled: "true"
    },
  }
};

export const TYPE = "ResultCollector";

export default class ResultCollector extends HashTreeElement {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);
    this.$type = TYPE;
  }
}

export const schema = {
  ResultCollector: ResultCollector
}

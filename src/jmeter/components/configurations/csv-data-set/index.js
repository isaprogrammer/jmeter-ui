import Configuration from "@/jmeter/components/configurations/configuration";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "TestBeanGUI",
      testclass: "CSVDataSet",
      testname: "CSV Data Set Config",
      enabled: "true"
    },
  }
};

export default class CSVDataSet extends Configuration {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);

    this.filename = this.initStringProp("filename")
    this.fileEncoding = this.initStringProp("fileEncoding")
    this.variableNames = this.initStringProp("variableNames")
    this.ignoreFirstLine = this.initStringProp("ignoreFirstLine", "false")
    this.delimiter = this.initStringProp("delimiter", ",")
    this.quotedData = this.initStringProp("quotedData", "false")
    this.recycle = this.initStringProp("recycle", "true")
    this.stopThread = this.initStringProp("stopThread", "true")
    this.shareMode = this.initStringProp("shareMode", "shareMode.all")
  }
}

export const schema = {
  CSVDataSet: CSVDataSet
}

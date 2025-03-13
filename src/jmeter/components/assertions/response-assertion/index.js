import Assertion from "@/jmeter/components/assertions/assertion";
import {stringProp} from "@/jmeter/utils/props";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "AssertionGui",
      testclass: "ResponseAssertion",
      testname: "Response Assertion",
      enabled: "true"
    },
  }
};

export default class ResponseAssertion extends Assertion {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);

    this.customMessage = this.initStringProp("Assertion.custom_message")
    this.scope = this.initStringProp("Assertion.scope")
    this.variable = this.initStringProp("Scope.variable")
    this.testField = this.initStringProp("Assertion.test_field", 'Assertion.response_data')
    this.assumeSuccess = this.initBoolProp("Assertion.assume_success", false)
    this.testType = this.initIntProp("Assertion.test_type", 16)

    this.testStrings = [];
    let collectionProp = this.initCollectionProp('Asserion.test_strings');
    collectionProp.forEach(stringProp => {
      this.testStrings.push({key: stringProp.key, string: stringProp.value, enable: true});
    })
  }

  updateProps() {
    let collectionProp = this.props['Asserion.test_strings'];
    collectionProp.clear();
    this.testStrings.forEach((item, index) => {
      if (item.enable !== false) {
        collectionProp.add(stringProp(index, item.string));
      }
    })
  }

  toJson(debug) {
    this.updateProps();
    return super.toJson(debug);
  }
}

export const schema = {
  ResponseAssertion: ResponseAssertion
}

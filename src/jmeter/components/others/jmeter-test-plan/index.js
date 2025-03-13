import Element from "@/jmeter/utils/element";
import {loadHashTree} from "@/jmeter/utils/components";

const DEFAULT_OPTIONS = {
  type: "element",
  name: "jmeterTestPlan",
  attributes: {version: "1.2", properties: "5.0", jmeter: "5.2.1"}
};

export default class JmeterTestPlan extends Element {
  constructor({options = DEFAULT_OPTIONS} = {options}) {
    super(options);
    this.hashTree = [];
    if (options.elements) {
      this.hashTree = loadHashTree(options.elements[0]);
    }
  }

  toJson(debug) {
    let json = super.toJson(debug);
    if (this.hashTree) {
      json.elements = [];
      let elements = [];
      this.hashTree.forEach(e => {
        let json = e.toJson(debug);
        elements.push(json.options);
        elements.push(json.hashTree);
      })
      let hashTree = {
        "type": "element",
        "name": "hashTree",
        "elements": elements
      }
      json.elements.push(hashTree);
    }
    return json;
  }
}

export const schema = {
  jmeterTestPlan: JmeterTestPlan
}


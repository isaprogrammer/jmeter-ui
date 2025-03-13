import {elementProp, stringProp} from "@/jmeter/utils/props";
import Configuration from "@/jmeter/components/configurations/configuration";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "HeaderPanel",
      testclass: "HeaderManager",
      testname: "HTTP Header Manager",
      enabled: "true"
    },
  }
};

export default class HeaderManager extends Configuration {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);

    this.headers = [];
    let collectionProp = this.initCollectionProp('HeaderManager.headers');
    collectionProp.forEach(elementProp => {
      let name = elementProp.initStringProp('Header.name').value;
      let value = elementProp.initStringProp('Header.value').value;
      let header = {name: name, value: value, enable: true};

      this.headers.push(header);
    })
  }

  updateProps() {
    let collectionProp = this.props['HeaderManager.headers'];
    collectionProp.clear();
    this.headers.forEach(header => {
      if (header.enable !== false) {
        let ep = elementProp("", "Header");
        ep.add(stringProp("Header.name", header.name));
        ep.add(stringProp("Header.value", header.value));
        collectionProp.add(ep)
      }
    })
  }

  toJson(debug) {
    this.updateProps();
    return super.toJson(debug);
  }
}

export const schema = {
  HeaderManager: HeaderManager
}

import Element from "@/jmeter/utils/element";
import {boolProp, collectionProp, elementProp, getProps, intProp, longProp, stringProp} from "@/jmeter/utils/props";
import {loadComponent, loadHashTree} from "@/jmeter/utils/components";

export default class HashTreeElement extends Element {
  constructor({options: options, hashTree: hashTree}) {
    super(options);
    this.props = getProps(options.elements);
    this.comments = this.initStringProp('TestPlan.comments');

    if (hashTree) {
      this.hashTree = loadHashTree(hashTree);
    }
  }

  clone() {
    const debug = false;
    let json = this.toJson(debug);
    return loadComponent(json.options, json.hashTree);
  }

  initIntProp(name, defaultValue) {
    if (this.props[name] === undefined) {
      this.props[name] = intProp(name, defaultValue);
    }
    return this.props[name];
  }

  initLongProp(name, defaultValue) {
    if (this.props[name] === undefined) {
      this.props[name] = longProp(name, defaultValue);
    }
    return this.props[name];
  }

  initBoolProp(name, defaultValue) {
    if (this.props[name] === undefined) {
      this.props[name] = boolProp(name, defaultValue);
    }
    return this.props[name];
  }

  initStringProp(name, defaultValue) {
    if (this.props[name] === undefined) {
      this.props[name] = stringProp(name, defaultValue);
    }
    return this.props[name];
  }

  initElementProp(name, elementType) {
    if (this.props[name] === undefined) {
      this.props[name] = elementProp(name, elementType);
    }
    return this.props[name];
  }

  initCollectionProp(name) {
    if (this.props[name] === undefined) {
      this.props[name] = collectionProp(name);
    }
    return this.props[name];
  }

  toJson(debug) {
    let self = super.toJson(debug);
    if (this.props !== undefined) {
      self.elements = [];
      Object.keys(this.props).forEach(key => {
        let json = this.props[key].toJson(debug);
        if (json !== undefined) {
          self.elements.push(json);
        }
      });
    }

    let hashTree = {
      "type": "element",
      "name": "hashTree",
    }
    if (this.hashTree) {
      let elements = [];
      this.hashTree.forEach(e => {
        let json = e.toJson(debug);
        elements.push(json.options);
        elements.push(json.hashTree);
      })
      hashTree.elements = elements;
    }
    return {options: self, hashTree: hashTree}
  }
}

import HashTreeElement from "@/jmeter/utils/hashtree";

export const TYPE = "UnsupportedComponent";

export default class UnsupportedComponent extends HashTreeElement {
  constructor(options = {}) {
    super(options)
    this.$type = TYPE;
  }
}

export const schema = {
  UnsupportedComponent: UnsupportedComponent
}

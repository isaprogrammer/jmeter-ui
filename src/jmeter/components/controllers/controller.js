import HashTreeElement from "@/jmeter/utils/hashtree";

export const TYPE = "Controller";

export default class Controller extends HashTreeElement {
  constructor(options = {}) {
    super(options);
    this.$type = TYPE;
  }
}

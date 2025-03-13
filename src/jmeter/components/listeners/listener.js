import HashTreeElement from "@/jmeter/utils/hashtree";

export const TYPE = "Listener";

export default class Listener extends HashTreeElement {
  constructor(options = {}) {
    super(options);
    this.$type = TYPE;
  }
}

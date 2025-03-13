import HashTreeElement from "@/jmeter/utils/hashtree";

export const TYPE = "PostProcessor";

export default class PostProcessor extends HashTreeElement {
  constructor(options = {}) {
    super(options);
    this.$type = TYPE;
  }
}

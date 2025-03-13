import HashTreeElement from "@/jmeter/utils/hashtree";

export const TYPE = "Sampler";

export default class Sampler extends HashTreeElement {
  constructor(options = {}) {
    super(options);
    this.$type = TYPE;
  }
}

import HashTreeElement from "@/jmeter/utils/hashtree";

export const TYPE = "Timer";

export default class Timer extends HashTreeElement {
  constructor(options = {}) {
    super(options);
    this.$type = TYPE;
  }
}

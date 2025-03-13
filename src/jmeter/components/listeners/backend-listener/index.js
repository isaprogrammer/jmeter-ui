import Listener from "@/jmeter/components/listeners/listener";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "BackendListenerGui",
      testclass: "BackendListener",
      testname: "Backend Listener",
      enabled: "true"
    },
  }
};

export default class BackendListener extends Listener {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);
  }
}

export const schema = {
  BackendListener: BackendListener
}

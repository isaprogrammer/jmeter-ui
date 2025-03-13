import Controller from "@/jmeter/components/controllers/controller";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "IfControllerPanel",
      testclass: "IfController",
      testname: "If Controller",
      enabled: "true"
    },
  }
};

export default class IfController extends Controller {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);

    this.condition = this.initStringProp('IfController.condition');
    this.evaluateAll = this.initBoolProp('IfController.evaluateAll');
    this.useExpression = this.initBoolProp('IfController.useExpression', true);
  }
}

export const schema = {
  IfController: IfController
}

import Controller from "@/jmeter/components/controllers/controller";

const DEFAULT_OPTIONS = {
  options: {
    attributes: {
      guiclass: "TransactionControllerPanel",
      testclass: "TransactionController",
      testname: "Transaction Controller",
      enabled: "true"
    },
  }
};

export default class TransactionController extends Controller {
  constructor(options = DEFAULT_OPTIONS) {
    options.options.default_attributes = DEFAULT_OPTIONS.options.attributes;
    super(options);

    this.parent = this.initStringProp('TransactionController.parent');
    this.includeTimers = this.initBoolProp('TransactionController.includeTimers');
  }
}

export const schema = {
  TransactionController: TransactionController
}

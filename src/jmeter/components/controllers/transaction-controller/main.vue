<template>
  <component-container :object="object"
                       help-url="https://jmeter.apache.org/usermanual/component_reference.html#Transaction_Controller">
    <el-form-item label-width="0" prop="parent">
      <el-checkbox v-model="object.parent.value">
        {{ t('wm.controllers.transaction.parent') }}
      </el-checkbox>
    </el-form-item>
    <el-form-item label-width="0" prop="includeTimers">
      <el-checkbox v-model="object.includeTimers.value">
        {{ t('wm.controllers.transaction.includeTimers') }}
      </el-checkbox>
    </el-form-item>
  </component-container>
</template>

<script>
import ComponentContainer from "@/components/ComponentContainer";
import TransactionController from "@/jmeter/components/controllers/transaction-controller/index";
import Locale from "@/mixins/locale";

export default {
  name: "TransactionController",
  components: {ComponentContainer},
  mixins: [Locale],
  props: {
    object: TransactionController
  }
}
</script>

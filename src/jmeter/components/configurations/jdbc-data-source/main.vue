<template>
  <component-container ref="container" :object="object"
                       help-url="https://jmeter.apache.org/usermanual/component_reference.html#JDBC_Connection_Configuration">
    <el-form-item label-width="120px" prop="dataSource">
      <template v-slot:label>
        <span>{{ t('wm.configurations.jdbc_data_source.data_source') }}</span>
        <icon-tooltip :content="t('wm.configurations.jdbc_data_source.data_source_desc')"/>
      </template>
      <el-input v-model="object.dataSource.value"/>
    </el-form-item>

    <pool-configuration :object="object"/>

    <pool-validation :object="object"/>

    <database-connection-configuration :object="object"/>
  </component-container>
</template>

<script>

import ComponentContainer from "@/components/ComponentContainer";
import Locale from "@/mixins/locale";
import IconTooltip from "@/components/IconTooltip";
import JDBCDataSource from "./index";
import PoolConfiguration from "./PoolConfiguration";
import PoolValidation from "./PoolValidation";
import DatabaseConnectionConfiguration from "./DatabaseConnectionConfiguration";

export default {
  name: "JDBCDataSource",
  components: {
    DatabaseConnectionConfiguration,
    PoolValidation, PoolConfiguration, ComponentContainer, IconTooltip
  },
  mixins: [Locale],
  props: {
    object: JDBCDataSource
  }
}
</script>

<style scoped>

</style>

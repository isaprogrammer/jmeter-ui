<template>
  <div id="jmx-table">
    <el-tree ref="tale"
             :data="data"
             :expand-on-click-node="false"
             :highlight-current="true"
             :props="props"
             :indent="0"
             default-expand-all
             node-key="id"
             @node-click="select">
      <template v-slot:default="{ node, data }">
        <span :class="{disabled: disabled(data,node)}" class="el-tree-node__label">
          <i :class="getIcon(data)"></i>
          <span>{{ node.label.substr(38) }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import {getIcon} from "./table";
import Locale from "@/mixins/locale";

const sampleLabel = (node, label) => {
  if (null === node.parent) {
    return label;
  }
  if (undefined === label) {
    label = node.label;
  } else {
    label = node.label + ":" + label;
  }
  return sampleLabel(node.parent, label);
}

export default {
  name: "ComponentsTable",
  mixins: [Locale],
  props: {
    data: Array,
    select: Function
  },
  data() {
    return {
      props: {
        label: "label",
        children: "hashTree"
      }
    }
  },
  methods: {
    getIcon(data) {
      return getIcon(data);
    },
    disabled(data, node) {
      return undefined === this.$store.state.kv[sampleLabel(node, undefined)];
    }
  }
}
</script>

<style scoped>
/* 树形结构样式调整 */
#jmx-table > .el-tree {
  background-color: inherit;
}

#jmx-table >>> .el-tree-node__content {
  height: 30px;
  color: #409EFF;
}

#jmx-table >>> .el-tree-node__label i {
  margin-right: 5px;
}

#jmx-table >>> span.el-tree-node__label.disabled {
  color: rgb(110, 110, 110);
  cursor: not-allowed;
}

/* 树形结构节点添加连线 */
#jmx-table >>> .el-tree-node {
  position: relative;
}

#jmx-table >>> .el-tree-node__children {
  margin-left: 26px;
}

#jmx-table >>> .el-tree-node:before {
  content: "";
  position: absolute;
  right: auto;
  border-width: 1px;
}

#jmx-table >>> .el-tree-node:after {
  content: "";
  position: absolute;
  right: auto;
  border-width: 1px;
}

#jmx-table >>> .el-tree-node {
  border-left: 1px dashed rgb(85 85 85);
  height: 100%;
}
</style>

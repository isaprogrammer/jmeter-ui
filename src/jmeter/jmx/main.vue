<template>
  <el-tabs tab-position="bottom">
    <el-tab-pane label="压测脚本">
      <div class="container">
        <div id="tree">
          <components-tree :data="testPlanTree" :select="selectTree"/>
        </div>
        <div class="content">
          <component :is="className" v-if="selectedTree" :object="selectedTree"/>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="压测详情">
      <div class="container">
        <div class="table">
          <components-table :data="testPlanTable" :select="selectTable"/>
        </div>
        <div class="content">
          <component :exec-id="execId" :is="reporter" v-if="selectedTable" :object="selectedTable"/>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="压测报告">
      <div class="container">
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ComponentsTree from "@/components/tree/ComponentsTree";
import ComponentsTable from "@/components/table/ComponentsTable";
import JMX from "@/jmeter/jmx/index";
import {hasComponent} from "@/jmeter/utils/components";
import Reporter from "@/jmeter/components/others/reporter/main";

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
  name: "Jmx",
  components: {Reporter, ComponentsTree, ComponentsTable},
  props: {
    execId: String,
    jmxTree: JMX,
    jmxTable: JMX
  },
  data() {
    return {
      selectedTree: undefined,
      selectedTable: undefined
    }
  },
  methods: {
    selectTree(data) {
      this.selectedTree = data;
    },
    selectTable(data, node) {
      this.selectedTable = data;
      this.$store.state.sampleLabel = sampleLabel(node, undefined);
    }
  },
  computed: {
    testPlanTree() {
      return this.jmxTree.elements[0].hashTree;
    },
    testPlanTable() {
      return this.jmxTable.elements[0].hashTree;
    },
    className() {
      return hasComponent(this.selectedTree.name);
    },
    reporter() {
      return "Reporter";
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: calc(100vh - 160px);
}

#tree {
  width: 25%;
  max-width: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.table {
  width: 25%;
  max-width: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.content {
  padding: 0 16px 0 16px;
  flex: 1;
  background: beige;
  overflow-x: hidden;
  overflow-y: scroll;
}

/*覆盖vue默认的样式*/
#tree >>> .el-tree-node__label {
  font-size: 16px;
}

.table >>> .el-tree-node__label {
  font-size: 16px;
}

.content >>> .el-table thead {
  color: black;
}

.content >>> .el-form-item__label {
  color: black;
}

.content >>> .el-radio {
  color: black;
}

.content >>> .el-checkbox {
  color: black;
}

.content >>> .el-tabs__item {
  color: black;
}

.content >>> .el-tabs__item.is-active {
  color: #409EFF;
}

/*美化滚动条的样式*/
::-webkit-scrollbar {
  width: 1px;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: white;
}
</style>

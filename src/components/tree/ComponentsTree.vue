<template>
  <div id="jmx-tree">
    <el-tree ref="tree"
             :allow-drag="allowDrag"
             :allow-drop="allowDrop"
             :data="data"
             :expand-on-click-node="false"
             :highlight-current="true"
             :props="props"
             :indent="0"
             default-expand-all
             draggable
             node-key="id"
             @node-click="selected"
             @node-contextmenu="showMenu">
      <template v-slot:default="{ node, data }">
        <span :class="{disabled: !data.enabled}" class="el-tree-node__label">
          <i :class="getIcon(data)"></i>
          <span>{{ node.label }}</span>
        </span>
      </template>
    </el-tree>
    <div v-show="menuVisible" id="jmx-tree-menu">
      <el-cascader-panel v-if="options.length > 0" ref="menu"
                         :border="false"
                         :options="options"
                         :props="{expandTrigger:'hover'}"
                         @change="exec">
        <template v-slot:default="{ node, data }">
          <div v-if="data.value === 'Divider'" class="divider" style="border-top: 1px dashed rgb(105 105 105)"/>
          <span v-else>{{ t(data.label) }}</span>
        </template>
      </el-cascader-panel>
    </div>
  </div>
</template>

<script>
import {createComponent} from "@/jmeter/utils/components";
import {allowDrag, allowDrop, getComponentMenus, getIcon} from "./tree";
import Locale from "@/mixins/locale";
import {Setting} from "@/jmeter/utils/setting";
import lodash from 'lodash'
import {uuid} from "@/commons/utils";

const BASIC_MENUS = [
  {value: 'Cut', label: 'wm.commons.cut', disabled: true},
  {value: 'Copy', label: 'wm.commons.copy', disabled: true},
  {value: 'Paste', label: 'wm.commons.paste', disabled: true},
  {value: 'Duplicate', label: 'wm.commons.duplicate'},
  {value: 'Remove', label: 'wm.commons.remove'},
  {value: 'Divider', label: 'Divider', disabled: true},
];

export default {
  name: "ComponentsTree",
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
      },
      options: [],
      current: null,
      menuVisible: false,
    }
  },
  methods: {
    showMenu(event, data) {
      if (this.$refs.menu) {
        this.$refs.menu.activePath = [];
      }

      this.menuVisible = true;
      this.current = data;
      this.getMenu(data);
      let offsetX = 0;
      let offsetY = 45;
      let menu = document.querySelector('#jmx-tree-menu');
      menu.style.left = event.clientX - offsetX + 'px';
      menu.style.top = event.clientY - offsetY + 'px';
      document.addEventListener('click', this.close);
    },
    getMenu(data) {
      this.options = [];
      BASIC_MENUS.forEach(o => {
        this.options.push(o);
      })

      if (data.enabled) {
        this.options.push({value: 'Disable', label: 'wm.commons.disable'});
      } else {
        this.options.push({value: 'Enable', label: 'wm.commons.enable'});
      }

      let allowMenu = getComponentMenus(data);
      if (allowMenu.children.length > 0 || allowMenu.parent.length > 0) {
        let divider = {value: 'Divider', label: 'Divider', disabled: true}
        this.options.unshift(divider);

        if (allowMenu.parent.length > 0) {
          this.options.unshift({
            label: "wm.commons.insert", value: "Insert Parent", children: allowMenu.parent
          });
        }

        if (allowMenu.children.length > 0) {
          this.options.unshift({
            label: "wm.commons.add", value: "Add", children: allowMenu.children
          });
        }
      }
    },
    close() {
      this.options = [];
      this.$refs.menu.activePath = [];
      this.$refs.menu.clearCheckedNodes();

      this.menuVisible = false
      document.removeEventListener('click', this.close);
    },
    enable(data) {
      data.enabled = true;
      if (data.hashTree) {
        data.hashTree.forEach(child => {
          this.enable(child);
        })
      }
    },
    disable(data) {
      data.enabled = false;
      if (data.hashTree) {
        data.hashTree.forEach(child => {
          this.disable(child);
        })
      }
    },
    exec(path) {
      let command = path[0];
      let name = path[path.length - 1];
      let tree = this.$refs.tree;
      switch (command) {
        case "Cut":
          break;
        case "Copy":
          break;
        case "Paste":
          break;
        case "Duplicate":
          let clone = lodash.cloneDeep(this.current);
          this.duplicate(clone);
          tree.insertAfter(clone, this.current.id);
          break;
        case "Remove":
          tree.remove(this.current.id);
          break;
        case "Enable":
          this.enable(this.current);
          break;
        case "Disable":
          this.disable(this.current);
          break;
        case "Add":
          let component = createComponent(name);
          tree.append(component, this.current.id);
          break;
        case "Insert Parent":
          let parent = createComponent(name);
          tree.insertBefore(parent, this.current.id);
          tree.remove(this.current.id);
          tree.append(this.current, parent.id);
          break;
      }
      this.close();
    },
    allowDrop(draggingNode, dropNode, type) {
      let drag = draggingNode.data;
      let drop = dropNode.data;
      if (type !== "inner") {
        drop = dropNode.parent.data
      }
      let setting = Setting[drop.name];
      if (setting && setting.tree && setting.tree.drop === false) {
        return false;
      }
      return allowDrop(drag, drop, type);
    },
    allowDrag(draggingNode) {
      let setting = Setting[draggingNode.data.name];
      if (setting && setting.tree && setting.tree.drag === false) {
        return false;
      }
      return allowDrag(draggingNode.data);
    },
    getIcon(data) {
      return getIcon(data);
    },
    selected(data) {
      this.menuVisible = false;
      this.select(data);
    },
    duplicate(clone) {
      clone.id = uuid();
      clone.hashTree.forEach(child => {
        if (undefined === child.hashTree) {
          child.id = uuid();
          return;
        }
        this.duplicate(child);
      })
    }
  },
}
</script>

<style scoped>
/* 树形结构样式调整 */
#jmx-tree > .el-tree {
  background-color: inherit;
}

#jmx-tree >>> .el-tree-node__content {
  height: 30px;
  color: black;
}

#jmx-tree >>> .el-tree-node__label i {
  margin-right: 5px;
}

#jmx-tree >>> span.el-tree-node__label.disabled {
  color: rgb(110, 110, 110);
}

/* 树形结构节点添加连线 */
#jmx-tree >>> .el-tree-node {
  position: relative;
}

#jmx-tree >>> .el-tree-node__children {
  margin-left: 26px;
}

#jmx-tree >>> .el-tree-node:before {
  content: "";
  position: absolute;
  right: auto;
  border-width: 1px;
}

#jmx-tree >>> .el-tree-node:after {
  content: "";
  position: absolute;
  right: auto;
  border-width: 1px;
}

#jmx-tree >>> .el-tree-node {
  border-left: 1px dashed rgb(85 85 85);
  height: 100%;
}

/* 树形结构右侧菜单 */
#jmx-tree-menu {
  z-index: 99999;
  border: 1px dashed rgb(85 85 85);
  display: flex;
  flex-flow: column;
  position: absolute;
  background: white;
}

#jmx-tree-menu >>> .el-cascader-menu__wrap {
  height: 100%;
}

#jmx-tree-menu >>> .el-cascader-menu {
  min-width: 200px;
  height: 100%;
  border-right: 0;
}

#jmx-tree-menu >>> .el-cascader-node {
  height: fit-content;
  font-weight: normal;
}
</style>

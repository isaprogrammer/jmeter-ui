<template>
  <component-field-set :title="title">
    <el-form :disabled="disable">
      <el-table
        :data="items"
        :disabled="disabled"
        :height="height"
        cell-class-name="variable-table-td"
        class="variable-table"
        header-cell-class-name="variable-table-th"
        size="mini"
        @select="select"
        @select-all="select">
        <el-table-column :index="index" type="index" width="1"/>
        <el-table-column type="selection" width="55"/>
        <slot></slot>
        <el-table-column :label="t('wm.commons.enable')" width="80">
          <template v-slot:default="{row}">
            <el-checkbox v-model="row.enable"/>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template v-slot:default="scope">
            <el-button size="mini" @click="remove(scope.$index)">{{ t('wm.commons.remove') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="variable-field-set-footer">
        <slot name="footer">
          <el-row justify="center" type="flex">
            <el-button size="mini" @click="add">{{ t('wm.commons.add') }}</el-button>
            <el-button size="mini" @click="removeSelection">{{ t('wm.commons.remove') }}</el-button>
            <el-button size="mini" type="info" @click="clear">{{ t('wm.commons.clear') }}</el-button>
          </el-row>
        </slot>
      </div>
    </el-form>
  </component-field-set>
</template>

<script>
import ComponentFieldSet from "@/components/ComponentFieldSet";
import Locale from "@/mixins/locale";
import {uuid} from "@/commons/utils";

export default {
  name: "VariableFieldSet",
  components: {ComponentFieldSet},
  mixins: [Locale],
  props: {
    title: String,
    height: [String, Number],
    items: Array,
    disabled: Boolean
  },
  data() {
    return {
      selection: []
    }
  },
  methods: {
    index(index) {
      if (!this.items[index].$id) {
        this.items[index].$id = uuid();
      }
      return "";
    },
    select(selection) {
      this.selection = [];
      selection.forEach(s => {
        this.selection.push(s.$id);
      })
    },
    add() {
      this.items.push({enable: true});
    },
    remove(index) {
      this.items.splice(index, 1);
    },
    removeSelection() {
      this.selection.forEach($id => {
        this.remove(this.items.findIndex(item => {
          return item.$id === $id;
        }));
      });
      this.selection = [];
    },
    clear() {
      for (let i = this.items.length - 1; i >= 0; i--) {
        this.items.splice(i, 1);
      }
    },
  },
  computed: {
    disable() {
      return this.disabled || this.$parent.disabled;
    }
  }
}
</script>

<style scoped>
.variable-table {
  background-color: inherit;
}

.variable-table >>> .variable-table-th, .variable-table >>> .variable-table-td {
  text-align: center;
}

.variable-field-set-footer {
  margin: 10px 0;
}

</style>

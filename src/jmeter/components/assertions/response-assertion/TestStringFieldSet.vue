<template>
  <component-field-set :title="t('wm.assertions.response_assertion.string')">
    <el-table
      :data="items"
      :height="height"
      :show-header="false"
      class="test-string-table"
      size="mini"
      @select="select"
      @select-all="select">
      <el-table-column :index="index" type="index" width="5"/>
      <el-table-column type="selection" width="50"/>
      <el-table-column>
        <template v-slot:default="{row}">
          <el-input v-model="row.server" :autosize="{minRows: 2, maxRows:4}" size="mini" type="textarea"/>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="test-string-footer" justify="center" type="flex">
      <el-button size="mini" @click="add">{{ t('wm.commons.add') }}</el-button>
      <el-button size="mini" @click="remove">{{ t('wm.commons.remove') }}</el-button>
      <el-button size="mini" type="info" @click="clear">{{ t('wm.commons.clear') }}</el-button>
    </el-row>
  </component-field-set>
</template>

<script>
import ComponentFieldSet from "@/components/ComponentFieldSet";
import Locale from "@/mixins/locale";
import {uuid} from "@/commons/utils";

export default {
  name: "TestStringFieldSet",
  components: {ComponentFieldSet},
  mixins: [Locale],
  props: {
    items: Array,
    height: {
      type: [String, Number],
      default: 200
    }
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
    remove() {
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
}
</script>

<style scoped>
.test-string-table {
  background-color: inherit;
}

.test-string-footer {
  margin: 10px 0;
}
</style>

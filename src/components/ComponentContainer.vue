<template>
  <div class="components-container">
    <el-form ref="object" :disabled="disabled" :model="object" label-position="left" label-width="auto" size="mini">
      <slot name="title">
        <div class="title">
          <el-row align="middle" type="flex">
            <span v-if="title">{{ title }}</span>
            <span v-else>{{ object.testname }}</span>
            <el-link v-if="helpUrl" :href="helpUrl" :underline="false" icon="el-icon-question" target="_blank"/>
          </el-row>
        </div>
        <el-form-item :label="t('wm.commons.name')" label-width="80px" prop="label">
          <el-input v-model="object.label"></el-input>
        </el-form-item>
        <el-form-item :label="t('wm.commons.comments')" label-width="80px" prop="comments">
          <el-input v-model="object.comments.value"></el-input>
        </el-form-item>
      </slot>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>
import Locale from "@/mixins/locale"

export default {
  name: "ComponentContainer",
  props: ["helpUrl", "object", "title", "props"],
  mixins: [Locale],
  computed: {
    disabled() {
      return !this.object.enabled;
    }
  }
}
</script>

<style scoped>
.components-container {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
}

.components-container .title {
  color: black;
  font-size: 16px;
  padding: 10px 0 10px 0;
}

.components-container >>> .el-form-item {
  margin-bottom: 8px;
}
</style>

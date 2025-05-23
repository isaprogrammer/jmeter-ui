<template>
  <div>
    <component-field-set :title="t('wm.samplers.http.web_server')">
      <el-row :gutter="10" type="flex">
        <el-col class="protocol-col">
          <el-form-item :label="t('wm.samplers.http.protocol')" label-width="60px" prop="protocol">
            <el-select v-model="object.protocol.value" :placeholder="t('wm.commons.please_select')">
              <el-option label="HTTPS" value="https"/>
              <el-option label="HTTP" value="http"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="t('wm.samplers.http.domain')" prop="domain">
            <el-input v-model="object.domain.value"/>
          </el-form-item>
        </el-col>
        <el-col class="port-col">
          <el-form-item :label="t('wm.samplers.http.port')" label-width="60px" prop="port">
            <el-input v-model="object.port.value"/>
          </el-form-item>
        </el-col>
      </el-row>
    </component-field-set>
    <component-field-set :title="t('wm.samplers.http.http_request')">
      <el-row :gutter="10" type="flex">
        <el-col class="method-col">
          <el-form-item :label="t('wm.samplers.http.method')" label-width="60px" prop="method">
            <el-select v-model="object.method.value" :placeholder="t('wm.commons.please_select')">
              <el-option label="GET" value="GET"/>
              <el-option label="POST" value="POST"/>
              <el-option label="PUT" value="PUT"/>
              <el-option label="PATCH" value="PATCH"/>
              <el-option label="DELETE" value="DELETE"/>
              <el-option label="OPTIONS" value="OPTIONS"/>
              <el-option label="HEAD" value="HEAD"/>
              <el-option label="CONNECT" value="CONNECT"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="t('wm.samplers.http.path')" label-width="40px" prop="path">
            <el-input v-model="object.path.value"/>
          </el-form-item>
        </el-col>
        <el-col class="content-encoding-col">
          <el-form-item :label="t('wm.samplers.http.content_encoding')" label-width="80px" prop="contentEncoding">
            <el-input v-model="object.contentEncoding.value"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-checkbox v-model="object.autoRedirects.value">{{ t('wm.samplers.http.auto_redirects') }}</el-checkbox>
      <el-checkbox v-model="object.followRedirects.value">{{ t('wm.samplers.http.follow_redirects') }}</el-checkbox>
      <el-checkbox v-model="object.useKeepalive.value">{{ t('wm.samplers.http.use_keepalive') }}</el-checkbox>
      <el-checkbox v-model="object.doMultipartPost.value">{{ t('wm.samplers.http.do_multipart_post') }}</el-checkbox>
      <el-checkbox v-model="object.browserCompatibleMultipart.value">{{ t('wm.samplers.http.browser') }}</el-checkbox>

      <el-tabs v-model="activeName">
        <el-tab-pane :disabled="hasBody" :label="t('wm.samplers.http.arguments')" name="arguments">
          <http-variables :disabled="disabled" :items="object.arguments"/>
        </el-tab-pane>
        <el-tab-pane :disabled="hasArguments" :label="t('wm.samplers.http.body')" name="body">
          <el-input v-model="object.body" :autosize="{minRows: 6, maxRows: 10}" type="textarea" @change="changeBody"/>
        </el-tab-pane>
        <el-tab-pane :label="t('wm.samplers.http.file')" name="file">
          <http-files :disabled="disabled" :items="object.files"/>
        </el-tab-pane>
      </el-tabs>
    </component-field-set>
  </div>
</template>

<script>
import ComponentFieldSet from "@/components/ComponentFieldSet";
import HTTPSamplerProxy from "@/jmeter/components/samplers/http-sampler/index";
import HttpVariables from "@/jmeter/components/samplers/http-sampler/HttpVariables";
import Locale from "@/mixins/locale";
import HttpFiles from "@/jmeter/components/samplers/http-sampler/HttpFiles";
import {Setting} from "@/jmeter/utils/setting";

export default {
  name: "HttpBasicConfig",
  components: {HttpFiles, HttpVariables, ComponentFieldSet},
  mixins: [Locale],
  props: {
    object: HTTPSamplerProxy
  },
  data() {
    return {
      activeName: "arguments",
    }
  },
  methods: {
    changeBody() {
      this.object.postBodyRaw.value = this.hasBody;
    }
  },
  computed: {
    hasBody() {
      return this.object.body !== undefined && this.object.body.trim() !== "";
    },
    hasArguments() {
      return this.object.arguments !== undefined && this.object.arguments.length > 0;
    },
    disabled() {
      let setting = Setting[this.object.name];
      return setting !== undefined && setting.edit !== undefined && setting.edit.disabled === true
    }
  }
}
</script>

<style scoped>
.protocol-col, .port-col, .method-col, .content-encoding-col {
  width: 250px;
  min-width: 150px;
}
</style>

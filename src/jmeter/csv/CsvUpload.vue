<template>
  <div id="csv-upload">
    <uploader
      ref="upload"
      :headers="headers"
      :accept="accepts"
      :before-upload="check"
      :limit="limit"
      :on-exceed="count"
      :base-url="baseUrl"
      :chunk-size="chunkSize"
      @success="success"/>
  </div>
</template>

<script>
import uploader from '@/commons/uploader';
import {Message} from "element-ui";

export default {
  name: 'CsvUpload',
  components: {uploader},
  data: () => ({
    accepts: "text/csv",
    limit: 20,
    chunkSize: 1024 * 1024
  }),
  computed: {
    headers() {
      return {
        Authorization: 'token'
      };
    },
    baseUrl() {
      return 'http://localhost:8888';
    }
  },
  methods: {
    // 文件校验
    check(file) {
      if (!file.size) {
        Message.warning("文件大小不能为0")
        return false;
      }
      return this.propertyRestrictions();
    },
    // 属性限制
    async propertyRestrictions() {
      return new Promise((resolve) => {
        resolve(true);
      });
    },
    // 文件数限制
    count() {
      Message.warning(`最多支持选择${this.limit}个文件`)
    },
    // 上传成功
    success() {
      Message.warning("上传成功")
    }
  }
};
</script>

<style scoped>
#csv-upload {
  border: none;
  padding: 10px;
}
</style>

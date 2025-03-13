<template>
  <component-container :object="object"
                       help-url="https://jmeter.apache.org/usermanual/component_reference.html#CSV_Data_Set_Config">
    <component-field-set id="csvDataSet" :title="t('wm.configurations.csv_data_set.scope')">
      <el-form-item :label="t('wm.configurations.csv_data_set.filename')" label-width="370px" prop="filename">
        <div style="display: flex;">
          <el-input v-model="object.filename.value"/>
          <input id="csv" type="file" accept=".csv" @change="load" v-show="false"/>
          <el-button type="info" plain @click="open" size="mini">Browse...</el-button>
        </div>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.file_encoding')" label-width="370px" prop="fileEncoding">
        <el-select v-model="object.fileEncoding.value"
                   :placeholder="t('wm.commons.please_select')"
                   allow-create
                   filterable>
          <el-option label="UTF-8" value="UTF-8"/>
          <el-option label="UTF-16" value="UTF-16"/>
          <el-option label="ISO-8859-15" value="ISO-8859-15"/>
          <el-option label="US-ASCII" value="US-ASCII"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.variable_names')" label-width="370px"
                    prop="variableNames">
        <el-input v-model="object.variableNames.value"/>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.ignore_first_line')" label-width="370px"
                    prop="ignoreFirstLine">
        <el-select v-model="object.ignoreFirstLine.value"
                   :placeholder="t('wm.commons.please_select')"
                   allow-create
                   filterable>
          <el-option label="False" value="false"/>
          <el-option label="True" value="true"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.delimiter')" label-width="370px" prop="delimiter">
        <el-input v-model="object.delimiter.value"/>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.quoted_data')" label-width="370px" prop="quotedData">
        <el-select v-model="object.quotedData.value"
                   :placeholder="t('wm.commons.please_select')"
                   allow-create
                   filterable>
          <el-option label="False" value="false"/>
          <el-option label="True" value="true"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.recycle')" label-right label-width="370px" prop="recycle">
        <el-select v-model="object.recycle.value"
                   :placeholder="t('wm.commons.please_select')"
                   allow-create
                   filterable>
          <el-option label="False" value="false"/>
          <el-option label="True" value="true"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.stop_thread')" label-width="370px" prop="stopThread">
        <el-select v-model="object.stopThread.value"
                   :placeholder="t('wm.commons.please_select')"
                   allow-create
                   filterable>
          <el-option label="False" value="false"/>
          <el-option label="True" value="true"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('wm.configurations.csv_data_set.share_mode')" label-width="370px" prop="shareMode">
        <el-select v-model="object.shareMode.value"
                   :placeholder="t('wm.commons.please_select')"
                   allow-create
                   filterable>
          <el-option label="All threads" value="shareMode.all"/>
          <el-option label="Current thread group" value="shareMode.group"/>
          <el-option label="Current thread" value="shareMode.thread"/>
        </el-select>
      </el-form-item>
    </component-field-set>
  </component-container>
</template>

<script>
import ComponentContainer from "@/components/ComponentContainer";
import ComponentFieldSet from "@/components/ComponentFieldSet";
import CSVDataSet from "@/jmeter/components/configurations/csv-data-set/index";
import Locale from "@/mixins/locale";
import SparkMD5 from "spark-md5";

export default {
  name: "CSVDataSet",
  components: {ComponentFieldSet, ComponentContainer},
  mixins: [Locale],
  props: {
    object: CSVDataSet
  },
  methods: {
    open() {
      document.getElementById("csv").click();
    },
    load(e) {
      const _this = this;

      const file = e.target.files[0];
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      const chunkSize = 2097152;
      const chunks = Math.ceil(file.size / chunkSize);

      let spark = new SparkMD5.ArrayBuffer();
      let fileReader = new FileReader();
      let currentChunk = 0;
      fileReader.onload = function (e) {
        spark.append(e.target.result);
        currentChunk++;

        if (currentChunk < chunks) {
          loadNext();
        } else {
          _this.object.filename.value = "/tmp/csv/" + spark.end() + "/" + file.name;
        }
      };
      fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
      };

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();
    }
  }
}
</script>

<style scoped>
#csvDataSet >>> .el-form-item__label {
  text-align: right;
}

#csvDataSet >>> .el-select {
  width: 100%;
}
</style>

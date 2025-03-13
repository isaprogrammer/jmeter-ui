<template>
  <div id="jmeter"
       v-loading="this.stopping"
       element-loading-text="终止请求。。。"
       element-loading-spinner="el-icon-loading">
    <div id="options">
      <div>
        <input id="file" type="file" accept=".jmx" @change="load" v-show="false"/>
        <el-button type="primary" @click="create" size="mini">新建</el-button>
        <el-button type="info" plain @click="open" size="mini">打开</el-button>
<!--        <el-button v-if="!this.debugging" type="success" @click="debug" size="mini">调试</el-button>-->
<!--        <el-button v-if="this.debugging" type="danger" @click="stop" size="mini">停止</el-button>-->
        <el-button type="warning" plain @click="download" size="mini">下载</el-button>
      </div>
<!--      <div>-->
<!--        <el-button type="primary" plain size="mini">低门槛入门</el-button>-->
<!--      </div>-->
<!--      <div>-->
<!--        <el-button @click="visibleJarDrawer = true" type="primary" plain round size="mini">JAR<i-->
<!--          class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
<!--        <el-drawer title="三方JAR包上传" v-if="visibleJarDrawer" :visible.sync="visibleJarDrawer" :with-header="false"/>-->
<!--        <el-button @click="visibleCsvDrawer = true" type="success" plain round size="mini">CSV<i-->
<!--          class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
<!--        <el-drawer title="CSV数据文件上传" v-if="visibleCsvDrawer" :visible.sync="visibleCsvDrawer" :with-header="false" size="70%">-->
<!--          <csv-upload/>-->
<!--        </el-drawer>-->
<!--        <el-button @click="visibleJmeterDrawer = true" type="warning" plain round size="mini">在线机器(3/10)</el-button>-->
<!--        <el-drawer title="选择机器" v-if="visibleJmeterDrawer" :visible.sync="visibleJmeterDrawer">-->
<!--          <el-checkbox-group v-model="hosts" style="display: flex; flex-direction: column;">-->
<!--            <el-checkbox label="jmeter-0.jmeter-hs"/>-->
<!--            <el-checkbox label="jmeter-1.jmeter-hs"/>-->
<!--            <el-checkbox label="jmeter-2.jmeter-hs"/>-->
<!--            <el-checkbox label="jmeter-3.jmeter-hs"/>-->
<!--          </el-checkbox-group>-->
<!--        </el-drawer>-->
<!--      </div>-->
    </div>
    <jmx id="jmx" v-if="jmxTree" :exec-id="this.execId" :jmx-tree="jmxTree" :jmx-table="jmxTable"/>
    <div id="icp"><a href="https://beian.miit.gov.cn" target="_blank">浙ICP备20022924号-2</a></div>
  </div>
</template>

<script>
import {download} from "@/commons/utils";
import Jmx from "@/jmeter/jmx/main";
import JMX from "@/jmeter/jmx";
import {post, submit} from "@/commons/request"
import CsvUpload from "@/jmeter/csv/CsvUpload"
import {Message} from "element-ui";

let timer;

export default {
  name: "Jmeter",
  components: {Jmx, CsvUpload},
  props: {
    xml: String
  },
  data() {
    return {
      execId: "00000000000000000",
      stopping: false,
      debugging: false,
      jmxTree: this.xml ? JMX.fromJMX(this.xml) : JMX.create(),
      jmxTable: JMX.create(),
      visibleJarDrawer: false,
      visibleCsvDrawer: false,
      visibleJmeterDrawer: false,
      hosts: ['jmeter-0.jmeter-hs']
    }
  },
  methods: {
    create() {
      this.jmxTree = JMX.create();
    },
    open() {
      document.getElementById("file").click();
    },
    load(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.edit(e.target.result);
      };
      reader.readAsText(file);
    },
    download() {
      if (this.jmxTree) {
        const xml = this.get(false);
        this.$prompt('请输入文件名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          if (value.indexOf(".jmx") === -1) {
            value += ".jmx";
          }
          download(value, xml);
          this.$message({
            type: 'success',
            message: '文件: ' + value
          });
        });
      }
    },
    edit(jmx) {
      this.jmxTree = JMX.fromJMX(jmx);
    },
    get(debug) {
      if (this.jmxTree) {
        return this.jmxTree.toXML(debug);
      }
    },
    debug() {
      if (this.jmxTree) {
        const form = new FormData;
        const xml = this.get(true);
        form.append("xml", xml);
        form.append("hosts", this.hosts);

        submit("/web/jmx/distributed/debug", form)
          .then(res => {
            this.execId = res.execId;
            this.$store.state.kv = res.kv;
            this.debugging = true;
            this.jmxTable = JMX.fromJMX(xml);
            timer = setInterval(() => this.doQuery(), 1000);
          })
          .catch(error => {
            Message.error(error);
          })
      }
    },
    stop() {
      post("/web/jmx/debug/stop", {execId: this.execId})
        .then(() => {
          this.stopping = true;
        })
        .catch(error => {
          Message.error(error);
        })
    },
    doQuery() {
      if (!isNaN(this.execId)) {
        post("/web/exec/record/detail", {execId: this.execId})
          .then(res => {
            this.debugging = (res.lifeCycle !== "TERMINAL");
            if (!this.debugging) {
              clearInterval(timer);
              this.stopping = false;
            }

            // 状态机
            if (this.debugging) {
              if (res.lifeCycle === "NEW" && !this.stopping) {
                Message.info("已就绪");
              } else if (res.lifeCycle === "RUNNABLE" && !this.stopping) {
                Message.info("压测中");
              } else if (res.lifeCycle === "RUNNABLE" && this.stopping) {
                Message.info("停止中");
              }
            } else {
              if (res.lifeCycle === "TERMINAL" && !this.stopping) {
                Message.info("已结束");
              }
            }
          })
      }
    }
  }
}
</script>

<style scoped>
#jmeter {
  display: flex;
  min-height: 100vh;
  min-width: 1440px;
  flex-direction: column;
  background: white;
  justify-content: space-between;
}

#options {
  padding: 10px 16px 20px 16px;
  display: flex;
  justify-content: space-between;
}

#jmx {
  padding: 0 16px 0 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

#jmx >>> .el-tabs__content {
  flex: 1;
}

#icp {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div id="container">
    <div id="canvas" v-loading="this.loading"
         element-loading-text="等待就绪。。。"
         element-loading-spinner="el-icon-loading">
      <div class="panel-items">
        <div class="panel-item panel-item-line-4">
          <div class="panel-item-title">虚拟用户数</div>
          <div class="panel-item-line-drawer">
            <div id="user" class="metric"/>
          </div>
        </div>
        <div class="panel-item panel-item-line-4">
          <div class="panel-item-title">RPS</div>
          <div class="panel-item-line-drawer">
            <div id="rps" class="metric"/>
          </div>
        </div>
        <div class="panel-item panel-item-line-4">
          <div class="panel-item-title">TPS</div>
          <div class="panel-item-line-drawer">
            <div id="tps" class="metric"/>
          </div>
        </div>
        <div class="panel-item panel-item-line-4">
          <div class="panel-item-title">平均耗时</div>
          <div class="panel-item-line-drawer">
            <div id="elapsed-time" class="metric"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {post} from "@/commons/request";
import {elapsedTimeDv, rpsDv, tpsDv, userDv} from "@/jmeter/components/others/reporter/index";
import ComponentContainer from "@/components/ComponentContainer";
import {Chart} from "@antv/g2";
import {Message} from "element-ui";

let timer;

let userChart;
let rpsChart;
let tpsChart;
let elapsedTimeChart;

function loading(res) {
  if (res.lifeCycle === "NEW") {
    this.loading = true;
    clearInterval(timer);
    timer = setInterval(() => this.doQuery(), this.$store.state.interval);
  } else if (res.lifeCycle === "RUNNABLE") {
    this.loading = false;
    clearInterval(timer);
    timer = setInterval(() => this.doQuery(), this.$store.state.interval);
  } else if (res.lifeCycle === "TERMINAL") {
    this.loading = false;
    clearInterval(timer);
  } else {
    Message.error("未知的生命周期：" + this.$store.state.lifeCycle)
  }
}

export default {
  name: "Reporter",
  components: {ComponentContainer},
  props: {
    execId: String
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    '$store.state.sampleLabel'() {
      if (undefined !== this.$store.state.kv[this.$store.state.sampleLabel]) {
        this.doQuery();
      }
    },
    '$store.state.dida'() {
      this.doDraw();
    }
  },
  methods: {
    doQuery() {
      if (!isNaN(this.execId)) {
        post("/web/exec/record/detail", {execId: this.execId})
          .then(res => {
            loading.call(this, res);
            this.$store.state.tableSuffix = res.tableSuffix;
            this.$store.state.startTime = res.startTime;
            this.$store.state.before = res.before;
            this.$store.state.currentTime = res.currentTime;
            this.$store.state.endTime = res.endTime;
            this.$store.state.dida = !this.$store.state.dida;
          })
      }
    },
    doDraw() {
      post("/web/sampler/summariser", {
        "tableSuffix": this.$store.state.tableSuffix,
        "execId": this.execId,
        "sampleLabel": this.$store.state.sampleLabel,
        "startTime": this.$store.state.lifeCycle === "TERMINAL" ? this.$store.state.startTime : this.$store.state.before,
        "endTime": this.$store.state.lifeCycle === "TERMINAL" ? this.$store.state.endTime : this.$store.state.currentTime
      }).then(data => {
        if (data.userList) {
          userDv.source(data.userList);
          userChart.changeData(userDv.rows);
        } else {
          userChart.changeData([]);
        }
        if (data.rpsList) {
          rpsDv.source(data.rpsList);
          rpsChart.changeData(rpsDv.rows);
        } else {
          rpsChart.changeData([]);
        }
        if (data.tpsList) {
          tpsDv.source(data.tpsList);
          tpsChart.changeData(tpsDv.rows);
        } else {
          tpsChart.changeData([]);
        }
        if (data.elapsedTimeList) {
          elapsedTimeDv.source(data.elapsedTimeList);
          elapsedTimeChart.changeData(elapsedTimeDv.rows);
        } else {
          elapsedTimeChart.changeData([]);
        }
      })
    },
  },
  mounted() {
    userChart = new Chart({
      container: 'user',
      autoFit: true,
      defaultInteractions: ['tooltip', 'legend-filter'],
    });
    userChart.legend(false);
    userChart.animate(false);
    userChart.scale('ts', {
      type: 'timeCat',
      mask: 'hh:mm:ss'
    });
    userChart.line().position('ts*count').color('stat', ['#2fc25b', '#c22f3b']).shape('smooth');
    userChart.interaction('tooltip');
    userChart.interaction('sibling-tooltip');
    userChart.render();

    rpsChart = new Chart({
      container: 'rps',
      autoFit: true,
      defaultInteractions: ['tooltip', 'legend-filter'],
    });
    rpsChart.legend(false);
    rpsChart.animate(false);
    rpsChart.scale('ts', {
      type: 'timeCat',
      mask: 'hh:mm:ss'
    });
    rpsChart.line().position('ts*count').color('stat', ['#1890ff']).shape('smooth');
    rpsChart.interaction('tooltip');
    rpsChart.interaction('sibling-tooltip');
    rpsChart.render();


    tpsChart = new Chart({
      container: 'tps',
      autoFit: true,
      defaultInteractions: ['tooltip', 'legend-filter']
    });
    tpsChart.legend(false);
    tpsChart.animate(false);
    tpsChart.scale('ts', {
      type: 'timeCat',
      mask: 'hh:mm:ss'
    });
    tpsChart.line().position('ts*count').color('stat', ['#2fc25b', '#c22f3b']).shape('smooth');
    tpsChart.interaction('tooltip');
    tpsChart.interaction('sibling-tooltip');
    tpsChart.render();


    elapsedTimeChart = new Chart({
      container: 'elapsed-time',
      autoFit: true,
      defaultInteractions: ['tooltip', 'legend-filter']
    });
    elapsedTimeChart.legend(false);
    elapsedTimeChart.animate(false);
    elapsedTimeChart.scale('ts', {
      type: 'timeCat',
      mask: 'hh:mm:ss'
    });
    elapsedTimeChart.line().position('ts*count').color('stat', ['#2fc25b', '#c22f3b']).shape('smooth');
    elapsedTimeChart.interaction('tooltip');
    elapsedTimeChart.interaction('sibling-tooltip');
    elapsedTimeChart.render();
  }
}
</script>

<style scoped>
#container {
  height: 100%;
}

#canvas {
  height: 600px;
}

.metric {
  margin: 0 16px 0 16px;
  width: calc(100% - 32px);
  height: calc(100% - 16px);
}

.panel-items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.panel-item {
  margin: 4px 0 4px 0;
  background-color: #ffffff;
  border: 1px solid rgba(36, 41, 46, .12);
  border-radius: 3px;
}

.panel-item-line-4 {
  height: 256px;
  min-width: 500px;
  width: calc((100% - 16px) / 2);
  justify-content: center;
  text-align: center;
}

.panel-item-line-drawer {
  height: calc(100% - 40px);
}

.panel-item-title {
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 40px;
}
</style>

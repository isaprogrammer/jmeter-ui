<template>
  <jmeter ref="jmeter" :xml="xml"/>
</template>

<script>
import demo from "./assets/demo"
import {js2xml} from "xml-js"

export default {
  name: 'App',
  data() {
    return {
      xml: js2xml(demo)
    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  background: rgb(60, 63, 65);
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, 微软雅黑, Arial, sans-serif;
}
</style>

<template>
  <div class="simple-upload-container">
    <div class="total-progress">
      <div class="btns">
        <el-button-group>
          <el-button :disabled="changeDisabled">
            <i class="el-icon-upload2 el-icon--left" size="mini"></i>选择文件
            <input
              v-if="!changeDisabled"
              type="file"
              :multiple="multiple"
              class="select-file-input"
              :accept="accept"
              οnclick="f.outerHTML=f.outerHTML"
              @change="handleFileChange"
            />
          </el-button>
          <el-button :disabled="uploadDisabled" @click="handleUpload"><i class="el-icon-upload el-icon--left"
                                                                         size="mini"></i>上传
          </el-button>
          <el-button :disabled="pauseDisabled" @click="handlePause"><i class="el-icon-video-pause el-icon--left"
                                                                       size="mini"></i>暂停
          </el-button>
          <el-button :disabled="resumeDisabled" @click="handleResume"><i class="el-icon-video-play el-icon--left"
                                                                         size="mini"></i>恢复
          </el-button>
          <el-button :disabled="clearDisabled" @click="clearFiles"><i class="el-icon-video-play el-icon--left"
                                                                      size="mini"></i>清空
          </el-button>
        </el-button-group>
        <slot name="header"></slot>
      </div>
    </div>
    <div class="file-list">
      <el-collapse v-if="uploadFiles.length" accordion>
        <el-collapse-item v-for="(item, index) in uploadFiles" :key="index">
          <template slot="title">
            <div class="progress-box">
              <div class="list-item">
                <div class="item-name">
                  <span>{{ index + 1 }}：名称：{{ item.name }}</span>
                </div>
                <div class="item-size">大小：{{ item.size | transformByte }}</div>
                <div v-if="item.hashProgress !== 100" class="item-progress">
                  <span>{{ status === 'wait' ? '准备读取文件' : '正在读取文件' }}：</span>
                  <el-progress :percentage="item.hashProgress"/>
                </div>
                <div v-else class="item-progress"><span>文件进度：</span>
                  <el-progress :percentage="item.uploadProgress"/>
                </div>
                <div class="item-status">
                  <i :class="fileStatusIcon()"></i>
                  {{ item.status | fileStatus }}
                </div>
              </div>
            </div>
          </template>
          <div class="item-chunk-box">
            <el-table :data="item.chunkList" border max-height="300">
              <el-table-column prop="index" label="#" align="center"/>
              <el-table-column prop="hash" label="切片md5" align="center" show-overflow-tooltip/>
              <el-table-column label="大小" align="center" width="120">
                <template v-slot="{ row }">
                  {{ row.size | transformByte }}
                </template>
              </el-table-column>
              <el-table-column prop="uploaded" label="状态" align="center">
                <template v-slot="{ row }">
                  {{ row.uploaded ? '完成' : '进行中' }}
                </template>
              </el-table-column>

              <el-table-column label="进度" align="center">
                <template v-slot="{ row }">
                  <el-progress v-if="!row.status || row.status === 'wait'" :percentage="row.progress"/>
                  <el-progress v-else :percentage="row.progress" :status="row.status"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script>
import {clearLocalStorage, getObjArr, saveObjArr} from '@/commons/utils';
import axios, {CancelToken} from 'axios';
import {post, submit} from "@/commons/request";
import {Message} from "element-ui";

const instance = axios.create({});
let chunkSize = 10 * 1024 * 1024;
let fileIndex = 0;

// 所有文件状态
const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading',
  hash: 'hash',
  error: 'error',
  done: 'done'
};
// 单个文件的状态
const fileStatus = {
  wait: 'wait',
  uploading: 'uploading',
  success: 'success',
  error: 'error',
  secondPass: 'secondPass',
  pause: 'pause',
  resume: 'resume'
};
// 单个文件的状态 对应描述
const fileStatusStr = {
  wait: '待上传',
  uploading: '上传中',
  success: '成功',
  error: '失败',
  secondPass: '已秒传',
  pause: '暂停',
  resume: '恢复'
};

export default {
  name: 'uploader',
  props: {
    headers: {
      type: Object,
      default: null
    },
    beforeUpload: {
      type: Function,
      default: null
    },
    accept: {
      type: String,
      default: ''
    },
    // 是否传递cookie
    withCredentials: {
      type: Boolean,
      default: false
    },
    // 文件个数
    limit: {
      type: Number,
      default: 0
    },
    // 文件超出个数限制时的钩子
    onExceed: {
      type: Function,
      default: () => {
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    // axios baseUrl
    baseUrl: {
      type: String,
      default: ''
    },
    // 切片大小
    chunkSize: {
      type: Number,
      default: 10 * 1024 * 1024
    },
    // 上传并发数
    threads: {
      type: Number,
      default: 3
    },
    // 错误重试次数
    chunkRetry: {
      type: Number,
      default: 3
    }
  },
  data: () => ({
    uploadFiles: [],
    worker: null,
    // 存储要取消的请求
    cancels: [],
    tempThreads: 3,
    // 默认状态
    status: Status.wait
  }),
  filters: {
    transformByte(size) {
      if (!size) {
        return '0B';
      }
      const num = 1024.0;
      if (size < num) {
        return size + 'B';
      }
      if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(2) + 'K';
      }
      if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + 'M';
      }
      if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + 'G';
      }
      return (size / Math.pow(num, 4)).toFixed(2) + 'T';
    },
    // 单个文件状态格式化
    fileStatus(status) {
      return fileStatusStr[fileStatus[status]];
    }
  },
  computed: {
    changeDisabled() {
      return ![Status.wait, Status.done].includes(this.status);
    },
    uploadDisabled() {
      return !this.uploadFiles.length || [Status.pause, Status.done, Status.uploading, Status.hash].includes(this.status);
    },
    pauseDisabled() {
      return [Status.hash, Status.wait, Status.done, Status.pause].includes(this.status);
    },
    resumeDisabled() {
      return ![Status.pause].includes(this.status);
    },
    clearDisabled() {
      return !this.uploadFiles.length;
    },
    fileStatusIcon() {
      return function (status) {
        let className = '';
        switch (status) {
          case 'uploading':
            className = 'el-icon-loading';
            break;
          case 'success':
          case 'secondPass':
            className = 'el-icon-circle-check';
            break;
          case 'error':
            className = 'el-icon-circle-close';
            break;
        }
        return className + ' el-icon--left';
      };
    }
  },
  created() {
    this.setAxios();
    this.tempThreads = this.threads;
  },
  destroyed() {
    this.clearFiles();
  },
  methods: {
    handleFileChange(e) {
      const files = e.target.files;
      console.log('handleFileChange -> file', files);
      if (!files) return;

      fileIndex = 0; // 重置文件下标
      console.log('handleFileChange -> this.uploadFiles', this.uploadFiles);
      // 判断文件选择的个数
      if (this.limit && files.length > this.limit) {
        this.onExceed && this.onExceed(files);
        return;
      }

      this.status = Status.wait;

      const postFiles = Array.prototype.slice.call(files);
      console.log('handleFileChange -> postFiles', postFiles);
      postFiles.forEach((item) => {
        this.handleStart(item);
      });
    },
    handleStart(rawFile) {
      // 初始化部分自定义属性
      rawFile.status = fileStatus.wait;
      rawFile.chunkList = [];
      rawFile.uploadProgress = 0;
      // 假进度条，处理恢复上传后，进度条后移的问题
      rawFile.fakeUploadProgress = 0;
      rawFile.hashProgress = 0;

      if (this.beforeUpload) {
        const before = this.beforeUpload(rawFile);
        if (before && before.then) {
          before.then(() => {
            this.uploadFiles.push(rawFile);
          });
        }
      }

      if (!this.beforeUpload) {
        this.uploadFiles.push(rawFile);
      }
    },
    async handleUpload() {
      console.log('handleUpload -> this.uploadFiles', this.uploadFiles);
      if (!this.uploadFiles) return;
      this.status = Status.uploading;
      const filesArr = this.uploadFiles;

      for (let i = 0; i < filesArr.length; i++) {
        fileIndex = i;
        if (['secondPass', 'success', 'error'].includes(filesArr[i].status)) {
          console.log('跳过已上传成功或已秒传的或失败的');
          continue;
        }

        const fileChunkList = this.createFileChunk(filesArr[i]);

        // 若不是恢复，再进行hash计算
        if (filesArr[i].status !== 'resume') {
          this.status = Status.hash;
          // hash校验，是否为秒传
          filesArr[i].hash = await this.calculateHash(fileChunkList);

          // 若清空或者状态为等待，则跳出循环
          if (this.status === Status.wait) {
            console.log('若清空或者状态为等待，则跳出循环');
            break;
          }

          console.log('handleUpload -> hash', filesArr[i].hash);
        }

        this.status = Status.uploading;

        const result = await this.verifyUpload(filesArr[i].name, filesArr[i].hash);
        if (result.exist) {
          filesArr[i].status = fileStatus.secondPass;
          filesArr[i].uploadProgress = 100;
          this.isAllStatus();
        } else {
          console.log('开始上传文件----》', filesArr[i].name);
          filesArr[i].status = fileStatus.uploading;

          const chunk = this.getChunkStorage(filesArr[i].hash);
          // 文件的hash，合并时使用
          filesArr[i].fileHash = filesArr[i].hash;
          filesArr[i].chunkList = fileChunkList.map(({file}, index) => ({
            fileHash: filesArr[i].hash,
            fileName: filesArr[i].name,
            index,
            hash: filesArr[i].hash + '-' + index,
            chunk: file,
            size: file.size,
            // 标识：是否已完成上传
            uploaded: chunk && chunk.includes(index),
            progress: chunk && chunk.includes(index) ? 100 : 0,
            // 上传状态，用作进度状态显示
            status: chunk && chunk.includes(index) ? 'success' : 'wait'
          }));

          this.$set(filesArr, i, filesArr[i]);

          console.log('handleUpload ->  this.chunkData', filesArr[i]);
          await this.uploadChunks(filesArr[i]);
        }
      }
    },
    // 将切片传输给服务端
    async uploadChunks(data) {
      console.log('uploadChunks -> data', data);
      const chunkData = data.chunkList;
      // 已上传的分片进度条设置为100%
      chunkData
        .filter(({uploaded}) => uploaded)
        .map(item => {
          item.progress = 100;
        });
      // 未上传的分片封装请求参数
      const requestDataList = chunkData
        .filter(({uploaded}) => !uploaded)
        .map(item => {
          const formData = new FormData();
          const index = item.index;
          const fileName = item.fileName;
          formData.append('md5', item.fileHash);
          formData.append('file', item.chunk);
          // 文件名使用切片的下标
          formData.append('fileName', index);

          return {formData, index, fileName};
        });

      console.log('uploadChunks -> requestDataList', requestDataList);
      try {
        const ret = await this.sendRequest(requestDataList, chunkData);
        console.log('uploadChunks -> chunkData', chunkData);
        console.log('ret', ret);
      } catch (error) {
        Message.error("上传存在失败：" + error);
        return;
      }

      // 合并切片
      const isUpload = chunkData.some(item => item.uploaded === false);
      console.log('created -> isUpload', isUpload);
      if (isUpload) {
        alert('存在失败上传的分片，请尝试重新上传');
      } else {
        this.mergeRequest(data);
      }
    },
    // 并发处理
    sendRequest(forms, chunkData) {
      console.log('sendRequest -> forms', forms);
      console.log('sendRequest -> chunkData', chunkData);
      let finished = 0;
      const total = forms.length;
      const that = this;
      // 数组存储每个文件hash请求的重试次数，做累加 比如[1,0,2],就是第0个文件切片报错1次，第2个报错2次
      const retryArr = [];

      return new Promise((resolve, reject) => {
        const handler = () => {
          console.log('handler -> forms', forms);
          if (forms.length) {
            // 出栈
            const formInfo = forms.shift();

            const formData = formInfo.formData;
            const index = formInfo.index;

            submit("/web/dataSet/csv/upload", formData
              , {
                onUploadProgress: that.createProgressHandler(chunkData[index]),
                cancelToken: new CancelToken(c => this.cancels.push(c)),
                timeout: 0
              })
              .then(res => {
                console.log('handler -> res', res);
                if (res.succeed) {
                  // 更改状态
                  chunkData[index].uploaded = true;
                  chunkData[index].status = 'success';

                  // 存储已上传的切片下标
                  this.addChunkStorage(chunkData[index].fileHash, index);

                  finished++;
                  handler();
                } else {
                  // 若状态为暂停或等待，则禁止重试
                  console.log('handler -> this.status', this.status);
                  if ([Status.pause, Status.wait].includes(this.status)) return;

                  console.log('handler -> retryArr', retryArr);
                  if (typeof retryArr[index] !== 'number') {
                    retryArr[index] = 0;
                  }

                  // 更新状态
                  chunkData[index].status = 'warning';

                  // 累加错误次数
                  retryArr[index]++;

                  // 重试3次
                  if (retryArr[index] >= this.chunkRetry) {
                    console.warn(' 重试失败--- > handler -> retryArr', retryArr, chunkData[index].hash);
                    return reject('重试失败', retryArr);
                  }

                  console.log('handler -> retryArr[finished]', `${chunkData[index].hash}--进行第 ${retryArr[index]} '次重试'`);
                  console.log(retryArr);

                  // 释放当前占用的通道
                  this.tempThreads++;

                  // 将失败的重新加入队列
                  forms.push(formInfo);
                  handler();
                }
              })
              .catch(err => {
                // 若状态为暂停或等待，则禁止重试
                console.log('handler -> this.status', this.status);
                if ([Status.pause, Status.wait].includes(this.status)) return;

                console.warn('出现错误', err);
                console.log('handler -> retryArr', retryArr);
                if (typeof retryArr[index] !== 'number') {
                  retryArr[index] = 0;
                }

                // 更新状态
                chunkData[index].status = 'warning';

                // 累加错误次数
                retryArr[index]++;

                // 重试3次
                if (retryArr[index] >= this.chunkRetry) {
                  console.warn(' 重试失败--- > handler -> retryArr', retryArr, chunkData[index].hash);
                  return reject('重试失败', retryArr);
                }

                console.log('handler -> retryArr[finished]', `${chunkData[index].hash}--进行第 ${retryArr[index]} '次重试'`);
                console.log(retryArr);

                // 释放当前占用的通道
                this.tempThreads++;

                // 将失败的重新加入队列
                forms.push(formInfo);
                handler();
              });
          }

          if (finished >= total) {
            resolve('done');
          }
        };

        // 控制并发
        for (let i = 0; i < this.tempThreads; i++) {
          handler();
        }
      });
    },
    // 通知服务端合并切片
    mergeRequest(data) {
      const params = {
        md5: data.fileHash,
        filename: data.name,
        chunks: data.chunkList.length
      };

      post("/web/dataSet/csv/merge", params, {timeout: 0})
        .then(res => {
          // 清除storage
          if (res.succeed) {
            data.status = fileStatus.success;
            console.log('mergeRequest -> data', data);
            clearLocalStorage(data.fileHash);
            // 判断是否所有都成功上传
            this.isAllStatus();
          } else {
            // 文件块数量不对，清除缓存
            clearLocalStorage(data.fileHash);
            data.status = fileStatus.error;
            this.status = Status.wait;
          }
        })
        .catch(err => {
          console.log('mergeRequest -> err', err);
          data.status = fileStatus.error;
        });
    },
    // 创建文件切片
    createFileChunk(file, size = chunkSize) {
      const fileChunkList = [];
      let count = 0;
      while (count < file.size) {
        fileChunkList.push({
          file: file.slice(count, count + size)
        });
        count += size;
      }
      console.log('createFileChunk -> fileChunkList', fileChunkList);
      return fileChunkList;
    },
    // 暂停上传
    handlePause() {
      this.status = Status.pause;
      if (this.uploadFiles.length) {
        const currentFile = this.uploadFiles[fileIndex];
        currentFile.status = fileStatus.pause;
        // 将当前进度赋值给假进度条
        currentFile.fakeUploadProgress = currentFile.uploadProgress;
        console.log('handlePause -> currentFile', currentFile);
      }
      while (this.cancels.length > 0) {
        this.cancels.pop()('取消请求');
      }
    },
    // 恢复上传
    handleResume() {
      this.status = Status.uploading;
      console.log('handleResume -> this.uploadFiles[fileIndex]', this.uploadFiles[fileIndex]);
      this.uploadFiles[fileIndex].status = fileStatus.resume;
      this.handleUpload();
    },
    // 文件上传之前的校验： 校验文件是否已存在
    verifyUpload(fileName, fileHash) {
      return post("/web/dataSet/csv/check", {filename: fileName, md5: fileHash})
        .then(res => {
          console.log('verifyUpload -> res', res);
          return res;
        })
        .catch(err => {
          console.log('verifyUpload -> err', err);
        });
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
      console.log('calculateHash -> fileChunkList', fileChunkList);
      return new Promise((resolve) => {
        // 新建web-worker
        this.worker = new Worker('./hash.js');
        // 发送数据
        this.worker.postMessage({fileChunkList});
        // 回调事件
        this.worker.onmessage = (e) => {
          const {percentage, hash} = e.data;
          if (this.uploadFiles[fileIndex]) {
            this.uploadFiles[fileIndex].hashProgress = Number(percentage.toFixed(0));
            this.$set(this.uploadFiles, fileIndex, this.uploadFiles[fileIndex]);
          }
          if (hash) {
            resolve(hash);
          }
        };
        // 捕获异常
        this.worker.onerror = (e) => {
          console.log('error', e)
        }
      });
    },
    // 切片上传进度
    createProgressHandler(item) {
      console.log('createProgressHandler -> item', item);
      return (p) => {
        item.progress = parseInt(String((p.loaded / p.total) * 100));
        this.fileProgress();
      };
    },
    // 文件总进度
    fileProgress() {
      const currentFile = this.uploadFiles[fileIndex];
      if (currentFile) {
        const uploadProgress = currentFile.chunkList.map((item) => item.size * item.progress).reduce((acc, cur) => acc + cur);
        const currentFileProgress = parseInt((uploadProgress / currentFile.size).toFixed(2));

        // 真假进度条处理--处理进度条后移
        if (!currentFile.fakeUploadProgress) {
          currentFile.uploadProgress = currentFileProgress;
          this.$set(this.uploadFiles, fileIndex, currentFile);
        } else if (currentFileProgress > currentFile.fakeUploadProgress) {
          currentFile.uploadProgress = currentFileProgress;
          this.$set(this.uploadFiles, fileIndex, currentFile);
        }
      }
    },
    // 存储已上传完成的切片下标
    addChunkStorage(name, index) {
      const data = [index];
      console.log('addChunkStorage -> name, data', name, data);
      const arr = getObjArr(name);
      if (arr) {
        saveObjArr(name, [...arr, ...data]);
      } else {
        saveObjArr(name, data);
      }
    },
    // 获取已上传完成的切片下标
    getChunkStorage(name) {
      return getObjArr(name);
    },
    // axios 设置axios参数
    setAxios() {
      if (!this.headers) return;
      for (const i in this.headers) {
        instance.defaults.headers.common[i] = this.headers[i];
      }

      // 是否携带cookie
      if (this.withCredentials) {
        instance.defaults.withCredentials = true;
      }

      // 设置baseUrl
      if (this.baseUrl) {
        instance.defaults.baseURL = this.baseUrl;
      }

      // 设置切片大小
      chunkSize = this.chunkSize;
    },
    // 清空文件
    clearFiles() {
      console.log('清空文件');
      fileIndex = 0;
      this.handlePause();

      // 中断worker
      this.worker && this.worker.terminate();
      this.status = Status.wait;

      // 重置data所有数据
      Object.assign(this.$data, this.$options.data());
    },
    // 判断是否都已完成上传
    isAllStatus() {
      const isAllSuccess = this.uploadFiles.every((item) => ['success', 'secondPass', 'error'].includes(item.status));
      console.log('mergeRequest -> isAllSuccess', isAllSuccess);
      if (isAllSuccess) {
        this.status = Status.done;
        this.$emit('success');
      }
    }
  }
};
</script>

<style scoped>
.simple-upload-container {
  border-radius: 4px;
  background-color: #fff;
}

.simple-upload-container .progress-box {
  width: 100%;
}

.simple-upload-container .total-progress {
  margin-bottom: 15px;
}

.simple-upload-container .total-progress .btns {
  position: relative;
}

.simple-upload-container .total-progress .btns .select-file-input {
  position: absolute;
  display: inline-block;
  left: 0;
  top: 0;
  border: none;
  opacity: 0;
  width: 96px;
  height: 28px;
}

.simple-upload-container .file-list .list-item {
  padding: 8px 10px;
  display: flex;
  justify-content: center;
  justify-items: center;
  line-height: 25px;
  position: relative;
}

.simple-upload-container .file-list .list-item:hover .item-chunk-box {
  display: block;
}

.simple-upload-container .file-list .list-item div {
  flex: 1;
  margin-top: 6px;
}

.simple-upload-container .file-list .list-item .item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 6px;
}

.simple-upload-container .file-list .list-item .item-name .svg-icon {
  font-size: 22px;
  vertical-align: sub;
}

.simple-upload-container .file-list .list-item .item-status {
  flex: 0 0 10%;
  text-align: left;
}

.simple-upload-container .file-list .list-item .item-status .el-icon-circle-check {
  color: #67c23a;
}

.simple-upload-container .file-list .list-item .item-status .el-icon-circle-close {
  color: #f00;
}

.simple-upload-container .file-list .list-item .item-chunk-box {
  display: none;
  transition: all 3s;
  position: absolute;
  top: 0;
  left: 40px;
  z-index: 10;
}

.simple-upload-container .file-list .list-item .item-progress {
  flex: 0 0 60%;
}

.simple-upload-container .upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}

.simple-upload-container .el-progress {
  width: 80%;
  display: inline-block;
}

.simple-upload-container > > > .el-collapse-item__header {
  height: auto;
}
</style>

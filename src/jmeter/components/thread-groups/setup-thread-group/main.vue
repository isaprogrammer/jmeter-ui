<template>
  <component-container :object="object"
                       help-url="https://jmeter.apache.org/usermanual/component_reference.html#Thread_Group">
    <component-field-set :title="t('wm.thread_groups.thread_group.on_sample_error')">
      <el-radio-group v-model="object.onSampleError.value">
        <el-radio label="continue">{{ t('wm.thread_groups.thread_group.continue') }}</el-radio>
        <el-radio label="startnextloop">{{ t('wm.thread_groups.thread_group.next_loop') }}</el-radio>
        <el-radio label="stopthread">{{ t('wm.thread_groups.thread_group.stop_thread') }}</el-radio>
        <el-radio label="stoptest">{{ t('wm.thread_groups.thread_group.stop_test') }}</el-radio>
        <el-radio label="stoptestnow">{{ t('wm.thread_groups.thread_group.stop_test_now') }}</el-radio>
      </el-radio-group>
    </component-field-set>

    <component-field-set :title="t('wm.thread_groups.thread_group.thread')">
      <el-form-item :label="t('wm.thread_groups.thread_group.num_threads')" label-width="140px" prop="numThreads">
        <el-input v-model="object.numThreads.value" type="number"></el-input>
      </el-form-item>
      <el-form-item :label="t('wm.thread_groups.thread_group.ramp_time')" label-width="140px" prop="rampTime">
        <el-input v-model="object.rampTime.value" type="number"></el-input>
      </el-form-item>

      <el-form-item :label="t('wm.thread_groups.thread_group.loops')" label-width="140px" prop="loops">
        <el-input v-model="object.loops.value" :disabled="object.continueForever.value" type="number">
          <template slot="prepend">
            <el-checkbox v-model="object.continueForever.value" @change="changeContinueForever">
              {{ t('wm.thread_groups.thread_group.forever') }}
            </el-checkbox>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label-width="0" prop="sameUserOnNextIteration">
        <el-checkbox v-model="object.sameUserOnNextIteration.value">
          {{ t('wm.thread_groups.thread_group.iteration') }}
        </el-checkbox>
      </el-form-item>
      <el-form-item label-width="0" prop="scheduler">
        <el-checkbox v-model="object.scheduler.value" @change="changeScheduler">
          {{ t('wm.thread_groups.thread_group.scheduler') }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="t('wm.thread_groups.thread_group.duration')" label-width="140px" prop="duration">
        <el-input v-model="object.duration.value" :disabled="!object.scheduler.value" type="number"></el-input>
      </el-form-item>
      <el-form-item :label="t('wm.thread_groups.thread_group.delay')" label-width="140px" prop="delay">
        <el-input v-model="object.delay.value" :disabled="!object.scheduler.value" type="number"></el-input>
      </el-form-item>
    </component-field-set>
  </component-container>
</template>

<script>
import ComponentContainer from "@/components/ComponentContainer";
import ComponentFieldSet from "@/components/ComponentFieldSet";
import SetupThreadGroup from "@/jmeter/components/thread-groups/setup-thread-group/index";
import Locale from "@/mixins/locale";

export default {
  name: "SetupThreadGroup",
  components: {ComponentFieldSet, ComponentContainer},
  mixins: [Locale],
  props: {
    object: SetupThreadGroup
  },
  methods: {
    changeContinueForever(value) {
      if (value === true) {
        if (this.object.loops.value !== undefined) {
          this.object.loops.value = -1;
        }
      } else {
        if (this.object.loops.value === -1) {
          this.object.loops.value = 1;
        }
      }
    },
    changeScheduler(value) {
      if (value === false) {
        this.object.duration.value = 0;
        this.object.delay.value = 0
      }
    }
  }
}
</script>

<style scoped>

</style>

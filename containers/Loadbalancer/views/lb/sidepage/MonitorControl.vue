<template>
  <div class="d-flex">
    <monitor-header
      :time.sync="time"
      :showTimegroup="false"
      :loading="loading"
      :timeOpts="timeOpts"
      @update:time="updateTime"
      @refresh="refresh">
      <template v-slot:radio-button-append>
        <custom-date :time.sync="time" :customTime.sync="customTime" />
      </template>
    </monitor-header>
    <div class="ant-form-item-label">
      <label :title="$t('loadbalancer.text_4')">{{$t('loadbalancer.text_4')}}</label>
    </div>
<!--    <a-select v-model="aggregate" style="width: 150px;">-->
<!--      <a-select-option v-for="item in aggregateOpts" :value="item.key" :key="item.key">{{ item.label }}</a-select-option>-->
<!--    </a-select>-->
    <a-select v-model="listener" style="width: 120px;">
      <a-select-option v-for="item in listenerOpts" :value="item.id" :key="item.label">{{ item.label }}</a-select-option>
    </a-select>
    <div class="ml-3 ant-form-item-label">
      <label :title="$t('loadbalancer.text_5')">{{$t('loadbalancer.text_5')}}</label>
    </div>
    <a-switch class="align-self-center" :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" v-model="showBackend" />
  </div>
</template>

<script>
import MonitorHeader from '@/sections/Monitor/Header'
import CustomDate from '@/sections/CustomDate'
import { timeOpts } from '@/constants/monitor'

export default {
  name: 'LbMonitorControl',
  components: {
    MonitorHeader,
    CustomDate,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    listenerOpts: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    timeFormat: {
      type: String,
    },
  },
  data () {
    const timeFormatStr = this.timeFormat || 'YYYY-MM-DD HH:mm'
    // const listener = this.listenerOpts[0] || ''
    return {
      time: '1h',
      timeFormatStr,
      customTime: null,
      // aggregate: 'mean',
      showBackend: false,
      listener: '',
      // listener,
      timeOpts,
    }
  },
  // computed: {
  //   valueC () {
  //     return this.listenerOpts[0] || ''
  //   },
  // },
  watch: {
    time () {
      // if custom, this.time output is 'custom', but does not trigger updateTime func.
      console.log(this.time)
      console.log('time field')
      if (this.time !== 'custom') {
        this.emitValue()
      }
    },
    customTime () {
      console.log(this.customTime)
      console.log('customTime')
      this.emitValue()
    },
    // aggregate () {
    //   this.emitValue()
    // },
    showBackend () {
      console.log(this.showBackend)
      console.log('showBackend')
      this.emitValue()
    },
    listener () {
      console.log(this.listener)
      console.log('listener')
      this.emitValue()
    },
    listenerOpts () {
      console.log(this.listenerOpts)
      console.log('listenerOpts')
      this.listener = this.listenerOpts[0].id || ''
    },
  },
  // created () {
  //   this.listener = this.listenerOpts[0]
  // },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    updateTime (time, timeFormat) {
      console.log('updateTime')
      this.$emit('update:time', time)
      if (!this.timeFormat) {
        this.timeFormatStr = timeFormat
      }
    },
    emitValue () {
      console.log('emitValue')
      const value = {
        time: {
          from: `now-${this.time}`,
        },
        // aggregate: this.aggregate,
        listener: this.listener,
        showBackend: this.showBackend,
      }
      if (this.customTime && this.time === 'custom') {
        value.time = this.customTime
      }
      this.$emit('input', value)
    },
  },
}
</script>

<style>

</style>

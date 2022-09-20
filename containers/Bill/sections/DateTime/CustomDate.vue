<template>
  <a-popconfirm placement="bottomRight" overlayClassName="custom-date-time" @confirm="submit" @cancel="cancel" v-model="visible">
    <template v-slot:icon><i /></template>
    <template v-slot:title class="pl-0">
      <a-form-model hideRequiredMark v-if="isAdvancedView" ref="ruleForm" :model="formData" :rules="rules" v-bind="layout">
        <a-form-model-item :label="$t('bill.text_40')" prop="start">
          <a-date-picker
            v-model="formData.start"
            :disabled-date="disabledStartDate"
            :disabled-time="disabledDateTime"
            format="YYYY-MM-DD"
            :open="startOpen"
            :placeholder="$t('bill.text_40')"
            @openChange="handleStartOpenChange" />
        </a-form-model-item>
        <a-form-model-item :label="$t('bill.text_41')" prop="end">
          <a-date-picker
            v-model="formData.end"
            :disabled-date="disabledEndDate"
            :disabled-time="disabledDateTime"
            format="YYYY-MM-DD"
            :placeholder="$t('bill.text_41')"
            :open="endOpen"
            @openChange="handleEndOpenChange" />
        </a-form-model-item>
      </a-form-model>
      <div class="mb-3 d-flex align-items-center" v-else>
        <div class="ant-form-item-label">
          <label :title="$t('bill.text_42')" class="ant-form-item-no-colon">{{$t('bill.text_42')}}</label>
        </div>
        <a-input-group compact>
          <a-select v-model="shortcutData.time" style="width: 120px">
            <a-select-option v-for="item in (shortcutData.timeMode === 'month' ? 12 : 4)" :value="item" :key="item">{{ item }}</a-select-option>
          </a-select>
          <a-select v-model="shortcutData.timeMode" style="width: 120px" @change="timeModeChange">
            <a-select-option v-for="item in timeMode" :key="item.key" :value="item.key">{{ item.label }}</a-select-option>
          </a-select>
        </a-input-group>
      </div>
      <a-button type="link" class="position-absolute" style="bottom: -28px;" @click="toggleView">{{ isAdvancedView ? $t('bill.text_43') : $t('bill.text_44') }}</a-button>
    </template>
    <a-radio-button value="custom">{{$t('bill.text_45')}}{{ suffix }}</a-radio-button>
  </a-popconfirm>
</template>

<script>
import moment from 'moment'
import * as R from 'ramda'

export default {
  name: 'CustomDate',
  props: {
    endTime: {
      type: Object,
      default: () => moment(),
    },
    suffix: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      formData: {
        start: null,
        end: this.endTime,
      },
      shortcutData: {
        time: 1,
        timeMode: 'month',
      },
      isAdvancedView: false, // 是否展示高级窗口
      confirmView: false, // 确认状态下的是否展示高级窗口
      visible: false,
      startOpen: false,
      endOpen: false,
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      timeMode: [
        { key: 'month', label: this.$t('bill.text_46') },
        { key: 'quarter', label: this.$t('bill.text_47') },
        { key: 'year', label: this.$t('bill.text_48') },
      ],
      rules: {
        start: [
          { required: true, message: this.$t('bill.text_49') },
        ],
        end: [
          { required: true, message: this.$t('bill.text_49') },
        ],
      },
    }
  },
  methods: {
    timeModeChange (val) {
      if (val === 'year' || val === 'quarter') {
        if (this.shortcutData.time > 4) {
          this.shortcutData.time = 1
        }
      }
    },
    toggleView () {
      this.isAdvancedView = !this.isAdvancedView
    },
    cancel () {
      this.visible = false
      setTimeout(() => {
        this.isAdvancedView = this.confirmView
      }, 300)
    },
    getCustomTime () {
      if (this.isAdvancedView) {
        return R.clone(this.formData)
      } else {
        const end = this.$moment()
        const start = this.$moment().subtract(this.shortcutData.time, this.shortcutData.timeMode)
        return {
          start,
          end,
        }
      }
    },
    async submit () {
      try {
        const valid = this.isAdvancedView ? await this.$refs.ruleForm.validate() : true
        if (valid) {
          this.$emit('update:time', 'custom')
          this.$emit('update:customDate', this.getCustomTime())
          this.visible = false
        } else {
          this.visible = true
        }
        this.confirmView = this.isAdvancedView
      } catch (error) {
        this.visible = true
        throw error
      }
    },
    disabledStartDate (start) {
      const end = this.formData.end
      if (!start || !end) {
        return start && (start > this.$moment().endOf('day'))
      }
      return (start && (start > this.$moment().endOf('day'))) || (start.valueOf() > end.valueOf())
    },
    disabledEndDate (end) {
      const start = this.formData.start
      if (!end || !start) {
        return end && (end > this.$moment().endOf('day'))
      }
      return (end && (end > this.$moment().endOf('day'))) || (start.valueOf() >= end.valueOf())
    },
    handleStartOpenChange (open) {
      this.startOpen = open
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    disabledDateTime () {
      return {
        disabledSeconds: () => this._range(1, 60),
      }
    },
    _range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
  },
}
</script>

<style lang="less" scoped>
.custom-date-time ::v-deep .ant-popover-inner-content {
  min-width: 277px;
}
</style>

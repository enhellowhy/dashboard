<template>
  <div>
    <a-form :form="form.fc">
      <rule
        ref="ruleDescForm"
        :ruleType="ruleType"
        :form="form.fc"
        :decorators="decorators"
        :formItemLayout="formItemLayout" />
      <priod
        :decorators="decorators"
        :timeOptions="timeOptions"
        :durationOptions="durationOptions"
        :formItemLayout="formItemLayout" />
    </a-form>
  </div>
</template>

<script>
import { timeOptions, durationOptions } from '../constants'
import Priod from './Priod'
import Rule from './Rule'

export default {
  name: 'ScaleDownForm',
  components: {
    Priod,
    Rule,
  },
  props: {
    initValues: {
      type: Object,
    },
    ruleType: {
      type: Object,
    },
  },
  data () {
    const initValues = { priod: '1h', time: '1d', ...this.initValues }
    return {
      formItemLayout: {
        wrapperCol: {
          span: 21,
        },
        labelCol: {
          span: 3,
        },
      },
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        time: ['time', { initialValue: initValues.time }],
        priod: ['priod', { initialValue: initValues.priod }],
      },
      timeOptions,
      durationOptions,
    }
  },
  methods: {
    validateForm () {
      const ruleDesc = this.$refs.ruleDescForm.validateForm()
      const scaleDownForm = new Promise((resolve, reject) => {
        this.form.fc.validateFields((err, values) => {
          if (!err) {
            resolve({ ...values })
          } else {
            reject(err)
          }
        })
      })
      return Promise.all([ruleDesc, scaleDownForm]).then((result) => {
        return {
          ruleSetting: result[0],
          ...result[1],
        }
      })
    },
  },
}
</script>

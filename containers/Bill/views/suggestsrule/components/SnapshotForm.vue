<template>
  <div>
    <a-form :form="form.fc">
      <a-form-item
        :label="$t('bill.text_188')"
        v-bind="formItemLayout">
        <span>{{$t('bill.text_87')}}</span>
      </a-form-item>
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

export default {
  name: 'SnapshotForm',
  components: {
    Priod,
  },
  props: {
    initValues: {
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
      return new Promise((resolve, reject) => {
        this.form.fc.validateFields((err, values) => {
          if (!err) {
            resolve({ ...values })
          } else {
            reject(err)
          }
        })
      })
    },
  },
}
</script>

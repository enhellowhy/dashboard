<template>
  <a-form-model
    ref="ruleDescForm"
    :model="ruleDescForm"
    v-bind="formItemLayoutWithOutLabel">
    <a-form-model-item
      v-for="(item, index) in ruleDescForm.ruleData"
      :key="item.key"
      v-bind="index === 0 ? formItemLayout : {}"
      :label="index === 0 ? $t('bill.text_188') : ''"
      :required="true">
      <a-row type="flex" justify="start" :gutter="4">
        <a-col :span="4" v-if="index !== 0">
          <a-form-model-item
            :prop="'ruleData.' + index + '.operator'"
            :rules="{
              required: true,
              message: ' ',
              trigger: 'blur',
            }">
            <a-select :loading="loading.operator" v-model="item.operator" :placeholder="$t('bill.text_199')">
              <a-select-option v-for="(operator, index) in options.operators" :key="index" :value="operator.key">{{ operator.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            :prop="'ruleData.' + index + '.measurement'"
            :rules="{
              required: true,
              message: $t('bill.text_200'),
              trigger: 'blur',
            }">
            <a-select
              :loading="loading.measurement"
              v-model="item.measurement"
              @change="fetchFeild(item)"
              :dropdownMatchSelectWidth="false"
              :placeholder="$t('bill.text_201')">
              <a-select-option v-for="(measurement, index) in options.measurements" :key="index" :value="measurement.key">{{ measurement.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item
            :prop="'ruleData.' + index + '.field'"
            :rules="{
              required: true,
              message: $t('bill.text_202'),
              trigger: 'blur',
            }">
            <a-select
              :loading="loading.field"
              v-model="item.field"
              :dropdownMatchSelectWidth="false"
              :placeholder="$t('bill.text_203')">
              <a-select-option v-for="(field, index) in item.fields" :key="index" :value="field.key">{{ field.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="3">
          <a-form-model-item
            :prop="'ruleData.' + index + '.eval_type'"
            :rules="{
              required: true,
              message: ' ',
              trigger: 'blur',
            }">
            <a-select :loading="loading.eval_type" v-model="item.eval_type">
              <a-select-option v-for="(eval_type, index) in options.eval_types" :key="index" :value="eval_type.key">{{ eval_type.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item
            :prop="'ruleData.' + index + '.threshold'"
            :rules="[
              { required: true, message: $t('bill.text_204'), trigger: 'blur' },
              { validator: (rule, value, callback)=>{checkThreshold(rule, value, callback)}, trigger: 'change' }
            ]">
            <a-input v-model="item.threshold" :placeholder="$t('bill.text_205')" />
          </a-form-model-item>
        </a-col>
        <a-col :span="1">
          <a-icon
            v-if="ruleDescForm.ruleData.length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="ruleDescForm.ruleData.length === 1"
            @click="remove(item)" />
          </a-col>
        </a-row>
    </a-form-model-item>
    <a-form-model-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="primary" shape="circle" icon="plus" size="small" @click="add" />
        <a-button type="link" @click="add">{{$t('bill.text_206')}}</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'Rule',
  props: {
    formItemLayout: {
      type: Object,
    },
    ruleType: {
      type: Object,
    },
  },
  data () {
    return {
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          span: 21,
          offset: 3,
        },
      },
      ruleDescForm: {
        ruleData: [
          {
            database: 'telegraf',
            operator: 'and',
            measurement: undefined,
            field: undefined,
            eval_type: '>',
            threshold: '',
            fields: [],
            key: Date.now(),
          },
        ],
      },
      options: {
        operators: [
          { label: 'and', key: 'and' },
          { label: 'or', key: 'or' },
        ],
        measurements: [],
        eval_types: [
          { label: '>', key: '>' },
          { label: '<', key: '<' },
        ],
      },
      loading: {
        operator: false,
        measurement: false,
        field: false,
        eval_type: false,
        threshold: false,
      },
    }
  },
  created () {
    this.fetchMeasurement()
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    remove (item) {
      const index = this.ruleDescForm.ruleData.indexOf(item)
      if (index !== -1) {
        this.ruleDescForm.ruleData.splice(index, 1)
      }
    },
    add () {
      this.ruleDescForm.ruleData.push({
        database: 'telegraf',
        operator: 'and',
        measurement: undefined,
        field: undefined,
        eval_type: '>',
        threshold: '',
        fields: [],
        key: Date.now(),
      })
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleDescForm.validate((valid) => {
          if (valid) {
            const ruleDesc = this.ruleDescForm.ruleData.map((item) => {
              delete item.fields
              return {
                ...item,
              }
            })
            resolve(ruleDesc)
          } else {
            reject(valid)
          }
        })
      })
    },
    fetchMeasurement () {
      new this.$Manager('suggestsysrules/measurements', 'v1')
        .list({ params: { database: 'telegraf', type: this.ruleType.key } })
        .then((res) => {
          const { measurements } = res.data
          this.options.measurements = measurements.map((item) => {
            const val = item.measurement
            return {
              label: val,
              key: val,
            }
          })
        })
        .catch(() => {
          this.options.measurements = []
        })
    },
    fetchFeild (item) {
      const params = { database: 'telegraf', measurement: item.measurement }
      new this.$Manager('suggestsysrules/metric-measurement', 'v1')
        .list({ params })
        .then((res) => {
          const { field_key } = res.data
          const fields = field_key.map((field) => {
            return {
              label: field,
              key: field,
            }
          })
          item.fields = fields
        })
        .catch(() => {
          item.fields = []
        })
    },
    checkThreshold (rule, value, callback) {
      if (value < 1) {
        callback(new Error(this.$t('common_466')))
      }
      callback()
    },
  },
}
</script>
<style lang="less" scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 18px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.ant-row.ant-form-item {
  margin-bottom: 0;
}
</style>

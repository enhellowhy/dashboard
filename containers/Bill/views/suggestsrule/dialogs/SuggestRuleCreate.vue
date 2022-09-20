<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_211')}}</div>
    <div slot="body">
      <a-form :form="form.fc">
        <a-form-item
          :label="$t('bill.text_212')"
          v-bind="formItemLayout">
          <a-select class="w-100" v-decorator="decorators.type" :labelInValue="true" :placeholder="$t('bill.text_213')">
            <a-select-option v-for="v in ruleTypes" :key="v.key" :value="v.key">{{v.label}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <component :is="currentComponent" :ruleType="ruleType" ref="formRef" />
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t("dialog.ok") }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import { renderComponentMap } from '../constants'
import EipForm from '../components/EipForm'
import DiskForm from '../components/DiskForm'
import LbForm from '../components/LbForm'
import ScaleDownForm from '../components/ScaleDownForm'
import SnapshotForm from '../components/SnapshotForm'
import GroupRuleForm from '../components/GroupRuleForm'
import OssSecAclForm from '../components/OssSecAclForm'
import RedisUnreasonableForm from '../components/RedisUnreasonableForm'
import RdsUnreasonableForm from '../components/RdsUnreasonableForm'
import OssUnreasonableForm from '../components/OssUnreasonableForm'
import { RuleTypes, RuleTypeMap } from '@Bill/constants'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'SuggestRuleCreateDialog',
  components: {
    EipForm,
    DiskForm,
    LbForm,
    ScaleDownForm,
    SnapshotForm,
    GroupRuleForm,
    OssSecAclForm,
    RedisUnreasonableForm,
    RdsUnreasonableForm,
    OssUnreasonableForm,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      formItemLayout: {
        wrapperCol: {
          span: 21,
        },
        labelCol: {
          span: 3,
        },
      },
      ruleTypes: [],
      form: {
        fc: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
        fd: { type: '' },
      },
      decorators: {
        type: ['type', { rules: [{ required: true, message: this.$t('bill.text_214') }] }],
      },
      currentComponent: '',
    }
  },
  computed: {
    ruleType () {
      return this.form.fd.type
    },
  },
  watch: {
    'form.fd.type' (val) {
      if (val) {
        this.currentComponent = renderComponentMap[val.key]
      }
    },
  },
  created () {
    this.fetchSuggestSysRules()
  },
  methods: {
    doCreate (data) {
      return this.params.onManager('create', {
        managerArgs: {
          data,
        },
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        const type = values.type.key
        const formValues = await this.$refs.formRef.validateForm()
        const params = {
          name: values.type.label,
          period: this.generatePriod(formValues.priod),
          type: type,
          setting: this.generateSetting(type, formValues),
        }
        if (formValues.time) {
          params.time_from = this.generatePriod(formValues.time)
        }
        this.loading = true
        await this.doCreate(params)
        this.loading = false
        this.cancelDialog()
        this.$message.success(this.$t('bill.text_59'))
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    onValuesChange (props, values) {
      Object.keys(values).forEach((key) => {
        this.form.fd[key] = values[key]
      })
    },
    async fetchSuggestSysRules () {
      try {
        const manager = new this.$Manager('suggestsysrules', 'v1')
        const res = await manager.get({ id: 'rule-type' })
        const ruleTypes = res.data && res.data['rule-type']
        this.ruleTypes = ruleTypes.map((item) => {
          const ruleType = RuleTypes.find((v) => {
            return v.key === item
          })
          return ruleType || { key: item, label: item }
        })
      } catch (error) {
        throw error
      }
    },
    generateSetting (type, formValues) {
      let setting = {}
      if (type === RuleTypeMap.EIP_UNUSED) {
        setting = { eip_unused: {} }
      } else if (type === RuleTypeMap.DISK_UNUSED) {
        setting = { disk_unused: {} }
      } else if (type === RuleTypeMap.LB_UNUSED) {
        setting = { lb_unused: {} }
      } else if (type === RuleTypeMap.SCALE_DOWN) {
        setting = { scale_rule: formValues.ruleSetting }
      } else if (type === RuleTypeMap.SNAPSHOT_UNUSED) {
        setting = {}
      } else if (type === RuleTypeMap.SECGROUPRULEINSERVER_ALLIN) {
        setting = {}
      } else if (type === RuleTypeMap.OSS_SEC_ACL) {
        setting = {}
      } else if (type === RuleTypeMap.REDIS_UNREASONABLE) {
        setting = { scale_rule: formValues.ruleSetting }
      } else if (type === RuleTypeMap.RDS_UNREASONABLE) {
        setting = { scale_rule: formValues.ruleSetting }
      } else if (type === RuleTypeMap.OSS_UNREASONABLE) {
        setting = { scale_rule: formValues.ruleSetting }
      }
      return setting
    },
    generatePriod (proid) {
      let priodVal = parseInt(proid)
      const priodUnit = proid.substr(-1)
      if (priodUnit === 'M') {
        priodVal = priodVal * 24 * 30
      } else if (priodUnit === 'w') {
        priodVal = priodVal * 24 * 30 * 7
      } else if (priodUnit === 'y') {
        priodVal = priodVal * 24 * 30 * 365
      } else if (priodUnit === 'd') {
        priodVal = priodVal * 24
      } else {
        return proid
      }
      return `${priodVal}h`
    },
  },
}
</script>

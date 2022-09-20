<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('bill.text_221')}}</div>
    <div slot="body">
      <a-form :form="form.fc" v-bind="formItemLayout">
        <a-form-item :label="$t('bill.text_88')">
          <a-input v-decorator="decorators.name"  :placeholder="$t('bill.text_145')" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_173')">
          <a-select v-decorator="decorators.type" :placeholder="$t('bill.text_222')">
            <a-select-option v-for="type in types" :key="type" :value="type">{{ $t('suggestsyRuleTypes')[type] }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('common.text00105')">
          <a-radio-group v-model="formScope">
            <a-radio-button
              v-for="item in scopeOptions"
              :value="item.key"
              :key="item.key">{{ item.label }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('dictionary.domain')" key="domain"  v-if="isDomainScope">
          <base-select
            resource="domains"
            v-decorator="decorators.domain"
            :params="domainParams"
            filterable
            version="v1"
            :select-props="{ placeholder: `${$t('common.text00106')}${$t('dictionary.domain')}` }" />
        </a-form-item>
        <a-form-item :label="$t('dictionary.project')" key="project" v-if="isProjectScope">
          <base-select
            resource="projects"
            :labelFormat="projectsLabelFormat"
            v-decorator="decorators.project"
            :params="projectParams"
            filterable
            version="v1"
            :need-params="true"
            :select-props="{ placeholder: `${$t('common.text00106')}${$t('dictionary.project')}` }" />
        </a-form-item>
        <a-form-item :label="$t('bill.text_223')">
          <a-switch v-decorator="decorators.ignore_alert" />
        </a-form-item>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t("dialog.ok") }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'SuggestsRuleConfigCreate',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      formScope: '',
      scope: this.$store.getters.scope,
      isAdminMode: this.$store.getters.isAdminMode,
      isDomainMode: this.$store.getters.isDomainMode,
      l3PermissionEnable: this.$store.getters.l3PermissionEnable,
      userInfo: this.$store.getters.userInfo,
      form: {
        fc: this.$form.createForm(this),
      },
      formItemLayout: {
        wrapperCol: {
          span: 19,
        },
        labelCol: {
          span: 5,
        },
      },
      decorators: {
        name: [
          'name',
          {
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('bill.text_145') },
              { validator: this.$validate('resourceName') },
            ],
          },
        ],
        type: [
          'type',
          {
            rules: [
              {
                required: true,
                message: this.$t('bill.text_224'),
              },
            ],
          },
        ],
        domain: [
          'project_domain',
          {
            validateTrigger: 'blur',
            rules: [
              { required: true, message: this.$t('rules.domain') },
            ],
          },
        ],
        project: [
          'project_id',
          {
            validateTrigger: 'blur',
            rules: [
              { required: true, message: this.$t('rules.project') },
            ],
          },
        ],
        ignore_alert: [
          'ignore_alert',
          {
            // validateFirst: true,
            initialValue: true,
            valuePropName: 'checked',
          },
        ],
      },
      types: [],
    }
  },
  computed: {
    isDomainScope () {
      return this.formScope === 'domain'
    },
    isProjectScope () {
      return this.formScope === 'project'
    },
    domainParams () {
      return {
        scope: this.scope,
        limit: 0,
      }
    },
    projectParams () {
      const params = { limit: 0 }
      if (this.isAdminMode) {
        params.scope = 'system'
      } else if (this.isDomainMode) {
        params.project_domain = this.userInfo.domain.id
      }
      return params
    },
    scopeOptions () {
      const ret = [
        { label: this.$t('shareScope.project'), key: 'project' },
      ]
      if (this.isAdminMode) {
        ret.splice(0, 0, { label: this.$t('shareScope.system'), key: 'system' })
        if (this.l3PermissionEnable) {
          ret.splice(1, 0, { label: this.$t('shareScope.domain'), key: 'domain' })
        }
      }
      return ret
    },
  },
  created () {
    this.queryTyes()
    this.$nextTick(() => {
      this.formScope = this.scopeOptions[0].key
    })
  },
  methods: {
    async queryTyes () {
      const { data = {} } = await this.params.onManager('get', {
        managerArgs: {
          id: 'support-types',
        },
      })
      if (data.types && data.types.length > 0) {
        this.types = data.types
        this.form.fc.setFieldsValue({
          type: this.types[0],
        })
      }
    },
    doCreate (data) {
      data.scope = this.formScope
      return this.params.onManager('create', {
        managerArgs: {
          data,
        },
      })
    },
    projectsLabelFormat (item) {
      return <div class='d-flex'>
        <span class='text-truncate flex-fill mr-2' title={ item.name }>{ item.name }</span>
        {(this.isAdminMode && this.l3PermissionEnable) ? <span style="color: #8492a6; font-size: 13px">{this.$t('bill.text_225', [this.$t('dictionary.domain')])}: {item.project_domain}</span> : null}
      </div>
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        await this.doCreate(values)
        this.cancelDialog()
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

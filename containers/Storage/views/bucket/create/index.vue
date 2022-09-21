<template>
  <div>
    <page-header :title="$t('storage.text_95')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv" />
    <page-body needMarginBottom>
      <a-form :form="form.fc" v-bind="formItemLayout">
        <a-form-item :label="$t('storage.text_55', [$t('dictionary.project')])" class="mb-0" v-bind="formItemLayout">
          <domain-project :fc="form.fc" :decorators="{ project: decorators.project, domain: decorators.domain }" @update:domain="handleDomainChange" />
        </a-form-item>
        <area-selects
          class="mb-0"
          ref="areaSelects"
          :wrapperCol="formItemLayout.wrapperCol"
          :labelCol="formItemLayout.labelCol"
          :names="areaselectsName"
          :cloudregionParams="cloudregionParams"
          :isRequired="true"
          :cloudregionParamsMapper="cloudregionParamsMapper"
          :providerParams="providerParams"
          filterBrandResource="object_storage"
          @change="handleCloudregionChange" />
<!--        <a-form-item :label="$t('storage.text_40')">-->
        <a-form-item :label="$t('storage.bucket.name')">
          <a-input :placeholder="$t('storage.text_56')" v-decorator="decorators.name" />
          <span slot="extra">{{$t('storage.bucket.name.tooltip')}}<template v-if="cloudregion.provider === 'Azure'"><br />{{$t('storage.text_102')}}</template></span>
        </a-form-item>
        <a-form-item :label="$t('storage.bucket.owner')" required v-bind="formItemLayout">
          <cloudprovider :form="form" :decorator="decorators.cloudproviderConfig" />
        </a-form-item>
<!--        <a-form-item :label="$t('common.description')">-->
<!--          <a-textarea :auto-size="{ minRows: 1, maxRows: 3 }" v-decorator="decorators.description" :placeholder="$t('common_367')" />-->
<!--        </a-form-item>-->
        <a-form-item :label="$t('compute.text_1041')" v-if="isOpenWorkflow">
          <a-input v-decorator="decorators.reason" :placeholder="$t('storage.bucket.apply.reason')" />
        </a-form-item>
<!--        <a-form-item :label="$t('compute.text_15')" required v-bind="formItemLayout">-->
<!--          <base-select-->
<!--            class="w-50"-->
<!--            v-decorator="decorators.cloudprovider"-->
<!--            resource="cloudproviders"-->
<!--            :params="cloudproviderParams"-->
<!--            :mapper="providerMapper"-->
<!--            :isDefaultSelect="true"-->
<!--            :showSync="true"-->
<!--            :select-props="{ placeholder: $t('compute.text_149') }" />-->
<!--        </a-form-item>-->
        <a-form-item :label="$t('storage.xsky.eos.worm')" v-if="this.cloudEnv === 'onpremise'">
          <a-switch :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" v-decorator="decorators.worm" @change="handleWormChange" :disabled="this.versioned" />
          <span slot="extra">{{$t('storage.xsky.eos.worm.label')}}<template v-if="this.versioned">{{$t('storage.xsky.eos.versioned_worm.label')}}</template></span>
        </a-form-item>
        <a-form-item :label="$t('storage.xsky.eos.versioned')" v-if="this.cloudEnv === 'onpremise'">
          <a-switch :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" v-decorator="decorators.versioned" @change="handleVersionedChange" :disabled="this.worm" />
          <span slot="extra"><template v-if="this.worm">{{$t('storage.xsky.eos.versioned_worm.label')}}</template></span>
        </a-form-item>
        <a-form-item :label="$t('storage.text_59')" v-if="this.cloudEnv === 'onpremise'">
          <a-input class="w-50" name="size_bytes" v-decorator="decorators.size_bytes" @blur="handelBlur">
            <a-select slot="addonAfter" style="width: 80px" v-decorator="decorators.size_bytes_unit">
              <a-select-option v-for="item in sizeUnitOpts" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
          </a-input>
          <span slot="extra">{{$t('storage.text_127')}}</span>
        </a-form-item>
        <a-form-item :label="$t('storage.text_128')" v-if="this.cloudEnv === 'onpremise'">
          <a-input class="w-50" name="object_count" v-decorator="decorators.object_count" @blur="handelBlur">
            <a-select slot="addonAfter" type="number" style="width: 80px" v-decorator="decorators.object_count_unit">
              <a-select-option v-for="item in unitOpts" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
            </a-select>
          </a-input>
          <span slot="extra">{{$t('storage.text_127')}}</span>
        </a-form-item>
        <a-form-item :label="$t('compute.text_1154')" class="mb-0">
          <tag
            v-decorator="decorators.tag" />
        </a-form-item>
      </a-form>
    </page-body>
    <page-footer>
      <div slot="right">
<!--        <a-button class="float-right" type="primary" @click="handleConfirm" :loading="loading">{{ $t('common_258') }}</a-button>-->
        <a-button class="float-right" type="primary" @click="handleConfirm" :loading="loading">{{ confirmText }}</a-button>
      </div>
    </page-footer>
  </div>
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import { formItemLayout } from '@Storage/constants/index.js'
import Tag from '@/sections/Tag'
import AreaSelects from '@/sections/AreaSelects'
import { isRequired } from '@/utils/validate'
import i18n from '@/locales'
import DomainProject from '@/sections/DomainProject'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'
import Cloudprovider from '@Storage/sections/Cloudprovider'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import workflowMixin from '@/mixins/workflow'

function validateTag (rule, value, callback) {
  if (R.is(Object, value) && Object.keys(value).length > 20) {
    return callback(new Error(i18n.t('compute.text_209')))
  }
  callback()
}

export default {
  name: 'BucketCreate',
  components: {
    Cloudprovider,
    AreaSelects,
    DomainProject,
    Tag,
  },
  mixins: [workflowMixin],
  data () {
    const cloudEnvOptions = getCloudEnvOptions('object_storage_brands', true)
    return {
      loading: false,
      cloudEnvOptions,
      routerQuery: this.$route.query.type,
      cloudEnv: this.$route.query.type ? this.$route.query.type : cloudEnvOptions[0].key,
      form: {
        fc: this.$form.createForm(this),
      },
      formItemLayout,
      project_domain: '',
      worm: false,
      versioned: false,
      sizeUnitOpts: [
        { value: Math.pow(1024, 0), label: 'B' },
        { value: Math.pow(1024, 1), label: 'KB' },
        { value: Math.pow(1024, 2), label: 'MB' },
        { value: Math.pow(1024, 3), label: 'GB' },
        { value: Math.pow(1024, 4), label: 'TB' },
      ],
      unitOpts: [
        { value: 1, label: this.$t('storage.text_129') },
        { value: 10, label: this.$t('storage.text_130') },
        { value: 100, label: this.$t('storage.text_131') },
        { value: 1000, label: this.$t('storage.text_132') },
        { value: 10000, label: this.$t('storage.text_133') },
        { value: 100000000, label: this.$t('storage.text_333') },
      ],
      cloudregion: {},
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'scope', 'isAdminMode']),
    getFieldValue () {
      return this.form.fc.getFieldValue
    },
    decorators () {
      return {
        domain: [
          'domain',
          {
            rules: [
              { validator: isRequired(), message: i18n.t('rules.domain'), trigger: 'change' },
            ],
          },
        ],
        project: [
          'project',
          {
            rules: [
              { validator: isRequired(), message: i18n.t('rules.project'), trigger: 'change' },
            ],
          },
        ],
        name: [
          'name',
          {
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('storage.text_56') },
              {
                validator: (rule, value, _callback) => {
                  const isAzure = this.cloudregion.provider === 'Azure'
                  if (isAzure && (value && value.indexOf('-') > -1)) {
                    _callback(new Error(this.$t('storage.text_102')))
                  }
                  return this.$validate('bucketName')(rule, value, _callback)
                },
              },
            ],
          },
        ],
        description: ['description'],
        // cloudprovider: [
        //   'cloudprovider',
        //   {
        //     rules: [
        //       { required: true, message: this.$t('network.text_689') },
        //     ],
        //   },
        // ],
        reason: [
          'reason',
          {
            initialValue: '',
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('compute.text_1105') },
            ],
          },
        ],
        cloudproviderConfig: {
          cloudaccountConfig: {
            cloudaccount: [
              'cloudaccount',
              {
                rules: [
                  // { validator: isRequired(), message: i18n.t('storage.text_94'), trigger: 'change' },
                  { message: i18n.t('storage.text_94'), trigger: 'change' },
                ],
              },
            ],
          },
          cloudprovider_type: [
            'cloudprovider_type',
            {
              initialValue: 'new',
            },
          ],
          cloudprovider: [
            'cloudprovider',
            {
              rules: [
                { required: true, message: this.$t('network.text_689') },
              ],
            },
          ],
          cloudprovider_name: [
            'cloudprovider_name',
            {
              validateFirst: true,
              rules: [
                { required: true, message: this.$t('system.text_238') },
                {
                  validator: (rule, value, _callback) => {
                    return this.$validate('cloudproviderName')(rule, value, _callback)
                  },
                },
              ],
            },
          ],
        },
        versioned: [
          'versioned',
          {
            // valuePropName: 'checked',
            initialValue: false,
          },
        ],
        worm: [
          'worm',
          {
            // valuePropName: 'checked',
            initialValue: false,
          },
        ],
        size_bytes: [
          'size_bytes',
          {
            initialValue: 0,
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('storage.text_136') },
            ],
          },
        ],
        size_bytes_unit: ['size_bytes_unit', {
          initialValue: Math.pow(1024, 3),
        }],
        object_count: [
          'object_count',
          {
            initialValue: 0,
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('storage.text_137') },
            ],
          },
        ],
        object_count_unit: ['object_count_unit', {
          initialValue: 10000,
        }],
        tag: [
          'tag',
          {
            rules: [
              { validator: validateTag },
            ],
          },
        ],
      }
    },
    cloudregionParams () {
      const params = {
        scope: this.scope,
      }
      params.cloud_env = this.cloudEnv
      if (this.isAdminMode) {
        params.project_domain = this.project_domain
        delete params.scope
      }
      return params
    },
    cloudproviderParams () {
      const params = {
        limit: 0,
        enabled: 1,
        details: true,
        scope: this.scope,
        cloudregion: this.cloudregion.id,
      }
      if (this.isAdminMode) {
        params.admin = true
        params.project_domain = this.project_domain
        delete params.scope
        delete params.domain_id
      }
      return params
    },
    areaselectsName () {
      if (this.cloudEnv === 'onpremise') {
        return ['cloudregion']
      }
      return ['provider', 'cloudregion']
    },
    providerParams () {
      return {
        cloud_env: this.cloudEnv,
        scope: this.scope,
        projecct_domain: this.project_domain,
      }
    },
    confirmText () {
      return this.isOpenWorkflow ? this.$t('compute.text_288') : this.$t('common_258')
    },
    isOpenWorkflow () {
      return this.checkWorkflowEnabled(WORKFLOW_TYPES.APPLY_BUCKET)
    },
  },
  watch: {
    cloudEnv (newValue) {
      this.$refs.areaSelects.fetchs(this.areaselectsName)
    },
    project_domain () {
      this.$refs.areaSelects.fetchs(this.areaselectsName)
    },
  },
  provide () {
    return {
      form: this.form,
    }
  },
  methods: {
    handleWormChange (val) {
      this.worm = val
    },
    handleVersionedChange (val) {
      this.versioned = val
    },
    handleDomainChange (val) {
      this.project_domain = val.key
    },
    providerMapper (data) {
      if (this.cloudEnv === 'onpremise') data = data.filter(item => item.provider !== 'VMware')
      return data
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.form.fc.validateFields((err, values) => {
          if (err) return reject(err)
          // const { zone, cloudregion } = values
          const { zone, cloudregion, size_bytes, size_bytes_unit, object_count, object_count_unit } = values
          // console.log(values)
          /*
          cloudprovider: "36ee9c70-68cb-4d4b-8197-1012f57e42a7"
          cloudregion: "default"
          name: "it-webconsole-test21"
          object_cnt_limit: 20000
          object_count: "2"
          object_count_unit: 10000
          project:
            key: "0d46f56c15d34cdd8dd29e040d21bcd4"
            label: "system"
            [[Prototype]]: Object
          size_bytes: "2"
          size_bytes_limit: 2147483648
          size_bytes_unit: 1073741824
          tag: undefined
          versioned: true
          worm: false
          */

          if (zone) {
            values.zone = zone.key
          }
          if (cloudregion) {
            values.cloudregion = cloudregion
          }

          values.size_bytes_limit = parseInt(size_bytes) * parseInt(size_bytes_unit)
          values.object_cnt_limit = parseInt(object_count) * parseInt(object_count_unit)
          values.user_id = this.$store.getters.userInfo.id

          resolve(values)
        })
      })
    },
    handleCloudregionChange (data) {
      const hasCloudRegion = R.has('cloudregion')(data)
      if (!hasCloudRegion || R.isEmpty(data.cloudregion)) return
      const cloudregion = data.cloudregion.value
      const isAzure = cloudregion.provider === 'Azure'
      const name = this.form.fc.getFieldValue('name')
      this.cloudregion = cloudregion
      if (isAzure && (name && name.indexOf('-'))) {
        this.form.fc.setFields({
          name: {
            value: name,
            errors: [new Error(this.$t('storage.text_102'))],
          },
        })
      } else if (name) {
        this.form.fc.validateFields(['name'])
      }
    },
    doCreateWorkflow (values) {
      const { project, domain, tag, size_bytes, size_bytes_unit, object_count, object_count_unit, ...rest } = values
      let meta = {}
      if (tag) {
        meta = tag
      }
      const params = {
        ...rest,
        __meta__: meta,
        project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
        project_id: (project && project.key) || this.userInfo.projectId,
      }
      const variables = {
        project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
        project: (project && project.key) || this.userInfo.projectId,
        process_definition_key: WORKFLOW_TYPES.APPLY_BUCKET,
        initiator: this.$store.getters.userInfo.id,
        description: values.reason,
        paramter: JSON.stringify(params),
        // price: this.price,
      }
      // this._getProjectDomainInfo(variables)
      new this.$Manager('workflow_process_instances', 'v1')
        .create({ data: { variables } })
        .then(() => {
          this.$message.success(i18n.t('storage.bucket.apply.submit', [params.name]))
          this.$router.push('/workflow')
        })
        .catch((error) => {
          throw error
        })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.validateForm()
        if (this.isOpenWorkflow) {
          await this.doCreateWorkflow(values)
        } else {
          const { project, domain, tag, size_bytes, size_bytes_unit, object_count, object_count_unit, ...rest } = values
          // const { project, domain, tag, ...rest } = values
          let meta = {}
          if (tag) {
            meta = tag
          }
          await new this.$Manager('buckets').create({
            data: {
              ...rest,
              __meta__: meta,
              project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
              project_id: (project && project.key) || this.userInfo.projectId,
            },
          })
          this.loading = false
          this.$message.success(this.$t('storage.text_62'))
          this.$router.push('/bucket')
        }
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    cloudregionParamsMapper (params) {
      const p = { ...params }
      delete p.usable
      return p
    },
    handelBlur ({ target }) {
      const { value, name } = target
      if (!/^\d+$/.test(value)) {
        this.form.fc.setFieldsValue({
          [name]: 0,
        })
      }
    },
  },
}
</script>

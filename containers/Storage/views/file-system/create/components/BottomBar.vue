<template>
  <page-footer>
    <template v-slot:right>
<!--      <price-fetcher :values="values" :cloudAccountId="cloudAccountId" />-->
      <div class="btns-wrapper d-flex align-items-center">
        <a-button
          class="ml-3"
          type="primary"
          native-type="submit"
          html-type="submit"
          @click="handleConfirm"
          :loading="loading">{{ confirmText }}</a-button>
      </div>
    </template>
  </page-footer>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'
// import PriceFetcher from '@/components/PriceFetcher'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import workflowMixin from '@/mixins/workflow'
import i18n from '@/locales'

export default {
  name: 'BottomBar',
  // components: {
  //   PriceFetcher,
  // },
  inject: ['form'],
  mixins: [workflowMixin],
  props: {
    values: {
      type: Object,
    },
    cloudAccountId: String,
    isRepeated: Boolean,
  },
  data () {
    const cloudEnvOptions = getCloudEnvOptions('nas_brands', true)
    return {
      cloudEnvOptions,
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    confirmText () {
      return this.isOpenWorkflow ? this.$t('compute.text_288') : this.$t('common_258')
    },
    isOpenWorkflow () {
      return this.checkWorkflowEnabled(WORKFLOW_TYPES.APPLY_FILESYSTEM)
    },
  },
  methods: {
    doCreate (data) {
      return new this.$Manager('file_systems').create({ data })
    },
    doForecast () {
      return new Promise((resolve, reject) => {
        if (this.isRepeated) {
          const err = new Error(this.$t('storage.xgfs.nfs.name.repeated'))
          reject(err)
        } else {
          resolve()
        }
      })
    },
    doCreateWorkflow (params) {
      // const { project, domain, tag, ...rest } = values
      // let meta = {}
      // if (tag) {
      //   meta = tag
      // }
      // const params = {
      //   ...rest,
      //   __meta__: meta,
      //   project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
      //   project_id: (project && project.key) || this.userInfo.projectId,
      // }
      const variables = {
        project_domain: params.project_domain,
        project: params.project_id,
        process_definition_key: WORKFLOW_TYPES.APPLY_FILESYSTEM,
        initiator: this.$store.getters.userInfo.id,
        description: params.reason,
        paramter: JSON.stringify(params),
        // price: this.price,
      }
      // this._getProjectDomainInfo(variables)
      new this.$Manager('workflow_process_instances', 'v1')
        .create({ data: { variables } })
        .then(() => {
          this.$message.success(i18n.t('storage.xgfs.nfs.apply.submit', [params.name]))
          this.$router.push('/workflow')
        })
        .catch((error) => {
          throw error
        })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        console.log(values)
        const params = {
          billing_type: values.billing_type,
          name: values.name,
          description: values.description,
          reason: values.reason,
          network_id: values.network,
          zone_id: values.zone_id,
          project_domain: values.project_domain || this.userInfo.projectDomainId,
          // project_domain: (domain && domain.key) || this.userInfo.projectDomainId,
          // project_id: (project && project.key) || this.userInfo.projectId,
          project_id: (values.project && values.project.key) || this.userInfo.projectId,
          user_id: this.userInfo.id,
        }
        if (values.tag) {
          params.__meta__ = values.tag
        }
        params.cloud_env = this.cloudEnvOptions[0].key
        if (values.sku) {
          params.file_system_type = values.sku.file_system_type
          params.protocol = values.sku.protocol
          params.storage_type = values.sku.storage_type
          params.manager_id = values.sku.external_id
        }
        if (values.capacity > 0) {
          params.capacity = values.capacity
        }
        if (values.billing_type === 'postpaid') {
          if (values.durationStandard !== 'none') {
            params.duration = values.durationStandard
            if (values.durationStandard === 'custom') {
              params.duration = values.duration
            }
          }
          if (values.auto_renew) {
            params.auto_renew = values.auto_renew
          }
        } else {
          params.duration = values.duration
        }
        if (this.isOpenWorkflow) {
          await this.doForecast()
            .then(() => {
              this.doCreateWorkflow(params)
            })
          // await this.doCreateWorkflow(params)
        } else {
          await this.doCreate(params)
          this.loading = false
          this.$message.success(this.$t('network.nat.create.success'))
          this.$router.push('/nas')
        }
      } catch (error) {
        this.loading = false
        throw error
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../../../../../src/styles/less/theme';

.prices {
  .hour {
    color: @error-color;
    font-size: 24px;
  }
  .tips {
    color: #999;
    font-size: 12px;
  }
}
</style>

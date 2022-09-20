<template>
  <div>
    <page-header :title="headerTitle" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv" />
    <page-body>
      <component :is="component" :type="type" ref="formRef" />
    </page-body>
    <page-footer>
      <template v-slot:right>
<!--        <a-button type="primary" class="mr-2" @click="submit" :loading="loading">{{ $t('common.create') }}</a-button>-->
        <a-button type="primary" class="mr-2" @click="handleConfirm" :loading="loading">{{ confirmText }}</a-button>
        <a-button @click="cancel">{{$t('network.text_31')}}</a-button>
      </template>
    </page-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IDC from './form/IDC'
import Public from './form/Public'
import Private from './form/Private'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import workflowMixin from '@/mixins/workflow'

export default {
  name: 'LbCreate',
  components: {
    IDC,
    Public,
    Private,
  },
  mixins: [workflowMixin],
  data () {
    const cloudEnvOptions = getCloudEnvOptions('compute_engine_brands', true)
    const queryType = this.$route.query.type
    let cloudEnv = queryType === 'idc' ? 'onpremise' : this.$route.query.type
    let routerQuery = this.$route.query.type
    if (!cloudEnvOptions.find(val => val.key === cloudEnv)) {
      cloudEnv = cloudEnvOptions[0].key
      routerQuery = cloudEnv === 'onpremise' ? 'idc' : cloudEnv
    }
    return {
      loading: false,
      cloudEnvOptions,
      cloudEnv,
      routerQuery,
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'scope', 'isAdminMode']),
    type () {
      const { type = 'idc' } = this.$route.query
      switch (type) {
        case 'private':
          return 'private'
        case 'public':
          return 'public'
        default:
          return 'idc'
      }
    },
    component () {
      const { type = 'idc' } = this.$route.query
      switch (type) {
        case 'private':
          return 'Private'
        case 'public':
          return 'Public'
        default:
          return 'IDC'
      }
    },
    headerTitle () {
      const res = this.$t('network.text_137')
      return this.$t('compute.text_1161', [res])
    },
    confirmText () {
      return this.isOpenWorkflow ? this.$t('compute.text_288') : this.$t('common.create')
    },
    isOpenWorkflow () {
      return this.checkWorkflowEnabled(WORKFLOW_TYPES.APPLY_LOADBALANCER)
    },
  },
  watch: {
    cloudEnv (val) {
      this.$nextTick(() => {
        const query = this.getQuery(this.$router.history.current.query)
        const path = this.$router.history.current.path
        const newQuery = JSON.parse(JSON.stringify(query))
        newQuery.type = val === 'onpremise' ? 'idc' : val
        this.$router.push({ path, query: newQuery })
      })
    },
  },
  created () {
    if (this.routerQuery !== this.$route.query.type) {
      this.$router.push({
        path: this.$router.history.current.path,
        query: {
          type: this.routerQuery,
        },
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.popstate)
  },
  methods: {
    getQuery (query) {
      if (query.sence === 'image') {
        return { type: query.type }
      }
      return query
    },
    doCreateWorkflow (values) {
      const variables = {
        project_domain: values.domain || this.userInfo.projectDomainId,
        project: values.project || this.userInfo.projectId,
        process_definition_key: WORKFLOW_TYPES.APPLY_LOADBALANCER,
        initiator: this.$store.getters.userInfo.id,
        description: values.reason,
        // description: this.form.fd.reason,
        paramter: JSON.stringify(values),
        // price: this.price,
      }
      // this._getProjectDomainInfo(variables)
      new this.$Manager('workflow_process_instances', 'v1')
        .create({ data: { variables } })
        .then(() => {
          this.$message.success(this.$t('loadbalancer.apply.submit', [values.name]))
          this.$router.push('/workflow')
        })
        .catch((error) => {
          throw error
        })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const data = await this.$refs.formRef.submit()
        if (this.isOpenWorkflow) {
          await this.doCreateWorkflow(data)
        } else {
          await new this.$Manager('loadbalancers').create({ data })
          this.loading = false
          this.$message.success(this.$t('network.text_290'))
          this.cancel()
        }
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    async submit () {
      this.loading = true
      try {
        const data = await this.$refs.formRef.submit()
        await new this.$Manager('loadbalancers').create({ data })
        this.loading = false
        this.$message.success(this.$t('network.text_290'))
        this.cancel()
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    // _getProjectDomainInfo (variables) {
    //   variables.project = this.form.fd.project.key
    //   if (!variables.project) {
    //     variables.project = this.$store.getters.userInfo.projectName
    //   }
    //   variables.project_domain = _.get(this.form.fd, 'domain.label')
    //   if (!variables.project_domain) {
    //     variables.project_domain = this.$store.getters.userInfo.projectDomain
    //   }
    // },
    cancel () {
      this.$router.push('/lb')
    },
  },
}
</script>

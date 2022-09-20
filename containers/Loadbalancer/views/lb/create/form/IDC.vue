<template>
  <a-form :form="form.fc"  class="mt-3" v-bind="formItemLayout">
    <a-form-item :label="$t('network.text_205', [$t('dictionary.project')])" class="mb-0">
      <domain-project :fc="form.fc" :decorators="decorators" :domain.sync="domain" :project.sync="project" :labelInValue="false" />
    </a-form-item>
    <a-form-item :label="$t('network.text_199')" class="mb-0">
      <cloudregion-zone :decorator="decorators" :cloudregionParams="cloudregionParams" :zoneParams="zoneParams" :zone.sync="zoneObj" />
    </a-form-item>
    <a-form-item :label="$t('network.text_21')">
      <a-input v-decorator="decorators.name" :placeholder="$t('validator.resourceName')" />
    </a-form-item>
    <a-form-item :label="$t('compute.text_1041')" v-if="isOpenWorkflow">
      <a-input v-decorator="decorators.reason" :placeholder="$t('loadbalancer.apply.reason')" />
    </a-form-item>
    <a-form-item :label="$t('compute.text_176')">
      <a-radio-group :defaultValue="hypervisorOpts[0].key">
        <a-radio-button v-for="item in hypervisorOpts" :value="item.key" :key="item.key">{{ item.label }}</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="$t('network.text_19')">
      <a-radio-group :defaultValue="clusterType[0].key">
        <a-radio-button v-for="item in clusterType" :value="item.key" :key="item.key">{{ item.label }}</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="$t('network.text_16')">
      <a-radio-group :defaultValue="networkType[0].key">
        <a-radio-button v-for="item in networkType" :value="item.key" :key="item.key">{{ item.label }}</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item :label="$t('table.title.tag')">
      <tag v-decorator="decorators.__meta__" />
    </a-form-item>
  </a-form>
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import lbCreate from './mixin'
import CloudregionZone from '@/sections/CloudregionZone'
import { HYPERVISORS_MAP } from '@/constants'
import { Manager } from '@/utils/manager'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import workflowMixin from '@/mixins/workflow'
// import _ from 'lodash'

export default {
  name: 'LbOnecloudCreate',
  components: {
    CloudregionZone,
  },
  mixins: [lbCreate, workflowMixin],
  provide () {
    return {
      form: this.form,
    }
  },
  data () {
    return {
      zoneObj: {},
      hadVpc: false,
      cluster_id: '',
      clusters: [],
      network_id: '',
      networks: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'isAdminMode']),
    clusterParams () {
      let params = {}
      if (this.zoneObj && this.zoneObj.id && !R.isEmpty(this.scopeParams)) {
        params.zone = this.zoneObj.id
        params.limit = 0
        params = Object.assign(params, this.scopeParams)
      }
      return params
    },
    networkParams () {
      let params = {
        vpc_id: 'default',
        usable: true,
      }
      if (this.zoneObj && this.zoneObj.id && !R.isEmpty(this.scopeParams)) {
        params.zone = this.zoneObj.id
        params.limit = 0
        params = Object.assign(params, this.scopeParams)
      }
      return params
    },
    cloudregionParams () { // 覆盖 mixin
      return {
        scope: this.$store.getters.scope,
        usable: true,
        is_on_premise: true,
      }
    },
    // 当前只支持oneCloud
    hypervisorOpts () {
      return [HYPERVISORS_MAP.kvm]
    },
    clusterType () {
      return [
        {
          key: 'share',
          label: this.$t('loadbalancer.cluster.type.share'),
        },
      ]
    },
    networkType () {
      return [
        {
          key: 'specify',
          label: this.$t('loadbalancer.network.type.specify'),
        },
      ]
    },
    isOpenWorkflow () {
      return this.checkWorkflowEnabled(WORKFLOW_TYPES.APPLY_LOADBALANCER)
    },
  },
  mounted () {
    this.am = new Manager('loadbalancerclusters')
    this.bm = new Manager('networks')
    // this.fetchLoadbalancerclusters()
  },
  methods: {
    async fetchLoadbalancerclusters () {
      try {
        let params = {
          zone: this.zoneObj.id,
          limit: 0,
          // scope: this.scope,
        }
        params = Object.assign(params, this.scopeParams)

        const response = await this.am.list({ params })
        const data = response.data.data
        this.clusters = data.map(val => ({ ...val, key: val.id, label: val.name })) || []
        const defaultData = this.clusters[0]
        // const initialValue = _.get(this.decorators, 'cloudaccount[1].initialValue')
        // if (initialValue) {
        //   const findInitValue = this.accounts.find(val => val.key === (initialValue.key || initialValue))
        //   if (findInitValue) {
        //     defaultData = { key: findInitValue.key, label: findInitValue.label }
        //   }
        // }
        // this.accountChange(defaultData || {})
        // this._setInitAccount(defaultData || {})
        this.cluster_id = defaultData.key
      } catch (error) {
        throw error
      }
    },
    async fetchLoadbalancerNetworks () {
      try {
        let params = {
          zone: this.zoneObj.id,
          limit: 0,
          vpc_id: 'default',
          usable: true,
          // scope: this.scope,
        }
        params = Object.assign(params, this.scopeParams)

        const response = await this.bm.list({ params })
        const data = response.data.data
        // this.networks = data.map(val => ({ ...val, key: val.id, label: val.name })) || []
        this.networks = data.filter(item => {
          return !!(item.is_auto_alloc && item.ports > item.ports_used && (item.metadata && item.metadata['user:loadbalancer'] && item.metadata['user:loadbalancer'] === 'true'))
        })
        const num = this.networks.length
        let rand = 0
        if (num > 0) {
          rand = Math.round(Math.random() * (num - 1))
        } else {
          return
        }
        console.log(num, rand)
        const defaultData = this.networks[rand]
        this.network_id = defaultData.id
      } catch (error) {
        throw error
      }
    },
    async submit () {
      try {
        const values = await this.form.fc.validateFields()
        await this.fetchLoadbalancerclusters()
        if (this.cluster_id === '') {
          throw new Error('Cluster does not exist.')
        }
        await this.fetchLoadbalancerNetworks()
        if (this.network_id === '') {
          throw new Error('Network does not exist.')
        }
        const data = {
          // cluster_id: values.cluster_id,
          cluster_id: this.cluster_id,
          name: values.name.trim(),
          // network: values.network,
          network: this.network_id,
          domain: values.domain,
          project_id: values.project,
          reason: values.reason,
          // user_id: this.$store.getters.userInfo.id,
          user_id: this.userInfo.id,
          __meta__: values.__meta__,
        }
        return data
      } catch (error) {
        throw error
      }
    },
  },
}
</script>

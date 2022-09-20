<template>
  <div>
<!--  <div class="server-password">-->
    <a-form-item class="mb-0">
      <a-radio-group :disabled="disabled" v-decorator="decorators.cloudprovider_type" @change="cloudproviderTypeChange">
        <a-radio-button v-for="item of cloudproviderTypeMap" :value="item.key" :key="item.key">
          {{ item.label }}
<!--          <help-tooltip v-if="['image', 'keypair'].includes(item.key)" :name="`${item.key}Password`" class="ml-2" />-->
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="(cloudproviderTypeMap && cloudproviderTypeMap.new) && providerType === cloudproviderTypeMap.new.key" class="mb-0">
      <a-row class="w-50">
        <a-col :span="12">
          <a-input
            class="w-100"
            v-decorator="decorators.cloudprovider_name"
            :placeholder="$t('system.text_238')" />
        </a-col>
        <a-col :span="12">
          <cloud-account class="w-100" :fc="form.fc" :decorators="decorators.cloudaccountConfig" />
        </a-col>
      </a-row>
      <span slot="extra">{{$t('storage.bucket.owner.new.tooltip')}}</span>
    </a-form-item>
    <a-form-item v-if="(cloudproviderTypeMap && cloudproviderTypeMap.specify) && providerType === cloudproviderTypeMap.specify.key" class="mb-0">
      <base-select
        class="w-50"
        v-decorator="decorators.cloudprovider"
        resource="cloudproviders"
        :params="cloudproviderParams"
        :mapper="providerMapper"
        :isDefaultSelect="true"
        :showSync="true"
        :select-props="{ placeholder: $t('compute.text_149') }" />
    </a-form-item>
  </div>
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import { CLOUDPROVIDER_TYPES_MAP } from '@Storage/constants'
import CloudAccount from '@Storage/sections/CloudAccount'

export default {
  name: 'Cloudprovider',
  components: {
    CloudAccount,
  },
  props: {
    decorator: {
      type: Object,
      required: true,
      // validator: val => R.is(Array, val.loginType) && R.is(Array, val.keypair) && R.is(Array, val.password),
    },
    form: {
      type: Object,
    },
  },
  data () {
    return {
      providerType: 'new',
      disabled: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'scope', 'isAdminMode']),
    cloudproviderTypeMap () {
      return CLOUDPROVIDER_TYPES_MAP
    },
    decorators () {
      return {
        ...this.decorator,
      }
    },
    cloudproviderParams () {
      const params = {
        limit: 0,
        // enabled: 1,
        usable: 1,
        details: true,
        scope: this.scope,
        // cloudregion: this.cloudregion.id,
      }
      if (this.isAdminMode) {
        params.admin = true
        params.project_domain = this.project_domain
        delete params.scope
        delete params.domain_id
      }
      return params
    },
  },
  watch: {
    cloudproviderTypeMap (val, oldv) {
      if (!R.equals(val, oldv)) {
        this.setCloudproviderType()
      }
    },
  },
  mounted () {
    this.setCloudproviderType()
  },
  methods: {
    providerMapper (data) {
      if (this.cloudEnv === 'onpremise') data = data.filter(item => item.provider !== 'VMware')
      return data
    },
    cloudproviderTypeChange (e) {
      this.providerType = e.target.value
    },
    setCloudproviderType () {
      if (this.cloudproviderTypeMap && !R.isEmpty(this.cloudproviderTypeMap)) {
        const cloudproviderTypeInitailValue = this.decorator.cloudprovider_type[1].initialValue
        const providerType = cloudproviderTypeInitailValue
        if (this.form && this.form.fc) {
          this.form.fc.setFieldsValue({
            [this.decorators.cloudprovider_type[0]]: providerType,
          })
        }
        this.providerType = providerType
      }
    },
  },
}
</script>

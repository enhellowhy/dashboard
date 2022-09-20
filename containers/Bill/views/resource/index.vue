<template>
  <div>
    <page-header :title="$t('bill.text_171')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv">
<!--      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>-->
    </page-header>
    <page-body>
      <resource-list :id="listId" :cloud-env="cloudEnv" />
    </page-body>
  </div>
</template>

<script>
import ResourceList from './components/List'
import currencyMixin from '@Bill/mixins/currency'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'

export default {
  name: 'ResourceIndex',
  components: {
    ResourceList,
  },
  mixins: [currencyMixin],
  data () {
    return {
      listId: 'BillAssociateList',
      cloudEnvOptions: getCloudEnvOptions('brands'),
      cloudEnv: '',
    }
  },
}
</script>

<template>
  <div>
    <page-header :title="$t('bill.text_126')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv">
<!--      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>-->
    </page-header>
    <page-body>
      <associate-list :id="listId" :cloud-env="cloudEnv" />
    </page-body>
  </div>
</template>

<script>
import AssociateList from './components/List'
import currencyMixin from '@Bill/mixins/currency'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'

export default {
  name: 'AssociateIndex',
  components: {
    AssociateList,
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

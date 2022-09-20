<template>
  <div>
    <page-header :title="$t('bill.text_135')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv">
<!--      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>-->
    </page-header>
    <page-body>
      <bill-detail-list :id="listId" :cloud-env="cloudEnv" />
    </page-body>
  </div>
</template>

<script>
import BillDetailList from './components/List'
import currencyMixin from '@Bill/mixins/currency'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'

export default {
  name: 'BillDetailIndex',
  components: {
    BillDetailList,
  },
  mixins: [currencyMixin],
  data () {
    return {
      listId: 'BillDetailList',
      cloudEnvOptions: getCloudEnvOptions('brands'),
      cloudEnv: '',
    }
  },
}
</script>

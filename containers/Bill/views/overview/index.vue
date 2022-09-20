<template>
  <div>
    <page-header :title="$t('bill.text_36')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv">
<!--      <template v-slot:title><currency class="position-absolute" style="right: 0;" /></template>-->
    </page-header>
    <page-body>
      <overview-index :cloud-env="cloudEnv" />
    </page-body>
  </div>
</template>

<script>
import OverviewIndex from './components/index'
import currencyMixin from '@Bill/mixins/currency'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'

export default {
  name: 'BillOverview',
  components: {
    OverviewIndex,
  },
  mixins: [currencyMixin],
  data () {
    return {
      cloudEnvOptions: getCloudEnvOptions('brands'),
      cloudEnv: '',
    }
  },
}
</script>

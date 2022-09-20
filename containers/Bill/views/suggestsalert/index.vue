<template>
  <div>
    <page-header :title="$t('bill.text_181')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv" />
    <page-body>
      <suggest-alert-list :id="listId" :cloud-env="cloudEnv" />
    </page-body>
  </div>
</template>

<script>
import SuggestAlertList from './components/List'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'

export default {
  name: 'SuggestAlertIndex',
  components: {
    SuggestAlertList,
  },
  data () {
    return {
      listId: 'SuggestAlertList',
      cloudEnvOptions: getCloudEnvOptions('compute_engine_brands'),
      cloudEnv: '',
    }
  },
}
</script>

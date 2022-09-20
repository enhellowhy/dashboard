<template>
  <a-form :form="form.fc" class="mt-3" v-bind="formItemLayout">
<!--    <a-form-item :label="$t('network.text_139')">-->
<!--      <base-select-->
<!--        isDefaultSelect-->
<!--        ref="backendgroupsRef"-->
<!--        showSync-->
<!--        v-decorator="decorators.backend_group"-->
<!--        resource="loadbalancerbackendgroups"-->
<!--        :params="backendgroupParams"-->
<!--        :item.sync="backendgroup"-->
<!--        @change="fetchBackendList"-->
<!--        :select-props="{ placeholder: $t('network.text_394') }" />-->
<!--        <div slot="extra">{{$t('network.text_395')}}<a @click="openBackendgroupsCreate">{{$t('network.text_26')}}</a></div>-->
<!--    </a-form-item>-->
<!--    <div class="m-3">{{$t('loadbalancer.text_15')}}</div>-->
<!--    <a-form-item>-->
<!--      <vxe-grid size="mini" border :columns="backendColumns" :data="backendList" />-->
<!--    </a-form-item>-->
    <div>
      <a-button class="mb-2" type="primary" @click="openBackendCreate">{{ buttonText }}</a-button>
    </div>
    <a-form-item>
      <vxe-grid size="mini" border :columns="backendColumns" :data="backendList" />
    </a-form-item>
  </a-form>
</template>

<script>
import mixin from '../mixins/formStepItem'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'

export default {
  name: 'LBListenerCreateBackendgroup',
  mixins: [mixin, WindowsMixin, ListMixin],
  computed: {
    buttonText () {
      if (this.backendList.length === 0) {
        return this.$t('loadbalancer.text_13')
      } else {
        return this.$t('loadbalancer.text_14')
      }
    },
  },
  created () {
    this.fetchBackendList(this.groupData.id)
  },
}
</script>

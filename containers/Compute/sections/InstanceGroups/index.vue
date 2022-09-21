<template>
  <div>
    <a-form-item class="mb-0">
      <a-switch :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" v-decorator="decorators.groupsEnable" @change="change" />
    </a-form-item>
    <a-form-item class="mb-0">
      <a-radio-group v-if="showGroups" v-decorator="decorators.groupType" @change="changeGroup">
        <a-radio-button v-for="item of groupTypeMap" :value="item.key" :key="item.key">
          {{ item.label }}
          <!--          <help-tooltip v-if="['image', 'keypair'].includes(item.key)" :name="`${item.key}Password`" class="ml-2" />-->
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="(showGroups && groupType === groupTypeMap.new.key)">
      <a-input class="w-50" v-decorator="decorators.groupName" :placeholder="$t('validator.resourceName')" />
    </a-form-item>
    <a-form-item v-if="(showGroups && groupType === groupTypeMap.specify.key)">
      <base-select
        class="w-50"
        v-decorator="decorators.groups"
        :select-props="{ placeholder: $t('compute.text_148', [$t('dictionary.instancegroup')]), mode: 'multiple' }"
        resource="instancegroups"
        :params="params"
        :need-params="true" />
    </a-form-item>
  </div>
</template>

<script>
import * as R from 'ramda'
import { GROUPS_TYPES_MAP } from '@Compute/constants'

export default {
  name: 'InstanceGroups',
  props: {
    decorators: {
      type: Object,
      required: true,
      validator: val => !R.isNil(val.groupsEnable) && !R.isNil(val.groups) && !R.isNil(val.groupName),
    },
    params: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      groupType: 'new',
      showGroups: this.decorators.groupsEnable[1].initialValue,
    }
  },
  computed: {
    groupTypeMap () {
      return GROUPS_TYPES_MAP
    },
  },
  methods: {
    change (val) {
      this.showGroups = val
      if (!val) {
        this.groupType = 'new'
      }
    },
    changeGroup (e) {
      this.groupType = e.target.value
    },
  },
}
</script>

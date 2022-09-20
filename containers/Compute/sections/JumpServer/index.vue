<template>
  <div>
    <a-form-item class="mb-0">
      <a-switch :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" v-decorator="decorator.jumpserverEnable" @change="change" :disabled="switchDisabled" />
    </a-form-item>
    <a-form-item class="mt-2" v-if="jumpserverEnable">
<!--    <a-form-item class="mt-2" v-if="jumpserverEnable && !isProjectMode">-->
      <base-select
        v-decorator="decorator.jumpserver"
        :options="nodeList"
        nameKey="full_value"
        :selectProps="{ placeholder: $t('compute.jumpserver') }" />
<!--        :disabled-items="disabledItems" />-->
    </a-form-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as R from 'ramda'

export default {
  name: 'JumpServer',
  props: {
    decorator: {
      type: Object,
      required: true,
      validator: val => R.is(Array, val.jumpserverEnable) && R.is(Array, val.jumpserver),
    },
    disabledItems: {
      type: Array,
      default: () => [],
    },
    diskType: { // 系统盘磁盘类型
      type: String,
    },
    domain: Object,
    availableNodeCount: Number, // 可用的节点数量
    nodeParams: {
      type: Object,
    },
  },
  data () {
    return {
      nodeList: [],
      jumpserverEnable: this.decorator.jumpserverEnable[1].initialValue,
    }
  },
  computed: {
    ...mapGetters(['isProjectMode']),
    switchDisabled () {
      // if (this.diskType === 'gpfs') return true
      // if (this.availableHostCount < 2) return true
      return false
    },
  },
  created () {
    this.fetchJumpServerNodes()
  },
  methods: {
    change (val) {
      this.jumpserverEnable = val
      if (val) this.fetchJumpServerNodes()
    },
    async fetchJumpServerNodes () {
      // if (!R.is(Object, this.nodeParams) || this.isProjectMode) return
      if (!R.is(Object, this.nodeParams)) return
      try {
        const { data: { data = [] } } = await new this.$Manager('jsassets', 'v1').list({ params: this.nodeParams })
        this.nodeList = data
      } catch (error) {
        throw error
      }
    },
  },
}
</script>

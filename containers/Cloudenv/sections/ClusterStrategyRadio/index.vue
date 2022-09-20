<template>
  <a-form-item class="mb-0">
    <a-radio-group v-decorator="decorator" @change="change">
      <a-radio-button
        v-for="item in opts"
        :value="item.key"
        :key="item.key">{{ item.label }}</a-radio-button>
    </a-radio-group>
    <div class="mt-2" slot="extra" v-if="isUsage">{{$t('cloudenv.clusters.drs.strategy.usage.tooltip')}}</div>
    <div class="mt-2" slot="extra" v-else>{{$t('cloudenv.clusters.drs.strategy.assigned.tooltip')}}</div>
  </a-form-item>
</template>

<script>
// description：策略设置组件
import { CLUSTER_STRATEGY_OPT } from '@Cloudenv/constants/sched'

export default {
  name: 'ClusterSrategyRadio',
  props: {
    decorator: {
      type: Array,
      required: true,
    },
    isNone: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      stragegy: '',
    }
  },
  computed: {
    opts () {
      const _opts = [...CLUSTER_STRATEGY_OPT]
      if (!this.isNone) {
        return _opts.filter(opt => opt.key)
      }
      return _opts
    },
    isUsage () {
      return this.stragegy === 'usage'
    },
  },
  mounted () {
    this.setStrategy()
  },
  methods: {
    change (e) {
      this.stragegy = e.target.value
    },
    setStrategy () {
      this.stragegy = this.decorator[1].initialValue
    },
  },
}
</script>

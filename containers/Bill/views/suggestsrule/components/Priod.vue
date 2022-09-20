<template>
  <div>
    <a-form-item
      :label="$t('bill.text_198')"
      v-bind="formItemLayout">
      <duration-input v-decorator="decorators.time" :durationOptions="timeOptions" />
    </a-form-item>
    <a-form-item
      :label="$t('bill.text_189')"
      v-bind="formItemLayout"
      :help="$t('bill.text_190')">
      <duration-input v-decorator="decorators.priod" :durationOptions="durationOptions" />
    </a-form-item>
  </div>
</template>

<script>
export default {
  name: 'Priod',
  props: {
    decorators: {
      type: Object,
    },
    timeOptions: {
      type: Array,
    },
    durationOptions: {
      type: Array,
    },
    formItemLayout: {
      type: Object,
    },
  },
}
</script>

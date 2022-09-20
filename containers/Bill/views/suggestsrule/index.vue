<template>
  <div>
    <page-header :title="$t('bill.text_174')" />
    <page-body>
      <suggests-rule-list :id="listId" />
    </page-body>
  </div>
</template>

<script>
import SuggestsRuleList from './components/List'

export default {
  name: 'SuggestsRuleIndex',
  components: {
    SuggestsRuleList,
  },
  data () {
    return {
      listId: 'SuggestsRuleList',
    }
  },
}
</script>

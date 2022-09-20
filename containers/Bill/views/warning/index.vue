<template>
  <div>
    <page-header :title="$t('bill.text_248')" />
    <page-body>
      <list :id="listId" />
    </page-body>
  </div>
</template>

<script>
import List from './components/List'

export default {
  name: 'BillWarningIndex',
  components: {
    List,
  },
  data () {
    return {
      listId: 'BillWarningIndex',
    }
  },
}
</script>

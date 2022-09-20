<template>
  <div>
   <page-header :title="$t('system.text_13')" />
   <page-body>
     <list :id="listId" />
   </page-body>
  </div>
</template>

<script>
import List from './components/List'

export default {
  name: 'WorkflowConfigIndex',
  components: {
    List,
  },
  data () {
    return {
      listId: 'WorkflowConfigList',
    }
  },
}
</script>

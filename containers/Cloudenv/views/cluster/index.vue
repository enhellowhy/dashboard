<template>
  <div>
    <page-header :title="$t('cloudenv.clusters.hosts.text_0')" />
    <page-body>
      <cluster-list :id="listId" />
    </page-body>
  </div>
</template>

<script>
import ClusterList from './components/List'

export default {
  name: 'Cluster',
  components: {
    ClusterList,
  },
  data () {
    return {
      listId: 'ClusterList',
    }
  },
}
</script>

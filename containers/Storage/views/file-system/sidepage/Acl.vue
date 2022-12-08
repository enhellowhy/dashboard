<template>
  <div>
<!--    <mount-target-acl-list :type="getParams.type" :id="getParams.id" :isRead="isRead" />-->
    <mount-target-acl-list :getParams="getParams" :id="resId" :isRead="isRead" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MountTargetAclList from '../components/MountTargetAcl'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'MountTargetAcl',
  components: {
    MountTargetAclList,
  },
  mixins: [WindowsMixin],
  props: {
    getParams: {
      type: Object,
      required: true,
    },
    resId: String,
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['isAdminMode', 'isDomainMode', 'isProjectMode', 'userInfo']),
    isRead () {
      return false
      // return !this.isPower
    },
    isPower (obj) {
      if (!obj.domain_id && obj.data.domain_id) {
        obj = obj.data
      }
      if (this.isAdminMode) return true
      if (this.isDomainMode) return obj.domain_id === this.userInfo.projectDomainId
      return false
    },
  },
}
</script>

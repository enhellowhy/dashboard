<template>
  <div>
<!--  <div class="navbar-item">-->
    <a-dropdown :trigger="['click']">
      <div class="navbar-item-trigger d-flex align-items-center justify-content-center">
        <a-avatar :src="avatar" />
      </div>
      <a-menu slot="overlay" @click="userMenuClick">
        <a-menu-item key="toUser"><a-icon class="mr-2 ml-2" type="user" />{{ $t('scope.text_2') }}</a-menu-item>
        <a-menu-item>
          <a-popover placement="left">
            <template slot="content">
              <setting-popover />
            </template>
            <a-menu-item key="2"><a-icon class="mr-2 ml-2" type="skin" />{{ $t('common_629') }}</a-menu-item>
          </a-popover>
        </a-menu-item>
        <a-sub-menu key="language">
          <span slot="title"><a-icon class="mr-2 ml-2" type="global" /><span>{{$t('common_630')}}</span></span>
          <a-menu-item key="3" @click="settingLanguageCH">
            <span class="mr-2" style="cursor: pointer">简体中文</span><a-icon v-show="language === 'zh-CN'" type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          </a-menu-item>
          <a-menu-item key="4" @click="settingLanguageEN">
            <span class="mr-2" style="cursor: pointer">English</span><a-icon v-show="language === 'en'" type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="toClouduser"><a-icon class="mr-2 ml-2" type="cloud-upload" />{{ $t('scope.cloudid') }}</a-menu-item>
        <a-menu-item key="handleUpdatePassword"><a-icon class="mr-2 ml-2" type="usergroup-delete" />{{ $t('scope.text_5') }}</a-menu-item>
        <a-menu-item key="logout"><a-icon class="mr-2 ml-2" type="logout" />{{ $t('scope.text_6') }}</a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setLanguage } from '@/utils/common/cookie'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'UserPopover',
  mixins: [WindowsMixin],
  computed: {
    ...mapGetters(['isAdminMode', 'userInfo', 'scope', 'logo', 'permission', 'scopeResource', 'setting', 'loginLogo']),
    language () {
      return this.setting.language
    },
    avatar () {
      return this.userInfo.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
  },
  methods: {
    async userMenuClick (item) {
      if (item.key === 'logout') {
        try {
          await this.$store.dispatch('auth/logout')
          this.$router.push('/auth/login')
        } catch (error) {
          throw error
        }
      } else if (item.key === 'handleUpdatePassword') {
        this.createDialog('UpdateUserPasswordDialog')
      } else if (item.key === 'toUser') {
        this.$router.push('/user')
      } else if (item.key === 'toClouduser') {
        this.$router.push('/clouduser')
      }
    },
    settingLanguageCH () {
      setLanguage('zh-CN')
      window.location.reload()
    },
    settingLanguageEN () {
      setLanguage('en')
      window.location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
.trigger {
  height: 100%;
  // padding: 0 20px;
  cursor: pointer;
  text-decoration: none;
}
.navbar-item {
  height: 100%;
  border-left: 1px solid #f5f5f5;
}
.navbar-item-icon {
  width: 40px;
  height: 40px;
  margin-left: 5px;
  margin-right: 5px;
}
.navbar-item-trigger {
  height: 100%;
  padding: 0 20px;
  cursor: pointer;
  text-decoration: none;
}
</style>

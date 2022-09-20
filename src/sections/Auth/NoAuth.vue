<template>
  <div class="wrap shadow-lg bg-white rounded">
    <a-card>
      <div class="wrap-inner">
        <h5 class="auth-base-title text-center">{{ $t('auth.noauth.title') }}</h5>
        <div class="verify-tip">{{ $t('auth.noauth.relogin.prefix') }}<a class="relogin-btn" @click="relogin">{{ $t('auth.noauth.relogin') }}</a></div>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'NoAuth',
  data () {
    return {
      securityCode: '',
      error: false,
      loading: false,
    }
  },
  watch: {
    securityCode (val) {
      if (val.length < 6) {
        this.error = false
      }
    },
  },
  // created () {
  //   if (!this.$store.getters['auth/currentHistoryUserKey']) {
  //     this.$router.replace({
  //       path: '/auth/login',
  //       query: {
  //         rf: this.$route.query.rf,
  //       },
  //     })
  //   }
  // },
  mounted () {
    this.$refs['security-code'].focusInput(1)
  },
  methods: {
    relogin () {
      this.$router.replace({
        path: '/auth/login',
        query: {
          rf: this.$route.query.rf,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.wrap {
  width: 810px;
  position: relative;
}
.wrap-inner {
  padding: 0 70px;
}
.code-wrap {
  margin-top: 15px;
}

.status-tip {
  font-size: 12px;
  margin-top: 15px;
  text-align: center;
  .error {
    color: #DD2727;
  }
  .loading {
    i {
      margin-right: 5px;
    }
  }
}
.verify-tip {
  color: #A6AEBC;
  font-size: 12px;
  text-align: center;
  margin-bottom: 40px;
  .relogin-btn {
    margin-left: 10px;
  }
}
</style>

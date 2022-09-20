<template>
  <div>
    <a-row type="flex" class="row-bg process-items process-list-item">
      <a-col :span="2"><div class="p-item p-item1 bg border text-center">1</div></a-col>
      <a-col :span="6"><div class="p-item p-item2 bg pl14 border">{{$t('system.text_532')}}</div></a-col>
      <a-col :span="16"><div class="p-item p-item3 bg pl14 border w-100">{{$t('system.text_533')}}</div></a-col>
    </a-row>
    <div class="process-list-item" v-for="(item, i) in processList" :key="item.key">
      <a-row class="row-bg process-items">
        <a-col :span="2">
          <div class="p-item p-item1 bg border text-center mt-1">{{i+2}}</div>
        </a-col>
        <a-col :span="6">
          <a-form-item class="ml-2">
            <a-input v-decorator="genDecorator(i).name" :placeholder="$t('system.text_534')" />
          </a-form-item>
        </a-col>
        <a-col :span="13" offset="1">
          <a-checkbox v-model="item.rolePopVisible">
            {{ $t("common_724") }}
          </a-checkbox>
          <a-checkbox v-model="item.userPopVisible">
            {{ $t("common_725") }}
          </a-checkbox>
        </a-col>
        <a-col :span="2">
          <a-button shape="circle" icon="minus" size="small" v-if="isShowRemoveProcess" @click="decrease(i)" class="mt-2 ml-2" />
        </a-col>
      </a-row>
      <a-row class="row-bg process-items" v-if="item.rolePopVisible">
        <a-col :span="12">
            <a-form-item>
              <div class="d-flex">
                <label class="process-items-label">{{ $t("common_726") }}：</label>
                <base-select
                  class="w-100"
                  v-decorator="genDecorator(i).role_list"
                  :selectProps="{ placeholder: $t('system.text_536'), 'mode': 'multiple' }"
                  :options="roles"
                  :filterable="true" />
              </div>
            </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item>
            <div class="d-flex">
              <label class="process-items-label ml-2">{{ $t("common_727") }}：</label>
              <base-select
                class="w-100"
                v-decorator="genDecorator(i).role_scope"
                :selectProps="{ 'placeholder': $t('system.wf_role_scope_placeholder') }"
                :options="getRoleScopeOpts()" />
              <span class="ml-1"><a-tooltip><template slot="title"><p v-for="v in newRoleScopeToolTips" :key="v">{{ v }}</p></template><a-icon type="question-circle" /></a-tooltip></span>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="row-bg process-items" v-if="item.userPopVisible">
        <a-col :span="24">
            <a-form-item>
              <div class="d-flex">
                <label class="process-items-label">{{ $t("common_725") }}：</label>
                <base-select
                  class="w-100"
                  style="margin-left: -22px;"
                  v-decorator="genDecorator(i).user_list"
                  :selectProps="{ 'placeholder': $t('system.text_535'), 'mode': 'multiple' }"
                  :options="users"
                  :filterable="true" />
              </div>
            </a-form-item>
        </a-col>
      </a-row>
    </div>
    <div class="d-flex align-items-center" v-if="isShowAddProcess">
      <a-button type="primary" shape="circle" icon="plus" size="small" @click="add" />
      <a-button type="link" @click="add">{{$t('system.text_537')}}</a-button>
      <span class="count-tips">{{$t('system.text_538', [remain])}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as R from 'ramda'
import { WORKFLOW_TYPES, MULTIPLE_APPROVAL_PROCESS } from '@/constants/workflow'

export default {
  name: 'WorkflowConfigProcessList',
  inject: ['form'],
  props: {
    decorator: {
      type: Object,
      required: true,
      validator: val => {
        const fields = ['name', 'role_list', 'user_list']
        return fields.every(f => R.is(Function, val[f]))
      },
    },
    processOps: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      processList: this.processOps,
      processType: this.type,
      users: [],
      roles: [],
      newProcess: {
        userPopVisible: false,
        rolePopVisible: true,
        name: this.$t('system.text_540'),
        assignees: [],
        roles: [],
        selectedUserItems: [],
        selectedRoleItems: [],
      },
      roleScopeToolTips: [this.$t('system.wf_role_scope_project'), this.$t('system.wf_role_scope_domain'), this.$t('system.wf_role_scope_system'), this.$t('system.wf_role_scope_none')],
    }
  },
  computed: {
    ...mapGetters(['l3PermissionEnable']),
    remain () {
      const remain = 5 - this.processList.length
      return Math.max(remain, 0)
    },
    isShowAddProcess () {
      if (!this.processType || !MULTIPLE_APPROVAL_PROCESS.includes(this.processType)) return false
      return this.processList.length < 5
    },
    isShowRemoveProcess () {
      return MULTIPLE_APPROVAL_PROCESS.includes(this.processType)
    },
    newRoleScopeToolTips () {
      const rs = [...this.roleScopeToolTips]
      if (this.processType === WORKFLOW_TYPES.APPLY_DOMAIN_QUOTA || this.processType === WORKFLOW_TYPES.APPLY_JOIN_PROJECT) {
        rs.shift()
      }
      if (!this.l3PermissionEnable) {
        rs.splice(1, 1)
      }
      return rs
    },
  },
  watch: {
    processOps: {
      handler (val, oldV) {
        this.processList = val
      },
      deep: true,
    },
    type: {
      handler (val, oldV) {
        this.processType = val
      },
      deep: true,
    },
  },
  created () {
    this.loadUsers()
    this.loadRoles()
  },
  methods: {
    genDecorator (idx) {
      const ret = {}
      R.forEachObjIndexed((value, key) => {
        ret[key] = value(idx)
      }, this.decorator)
      return ret
    },
    add () {
      this.processList.push({ ...this.newProcess })
      this.form.fc.getFieldDecorator(`name[${this.processList.length - 1}]`, {
        preserve: true,
        initialValue: this.newProcess.name,
      })
    },
    decrease (index) {
      this.processList.splice(index, 1)
      const name = this.form.fc.getFieldValue('name')
      const role = this.form.fc.getFieldValue('role_list')
      const user = this.form.fc.getFieldValue('user_list')

      name && name.splice(index, 1)
      role && role.splice(index, 1)
      user && user.splice(index, 1)
      this.$nextTick(() => {
        this.form.fc.setFieldsValue({
          name,
          role_list: role,
          user_list: user,
        })
      })
    },
    loadUsers () {
      const manager = new this.$Manager('users', 'v1')
      const params = { scope: this.$store.getters.scope }
      manager.list({ params })
        .then((res) => {
          this.users = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
            }
          })
          this.$emit('users', this.users)
        })
    },
    loadRoles () {
      const manager = new this.$Manager('roles', 'v1')
      const params = { scope: this.$store.getters.scope }
      manager.list({ params })
        .then((res) => {
          this.roles = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
            }
          })
          this.$emit('roles', this.roles)
        })
    },
    getRoleScopeOpts () {
      let roleScopes = [
        { id: 'project', name: this.$t('dictionary.project') },
        { id: 'domain', name: this.$t('dictionary.domain') },
        { id: 'system', name: this.$t('common_723') },
      ]
      if (this.processType === WORKFLOW_TYPES.APPLY_DOMAIN_QUOTA || this.processType === WORKFLOW_TYPES.APPLY_JOIN_PROJECT) {
        roleScopes.shift()
      }
      if (!this.l3PermissionEnable) {
        roleScopes = roleScopes.filter(item => item.id !== 'domain')
      }
      return roleScopes
    },
  },
}
</script>

<style lang="less" scoped>
.process-items {
  &:first-child {
    margin-bottom: 18px;
  }
  .p-item {
    height: 32px;
    line-height: 32px;
    margin-right: 6px;
  }
  .p-item.border {
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
  }
  .p-item.bg {
    background: #f5f7fa;
  }
  .p-item.pl14 {
    padding-left: 14px;
  }
  .yl-icon-remove-outline {
    margin-top: 6px;
  }
  .process-items-label {
    width: 149px;
  }
}
.process-list-item {
  padding: 10px 8px;
  margin-bottom: 18px;
  background: #f5f7fa;
  border-radius: 6px;
  box-shadow:3px 3px 2px #f5f7fa;
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>

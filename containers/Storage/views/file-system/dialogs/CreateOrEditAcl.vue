<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{params.title}}</div>
    <div slot="body">
      <a-form
        v-bind="formItemLayout"
        :form="form.fc">
        <a-form-item>
          <span slot="label">
            {{$t('storage.access.group.rule.source')}}&nbsp;
            <a-tooltip :title="$t('storage.xgfs.nfs.share.acl.source.tooltip')">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <template v-if="isAclCreated">
            <a-input :disabled="false" v-decorator="decorators.source" :placeholder="$t('storage.xgfs.nfs.share.acl.source')" />
<!--            <a-input :disabled="IPCheckboxDisabled" v-decorator="decorators.source" :placeholder="$t('storage.xgfs.nfs.share.acl.source')" />-->
<!--            <a-checkbox class="right-checkbox" @change="sourceChanged" :checked="isIPChecked">{{$t('compute.text_997')}}</a-checkbox>-->
          </template>
          <template v-else>
            <a-input :disabled="true" v-decorator="decorators.source" :placeholder="$t('storage.xgfs.nfs.share.acl.source')" />
          </template>
        </a-form-item>
        <a-form-item :label="$t('common.description')">
          <a-textarea :auto-size="{ minRows: 1, maxRows: 3 }" v-decorator="decorators.description" :placeholder="$t('common_367')" />
        </a-form-item>
        <a-form-item :label="$t('storage.access.group.rule.rw.access_type')">
          <a-radio-group v-decorator="decorators.rw_access_type">
            <a-radio value="RW">{{$t('storage.access.group.rule.rw.access_type.rw')}}</a-radio>
            <a-radio value="R">{{$t('storage.access.group.rule.rw.access_type.r')}}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-collapse :bordered="false">
          <a-collapse-panel :header="$t('storage.xgfs.nfs.share.acl.collapse.settings')" key="1" forceRender>
            <a-form-item :label="$t('storage.xgfs.nfs.share.acl.sync')">
              <a-radio-group v-decorator="decorators.sync">
                <a-radio :value="true">sync</a-radio>
                <a-radio :value="false">async</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <span slot="label">
                {{$t('storage.xgfs.nfs.share.acl.user.squash')}}&nbsp;
                <a-tooltip :title="$t('storage.xgfs.nfs.share.acl.user.squash.tooltip')">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <a-radio-group v-decorator="decorators.user_access_type">
<!--                <a-radio value="no_all_squash">{{$t('storage.access.group.rule.user.access_type.no_all_squash')}}</a-radio>-->
<!--                <a-radio value="all_squash">{{$t('storage.access.group.rule.user.access_type.all_squash')}}</a-radio>-->
                <a-radio value="no_all_squash">no_all_squash</a-radio>
                <a-radio value="all_squash">all_squash</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <span slot="label">
                {{$t('storage.xgfs.nfs.share.acl.root.user.squash')}}&nbsp;
                <a-tooltip :title="$t('storage.xgfs.nfs.share.acl.root.user.squash.tooltip')">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <a-radio-group v-decorator="decorators.root_user_access_type">
<!--                <a-radio value="no_root_squash">{{$t('storage.access.group.rule.user.access_type.no_root_squash')}}</a-radio>-->
<!--                <a-radio value="root_squash">{{$t('storage.access.group.rule.user.access_type.root_squash')}}</a-radio>-->
                <a-radio value="no_root_squash">no_root_squash</a-radio>
                <a-radio value="root_squash">root_squash</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-collapse-panel>
        </a-collapse>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('dialog.ok') }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'MountTargetAclEditDialog',
  mixins: [DialogMixin, WindowsMixin],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data () {
    const selectItem = this.params.data[0]
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        source: [
          'source',
          {
            validateFirst: true,
            initialValue: selectItem.source || '',
            rules: [
              { required: true, message: this.$t('compute.text_996') },
              { validator: this.$validate('source') },
            ],
          },
        ],
        description: ['description'],
        rw_access_type: [
          'rw_access_type',
          {
            initialValue: selectItem.rw_access_type || 'RW',
            rules: [
              { required: true },
            ],
          },
        ],
        sync: [
          'sync',
          {
            initialValue: selectItem.sync || false,
          },
        ],
        user_access_type: [
          'user_access_type',
          {
            initialValue: selectItem.user_access_type || 'no_all_squash',
          },
        ],
        root_user_access_type: [
          'root_user_access_type',
          {
            initialValue: selectItem.root_user_access_type || 'no_root_squash',
          },
        ],
      },
      formItemLayout: {
        wrapperCol: {
          span: 14,
        },
        labelCol: {
          span: 4,
        },
      },
      IPCheckboxDisabled: selectItem.cidr === '0.0.0.0/0',
      isIPChecked: selectItem.cidr === '0.0.0.0/0',
    }
  },
  computed: {
    isAclCreated () {
      if (this.params.data[0].id) {
        return false
      }
      return true
    },
  },
  methods: {
    sourceChanged (e) {
      this.IPCheckboxDisabled = !this.IPCheckboxDisabled
      this.isIPChecked = !this.isIPChecked
      if (e.target.checked) {
        this.$nextTick(() => {
          this.form.fc.setFieldsValue({ source: '0.0.0.0/0' })
        })
      } else {
        this.$nextTick(() => {
          this.form.fc.resetFields(['source'])
        })
      }
    },
    saveEdit (data) {
      // console.log(data)
      console.log(this.params) // create dialog with params
      if (this.params.data[0].id) {
        const id = this.params.data[0].id
        return new this.$Manager('mount_target_acls').update({
          id,
          data,
          file_system_id: this.params.file_system_id,
        })
      }
      const params = {
        ...data,
        file_system_id: this.params.file_system_id,
      }
      return new this.$Manager('mount_target_acls').create({
        data: params,
      })
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        await this.saveEdit(values)
        this.loading = false
        this.params.refresh && this.params.refresh()
        this.cancelDialog()
      } catch (e) {
        this.loading = false
        throw e
      }
    },
  },
}
</script>

<style lang="less" scoped>
.right-checkbox {
  width: 100px;
  height: 40px;
  left: 470px;
  font-size: 12px!important;
  color: #ccc;
  position: absolute;
}
</style>

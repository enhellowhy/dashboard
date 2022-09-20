// import BillWarning from '@Bill/views/warning'
// import BillWarningForm from '@Bill/views/warning/form'

import Overview from '@Bill/views/overview'
// import Account from '@Bill/views/account'
// import Statistics from '@Bill/views/statistic'
// import Analysis from '@Bill/views/analysis'

import Associate from '@Bill/views/associate'
import Resource from '@Bill/views/resource'
import Detail from '@Bill/views/detail'

// import SuggestsAlert from '@Bill/views/suggestsalert'
// import SuggestsRule from '@Bill/views/suggestsrule'
// import SuggestsRuleConfig from '@Bill/views/suggestsysruleconfig'

import Rate from '@Bill/views/rate'

import store from '@/store'
import Layout from '@/layouts/RouterView'
import { hasSetupKey } from '@/utils/auth'
import i18n from '@/locales'

export default {
  index: 61,
  meta: {
    label: () => process.env.VUE_APP_PLATFORM === 'operation' ? i18n.t('bill.text_34') : i18n.t('bill.text_35'),
    icon: 'menu-meter',
  },
  menus: [
    {
      path: '/billoverview',
      meta: {
        label: i18n.t('bill.text_36'),
        permission: 'bill_analysises_list',
        hidden: () => !hasSetupKey(['onestack', 'aliyun', 'aws', 'azure', 'huawei', 'qcloud', 'google', 'openstack', 'dstack', 'zstack', 'vmware']),
      },
      component: Overview,
    },
    /**
     * 分析
     */
    // {
    //   meta: {
    //     label: i18n.t('bill.text_245'),
    //     hidden: () => !hasSetupKey(['onestack', 'aliyun', 'aws', 'azure', 'huawei', 'qcloud', 'google', 'openstack', 'dstack', 'zstack', 'vmware']),
    //     labelAlias: '费用分析',
    //   },
    //   submenus: [
    //     {
    //       path: '/billaccount',
    //       meta: {
    //         label: i18n.t('bill.text_244'),
    //         permission: 'bill_balances_list',
    //         hidden: () => !store.getters.isAdminMode && !store.getters.isDomainMode,
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'BillAccountList',
    //           path: '',
    //           component: Account,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/billstatistic',
    //       meta: {
    //         label: i18n.t('bill.text_246'),
    //         permission: 'bill_analysises_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'BillStatistic',
    //           path: '',
    //           component: Statistics,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/billanalysis',
    //       meta: {
    //         label: i18n.t('bill.text_247'),
    //         permission: 'bill_analysises_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'BillaAnalysis',
    //           path: '',
    //           component: Analysis,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/billwarning',
    //       meta: {
    //         label: i18n.t('bill.text_248'),
    //         hidden: () => process.env.VUE_APP_PLATFORM === 'operation',
    //         permission: 'costalerts_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'BillWarning',
    //           path: '',
    //           component: BillWarning,
    //         },
    //         {
    //           name: 'BillWarningForm',
    //           path: 'form',
    //           component: BillWarningForm,
    //         },
    //       ],
    //     },
    //   ],
    // },
    /**
     * 账单
     */
    {
      meta: {
        label: i18n.t('bill.text_249'),
        hidden: () => !hasSetupKey(['onestack', 'aliyun', 'aws', 'azure', 'huawei', 'qcloud', 'google', 'openstack', 'dstack', 'zstack', 'vmware']),
        labelAlias: '费用账单',
      },
      submenus: [
        {
          path: '/billassociate',
          meta: {
            label: i18n.t('bill.text_250'),
            permission: 'bill_associates_list',
          },
          component: Layout,
          children: [
            {
              name: 'BillAssociate',
              path: '',
              component: Associate,
            },
          ],
        },
        {
          path: '/billresource',
          meta: {
            label: i18n.t('bill.text_251'),
            permission: 'bill_resources_list',
          },
          component: Layout,
          children: [
            {
              name: 'BillResource',
              path: '',
              component: Resource,
            },
          ],
        },
        {
          path: '/billdetail',
          meta: {
            label: i18n.t('bill.text_252'),
            permission: 'bill_details_list',
          },
          component: Layout,
          children: [
            {
              name: 'BillDetail',
              path: '',
              component: Detail,
            },
          ],
        },
      ],
    },
    // {
    //   meta: {
    //     label: i18n.t('bill.text_253'),
    //     hidden: () => process.env.VUE_APP_PLATFORM === 'operation' || !hasSetupKey(['onestack', 'public', 'openstack', 'dstack', 'zstack', 'vmware']),
    //   },
    //   submenus: [
    //     {
    //       path: '/suggestsysalert',
    //       meta: {
    //         label: i18n.t('bill.text_254'),
    //         permission: 'suggestsysalerts_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'SuggestsAlert',
    //           path: '',
    //           component: SuggestsAlert,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/suggestsysruleconfig',
    //       meta: {
    //         label: i18n.t('bill.text_255'),
    //         permission: 'suggestsysruleconfigs_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'SuggestsRuleConfig',
    //           path: '',
    //           component: SuggestsRuleConfig,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/suggestsysrule',
    //       meta: {
    //         label: i18n.t('bill.text_256'),
    //         permission: 'suggestsysrules_list',
    //         hidden: () => !store.getters.isAdminMode,
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'SuggestsRule',
    //           path: '',
    //           component: SuggestsRule,
    //         },
    //       ],
    //     },
    //   ],
    // },
    /**
     * 分析
     */
    {
      meta: {
        label: i18n.t('bill.text_777'),
        // hidden: () => !store.getters.isAdminMode,
        hidden: () => !hasSetupKey(['onestack', 'openstack', 'dstack', 'zstack', 'vmware']) || !store.getters.isAdminMode,
      },
      submenus: [
        {
          path: '/billrate',
          meta: {
            label: i18n.t('bill.text_38'),
            permission: 'rates_list',
          },
          component: Layout,
          children: [
            {
              name: 'BillRate',
              path: '',
              component: Rate,
            },
          ],
        },
      ],
    },
  ],
}

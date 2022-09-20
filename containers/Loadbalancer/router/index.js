import LbList from '@Loadbalancer/views/lb'
import LBCreate from '@Loadbalancer/views/lb/create/index'
import LbListenerCreate from '@Loadbalancer/views/loadbalancerlistener/create'
import LbaclsList from '@Loadbalancer/views/lbacls'
import LbcertsList from '@Loadbalancer/views/lbcerts'
import LoadbalancerclusterList from '@Loadbalancer/views/loadbalancercluster'
import AgentList from '@Loadbalancer/views/agent'
import AgentForm from '@Loadbalancer/views/agent/form'
import Layout from '@/layouts/RouterView'

import { hasSetupKey } from '@/utils/auth'
import i18n from '@/locales'
import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 41,
  meta: {
    label: i18n.t('loadbalancer.text_1'),
    icon: 'menu-loadbalancer',
  },
  menus: [
    /**
     * 负载均衡
     */
    {
      meta: {
        label: i18n.t('loadbalancer.text_2'),
        labelAlias: '网络负载均衡',
        // hidden: () => !hasServices('lbagent') && !hasHypervisors(['aliyun', 'qcloud', 'huawei', 'aws']),
      },
      submenus: [
        {
          path: '/lb',
          meta: {
            label: i18n.t('network.text_714'),
            permission: 'lb_loadbalancers_list',
            hidden: () => {
              if (isScopedPolicyMenuHidden('sub_hidden_menus.lb')) {
                return true
              }
              return !hasSetupKey(['lb', 'aliyun', 'huawei', 'qcloud', 'aws', 'k8s', 'apsara', 'hcso', 'azure', 'google'])
            },
          },
          component: Layout,
          children: [
            {
              name: 'LBList',
              path: '',
              component: LbList,
            },
            {
              name: 'LBCreate',
              path: 'create',
              component: LBCreate,
            },
            {
              name: 'LBSDetailListenerCreate',
              path: ':id/listener-create',
              component: LbListenerCreate,
            },
            {
              name: 'LBSDetailListenerUpdate',
              path: ':id/listener-update',
              component: LbListenerCreate,
            },
          ],
        },
        {
          path: '/lbacl',
          meta: {
            label: i18n.t('network.text_715'),
            permission: 'lb_loadbalanceracls_list',
            hidden: () => {
              if (isScopedPolicyMenuHidden('sub_hidden_menus.lbacl')) {
                return true
              }
              return !hasSetupKey(['lb', 'aliyun', 'huawei', 'qcloud', 'aws', 'k8s', 'hcso', 'azure', 'google'])
            },
          },
          component: Layout,
          children: [
            {
              name: 'LbaclList',
              path: '',
              component: LbaclsList,
            },
          ],
        },
        {
          path: '/lbcert',
          meta: {
            label: i18n.t('network.text_716'),
            permission: 'lb_loadbalancercertificates_list',
            hidden: () => {
              if (isScopedPolicyMenuHidden('sub_hidden_menus.lbcert')) {
                return true
              }
              return !hasSetupKey(['lb', 'aliyun', 'huawei', 'qcloud', 'aws', 'k8s', 'apsara', 'hcso', 'azure', 'google'])
            },
          },
          component: Layout,
          children: [
            {
              name: 'LbcertList',
              path: '',
              component: LbcertsList,
            },
          ],
        },
      ],
    },
    /**
     * 负载均衡集群
     */
    {
      meta: {
        label: i18n.t('loadbalancer.text_3'),
        labelAlias: i18n.t('network.text_18'),
      },
      submenus: [
        {
          path: '/cluster',
          meta: {
            label: i18n.t('network.text_19'),
            permission: 'lb_loadbalancerclusters_list',
            hidden: () => {
              if (isScopedPolicyMenuHidden('sub_hidden_menus.cluster')) {
                return true
              }
              return !hasSetupKey(['lb', 'k8s'])
            },
          },
          component: Layout,
          children: [
            {
              name: 'LoadbalancerclusterList',
              path: '',
              component: LoadbalancerclusterList,
            },
          ],
        },
        {
          path: '/lbagent',
          meta: {
            label: i18n.t('network.text_20'),
            permission: 'lb_loadbalanceragents_list',
            hidden: () => {
              if (isScopedPolicyMenuHidden('sub_hidden_menus.lbagent')) {
                return true
              }
              return !hasSetupKey(['lb', 'k8s'])
            },
          },
          component: Layout,
          children: [
            {
              name: 'AgentList',
              path: '',
              component: AgentList,
            },
            {
              name: 'AgentForm',
              path: 'form',
              component: AgentForm,
            },
          ],
        },
      ],
    },
  ],
}

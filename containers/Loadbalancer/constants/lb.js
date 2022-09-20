import i18n from '@/locales'
export const LB_SCHEDULER_MAP = {
  rr: {
    text: i18n.t('network.text_6'),
    desc: i18n.t('network.text_7'),
  },
  wrr: {
    text: i18n.t('network.text_8'),
    desc: i18n.t('network.text_9'),
  },
  wlc: {
    text: i18n.t('network.text_10'),
    desc: i18n.t('network.text_11'),
  },
  sch: {
    text: i18n.t('network.text_12'),
    desc: i18n.t('network.text_13'),
  },
  tch: {
    text: i18n.t('network.text_14'),
    desc: i18n.t('network.text_15'),
  },
  qch: {
    text: i18n.t('network.text_0015'),
    desc: i18n.t('network.text_0115'),
  },
}

export const healcheckDiff = {
  aliyun: {
    disabled: { // 以下情况健康检查禁用
      listener_type: ['tcp', 'udp'],
    },
    alwaysOn: { // 以下情况健康检查须开启
      listener_type: ['tcp', 'udp'],
    },
  },
  aws: { // aws 不允许关闭健康检查
    disabled: { // 以下情况健康检查禁用
      listener_type: ['tcp', 'udp', 'http', 'https'],
    },
  },
}

// 没有声明的表示支持该操作
export const LB_LISTENEER_ACTION_POLICIES = {
  aliyun: {
    disableHealthCheck (row) {
      return !['tcp', 'udp'].includes(row.listener_type)
    },
  },
  qcloud: {
    enable: false,
    disable: false,
    aclUpdate: false,
  },
  huawei: {
    enable: false,
    disable: false,
  },
  aws: {
    enable: false,
    disable: false,
    aclUpdate: false,
    enableHealthCheck: false,
    disableHealthCheck: false,
  },
}

export const LB_MONITOR_OPTS = {
  azure: [
    {
      name: 'used_snat_port',
      label: i18n.t('network.text_759'),
      seleteItem: 'used_snat_port',
      as: i18n.t('network.text_759'),
      fromItem: 'haproxy',
      unit: '',
      transfer: 1,
    },
    {
      name: 'snat_conn_count',
      label: i18n.t('network.text_760'),
      seleteItem: 'snat_conn_count',
      fromItem: 'haproxy',
      as: i18n.t('network.text_760'),
      unit: '',
      transfer: 1,
    },
  ],
  onecloud: [
    // {
    //   name: 'loadbalancer_backends_state',
    //   label: i18n.t('loadbalancer.backends.state'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.backends.state'),
    //   groupBy: ['rip'],
    //   fromItem: 'loadbalancer_backends_state',
    //   unit: '',
    //   transfer: 1,
    // },
    {
      name: 'dpvs_in_bytes_total',
      label: i18n.t('loadbalancer.dpvs.in.bytes.total'),
      seleteItem: 'value',
      as: i18n.t('loadbalancer.dpvs.in.bytes.total'),
      groupBy: ['rip'],
      fromItem: 'dpvs_in_bytes_total',
      unit: 'bps',
      transfer: 1024,
    },
    {
      name: 'dpvs_out_bytes_total',
      label: i18n.t('loadbalancer.dpvs.out.bytes.total'),
      seleteItem: 'value',
      as: i18n.t('loadbalancer.dpvs.out.bytes.total'),
      groupBy: ['rip'],
      fromItem: 'dpvs_out_bytes_total',
      unit: 'bps',
      transfer: 1024,
    },
    {
      name: 'dpvs_in_packets_total',
      label: i18n.t('loadbalancer.dpvs.in.packets.total'),
      seleteItem: 'value',
      as: i18n.t('loadbalancer.dpvs.in.packets.total'),
      groupBy: ['rip'],
      fromItem: 'dpvs_in_packets_total',
      unit: ' 个/s',
      transfer: 1,
    },
    {
      name: 'dpvs_out_packets_total',
      label: i18n.t('loadbalancer.dpvs.out.packets.total'),
      seleteItem: 'value',
      as: i18n.t('loadbalancer.dpvs.out.packets.total'),
      groupBy: ['rip'],
      fromItem: 'dpvs_out_packets_total',
      unit: ' 个/s',
      transfer: 1,
    },
    // {
    //   name: 'dpvs_rate_in_bps',
    //   label: i18n.t('loadbalancer.dpvs.rate.in.bps'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.dpvs.rate.in.bps'),
    //   groupBy: ['rip'],
    //   fromItem: 'dpvs_rate_in_bps',
    //   unit: 'bps',
    //   transfer: 1024,
    // },
    // {
    //   name: 'dpvs_rate_out_bps',
    //   label: i18n.t('loadbalancer.dpvs.rate.out.bps'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.dpvs.rate.out.bps'),
    //   groupBy: ['rip'],
    //   fromItem: 'dpvs_rate_out_bps',
    //   unit: 'bps',
    //   transfer: 1024,
    // },
    // {
    //   name: 'dpvs_rate_in_pps',
    //   label: i18n.t('loadbalancer.dpvs.rate.in.pps'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.dpvs.rate.in.pps'),
    //   groupBy: ['rip'],
    //   fromItem: 'dpvs_rate_in_pps',
    //   unit: ' 个/s',
    //   transfer: 1,
    // },
    // {
    //   name: 'dpvs_rate_out_pps',
    //   label: i18n.t('loadbalancer.dpvs.rate.out.pps'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.dpvs.rate.out.pps'),
    //   groupBy: ['rip'],
    //   fromItem: 'dpvs_rate_out_pps',
    //   unit: ' 个/s',
    //   transfer: 1,
    // },
    {
      name: 'active_conn',
      label: i18n.t('loadbalancer.active.conn'),
      seleteItem: 'value',
      as: i18n.t('loadbalancer.active.conn'),
      groupBy: ['rip'],
      fromItem: 'active_conn',
      unit: ' 个',
      transfer: 1,
    },
    {
      name: 'in_active_conn',
      label: i18n.t('loadbalancer.in.active.conn'),
      seleteItem: 'value',
      as: i18n.t('loadbalancer.in.active.conn'),
      groupBy: ['rip'],
      fromItem: 'in_active_conn',
      unit: ' 个',
      transfer: 1,
    },
    // {
    //   name: 'persist_conn',
    //   label: i18n.t('loadbalancer.persist.conn'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.persist.conn'),
    //   groupBy: ['rip'],
    //   fromItem: 'persist_conn',
    //   unit: ' 个',
    //   transfer: 1,
    // },
    // {
    //   name: 'dpvs_rate_cps',
    //   label: i18n.t('loadbalancer.dpvs.rate.cps'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.dpvs.rate.cps'),
    //   groupBy: ['rip'],
    //   fromItem: 'dpvs_rate_cps',
    //   unit: ' 个/s',
    //   transfer: 1,
    // },
    // {
    //   name: 'dpvs_conns_total',
    //   label: i18n.t('loadbalancer.dpvs.conns.total'),
    //   seleteItem: 'value',
    //   as: i18n.t('loadbalancer.dpvs.conns.total'),
    //   groupBy: ['rip'],
    //   fromItem: 'dpvs_conns_total',
    //   unit: ' 个',
    //   transfer: 1,
    // },
  ],
}

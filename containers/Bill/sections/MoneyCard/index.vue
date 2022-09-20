<template>
  <div class="moneny-card">
    <bill-card class="mb-2" :height="height">
      <div class="title d-flex align-items-center">
        <div class="flex-fill">
          <template>
            <slot name="title" />
            <span v-if="!$slots.title">{{ title }}</span>
          </template>
          <icon v-if="icon" :type="icon" class="ml-2" style="font-size: 12px" />
        </div>
        <template v-if="showAlert">
          <a-icon type="bell" theme="twoTone" /><a-button type="link" size="small" class="p-0" @click="() => $emit('btnClick')"> {{ btnTitle }}</a-button>
        </template>
      </div>
      <div class="clearfix" style="height: 74px;" v-if="isDefaultFormat">
        <a-tooltip v-if="tooltip">
          <template slot="title">{{tooltip}}</template>
          <span :class="numberStyle" v-if="!moneyIsNil">{{ currencyCn }}{{money | numerify('0,0.00')}}</span>
          <span :class="numberStyle" v-if="!valueIsNil">{{ currencyCn }}{{value}}</span>
        </a-tooltip>
        <template v-else>
          <span :class="numberStyle" v-if="!moneyIsNil">{{ currencyCn }}{{money | numerify('0,0.00')}}</span>
          <span :class="numberStyle" v-if="!valueIsNil">{{ currencyCn }}{{value}}</span>
        </template>
        <template v-if="show">
          <span class="ring d-flex flex-column align-items-center justify-content-center">
            <div>{{ comparisonCn }}</div>
            <div :class="radioStyle">
              <a-icon :type="radioIcon" />
              <span>  {{ radioNum }}%</span>
            </div>
          </span>
        </template>
      </div>
      <template #customizeContent>
        <slot name="customizeContent" />
      </template>
    </bill-card>
  </div>
</template>

<script>
import * as R from 'ramda'
import BillCard from '@Bill/components/BillCard'
import i18n from '@/locales'

export default {
  name: 'MoneyCard',
  components: {
    BillCard,
  },
  props: {
    title: String,
    icon: String,
    tooltip: String,
    money: [String, Number],
    value: [String, Number],
    radio: [String, Number],
    height: String,
    btnTitle: {
      type: String,
      default: i18n.t('bill.text_54'),
    },
    showAlert: {
      type: Boolean,
      default: false,
    },
    currencyCn: {
      type: String,
      default: i18n.t('bill.text_29'),
    },
    comparisonCn: {
      type: String,
      default: i18n.t('bill.text_561'),
    },
    showUnit: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    isDefaultFormat: {
      type: Boolean,
      default: true,
    },
    numberFontColor: {
      type: String,
    },
  },
  computed: {
    moneyIsNil () {
      return R.isNil(this.money)
    },
    valueIsNil () {
      return R.isNil(this.value)
    },
    numberStyle () {
      const isUsedDefault = Boolean(this.numberFontColor)
      const obj = {
        num: true,
        'number-default-color': !isUsedDefault,
      }
      if (isUsedDefault) {
        obj[this.numberFontColor] = true
      }
      return obj
    },
    radioNum () {
      const radioNum = Number(this.radio)
      const radio = (radioNum * 100).toFixed(2)
      return radio
    },
    radioIcon () {
      if (this.radioNum >= 0) {
        return 'rise'
      } else {
        return 'fall'
      }
    },
    radioStyle () {
      const radioNum = Number(this.radio)
      // const rate = rateNum.toFixed(3)
      const radio = (radioNum * 100).toFixed(2)
      if (radio >= 0) {
        return {
          'radio-up': true,
        }
      } else {
        return {
          'radio-down': true,
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.moneny-card {
  .title {
    font-size: 12px;
  }
  .num {
    float: left;
    height: 100%;
    line-height: 74px;
    font-size: 32px;
    font-weight: bold;
  }
  .number-default-color {
    //color: #4DA1FF;
    color: #000000;
  }
  .radio-up {
    color: #f03d3d;
  }
  .radio-down {
    color: #a0d911;
  }
  .predictionColor {
    color: rgb(129, 189, 221);
    // color: transparent;
    // text-shadow: #4DA1FF 0 0 2px;
  }
  .ring {
    float: right;
    //color: #4C6072;
    color: #000;
    font-size: 14px;
    height: 100%;
    //line-height: 50px;
  }
  .warning {
    font-size: 12px;
  }
}
</style>

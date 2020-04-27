import Vue from 'vue'
import Router from 'vue-router'
import enterTheNum from '@/wecode/enterTheNum/index'
import enterTheNum1 from '@/wecode/enterTheNum1/index'
import chargeInfo from '@/wecode/chargeInfo/index'
import addEvaluation from '@/wecode/addEvaluation/index'
import login from '@/wecode/index'
import chargeDetail from '@/wecode/chargeDetail/index'
import chargingProcess from '@/wecode/chargingProcess/index'
import order from '@/wecode/order/index'
import paleList from '@/wecode/paleList/index'
import paleListInfo from '@/wecode/paleListInfo/index'
import PaymentPage from '@/wecode/PaymentPage/index'
import Personal from '@/wecode/Personal/index'
import PersonalDetail from '@/wecode/PersonalDetail/index'
import searchList from '@/wecode/searchList/index'
import weHome from '@/wecode/home/index'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,

    },
    {
      path: '/login',
      name: 'login',
      component: login,

    },
    {
      path: '/enterTheNum',
      name: 'enterTheNum',
      component: enterTheNum,
    },
    {
      path: '/enterTheNum1',
      name: 'enterTheNum1',
      component: enterTheNum1,
    },
    {
      path: '/chargeInfo',
      name: 'chargeInfo',
      component: chargeInfo
    },

    {
      path: '/addEvaluation',
      name: 'addEvaluation',
      component: addEvaluation
    },

    {
      path: '/chargeDetail',
      name: 'chargeDetail',
      component: chargeDetail
    },
    {
      path: '/chargingProcess',
      name: 'chargingProcess',
      component: chargingProcess
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },

    {
      path: '/paleList',
      name: 'paleList',
      component: paleList
    },

    {
      path: '/paleListInfo',
      name: 'paleListInfo',
      component: paleListInfo
    },
    {
      path: '/PaymentPage',
      name: 'PaymentPage',
      component: PaymentPage
    },
    {
      path: '/Personal',
      name: 'Personal',
      component: Personal
    },
    {
      path: '/PersonalDetail',
      name: 'PersonalDetail',
      component: PersonalDetail
    },
    {
      path: '/searchList',
      name: 'searchList',
      component: searchList
    },
    {
      path: '/weHome',
      name: 'weHome',
      component: weHome
    }
  ]
})

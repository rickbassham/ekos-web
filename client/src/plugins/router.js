import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main.vue'
import Mount from '@/components/Mount.vue'
import Capture from '@/components/Capture.vue'
import Align from '@/components/Align.vue'
import Guide from '@/components/Guide.vue'
import Focus from '@/components/Focus.vue'
import Logs from '@/components/Logs.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/capture',
      name: 'Capture',
      component: Capture
    },
    {
      path: '/mount',
      name: 'Mount',
      component: Mount
    },
    {
      path: '/align',
      name: 'Align',
      component: Align
    },
    {
      path: '/guide',
      name: 'Guide',
      component: Guide
    },
    {
      path: '/focus',
      name: 'Focus',
      component: Focus
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Logs
    }
  ]
})

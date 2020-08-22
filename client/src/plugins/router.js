import Vue from 'vue'
import Router from 'vue-router'

import {routes} from '@/util/routes'

Vue.use(Router)

export default new Router({
  routes: routes.map(r => ({
    name: r.name,
    path: r.path,
    component: r.component,
  }))
})

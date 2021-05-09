import router from './router'
import store from 'store'
import { token } from './api/user'

const allowList = ['/login', '/readerIndex', '/creatorIndex', '/masterIndex', '/register'] // no redirect allowList

router.beforeEach((to, from, next) => {
  /* has token */
  if (store.get('Token')) {
    if (!from.name) {
      token()
        .then(res => {
          console.log(res)
          if (res.role === 'user') {
            if (to.name === 'readerIndex' || to.name === 'creatorIndex') {
              next()
            } else {
              next({ name: 'readerIndex' })
            }
          } else if (res.role === 'master') {
            if (to.name === 'masterIndex') {
              next()
            } else {
              next({ name: 'masterIndex' })
            }
          } else {
            store.remove('acgnConfig')
            store.remove('Token')
            store.remove('userData')
            next({ name: 'login' })
          }
        })
        .catch(() => {
          store.remove('acgnConfig')
          store.remove('Token')
          store.remove('userData')
          next({ name: 'login' })
        })
    }
    if (to.name === 'login' || to.name === 'register') {
      next({ name: from.name })
    } else if (!to.name) {
      next({ name: from.name })
    } else if (to.name === 'masterIndex') {
      token()
        .then(res => {
          if (res.role === 'master') {
            next()
          } else {
            next({ name: from.name })
          }
        })
        .catch(() => {
          store.remove('acgnConfig')
          store.remove('Token')
          store.remove('userData')
          next({ name: 'login' })
        })
    } else if (from.name === 'masterIndex') {
      next({ name: 'masterIndex' })
    } else {
      next()
    }
  } else {
    if (to.name !== 'login' && to.name !== 'register') {
      next({ name: 'login' })
    }
    next()
  }
})

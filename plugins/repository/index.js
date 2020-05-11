const RestfulRepo = (app, item) => {
    let out = {
        list: async (query) => {
            return await app.$axios.$get(`/${item.space}/${item.endpoint}/`, {params: query})
        },
        post: async (body) => {
            return await app.$axios.$post(`/${item.space}/${item.endpoint}/`, body)
        },
        get: async (id, query) => {
            return await app.$axios.$get(`/${item.space}/${item.endpoint}/${id}/`, query)
        },
        update: async (id, body) => {
            return await app.$axios.$put(`/${item.space}/${item.endpoint}/${id}/`, body)
        },
        delete: async (id) => {
            return await app.$axios.$delete(`/${item.space}/${item.endpoint}/${id}/`)
        }
    }
    if (item.callbacks) {
        item.callbacks.forEach(callback => {
            if (callback.hasId) {
                out[callback.name] = async (id, body) => {
                    return await app.$axios[callback.method](`/${item.space}/${item.endpoint}/${id}/${callback.endpoint}`, body)
                }
            } else {
                out[callback.name] = async (body) => {
                    return await app.$axios[callback.method](`/${item.endpoint}/${callback.endpoint}`, body)
                }
            }

        })
    }
    return out
}

const apis_module = [
    {
        space: 'auth',
        endpoint: 'users',
        name: 'user',
        methods: {}
    },
    {
        space: 'repository',
        endpoint: 'repositories',
        name: 'repository',
        methods: {}
    },
    {
        space: 'repository',
        endpoint: 'git-users',
        name: 'git_user',
        methods: {}
    },
    {
        space: 'repository',
        endpoint: 'taxonomies',
        name: 'taxonomy',
        methods: {}
    },
]


export default function (app, inject) {
    const API = {}
    apis_module.forEach(item => {
        API[item.name] = RestfulRepo(app, item)
    })
    app.$api = API
    inject('api', API)
}

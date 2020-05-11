<template>
    <div class="wrapper">
        <section class="hero is-dark">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title is-spaced">{{title}}</h1>
                    <p class="subtitle">{{taxonomy.description || `All project and repository about
                        ${taxonomy.name}`}}</p>
                </div>
            </div>
        </section>
        <section class="section main">
            <div class="container">
                <div class="columns">
                    <div class="column is-8">
                        <div class="field">
                            <div class="level is-mobile">
                                <div class="level-left">
                                    <div class="widget_title">{{response.count}} Results</div>
                                </div>
                                <div class="level-right">
                                    <div class="dropdown is-hoverable" v-bind:class="{'is-active': isActive}"
                                         @click="isActive = !isActive">
                                        <div class="dropdown-trigger">
                                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                                <x-icon name="down"></x-icon>
                                                <span>{{capitalizeFirst(query.order_by)}}</span>
                                            </button>
                                        </div>
                                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                            <div class="dropdown-content">
                                                <n-link
                                                    v-for="i in orders" :key="i"
                                                    @click.native="selectOrder(i)"
                                                    :to="`${pathOder}=${i.toLowerCase()}`"
                                                    class="dropdown-item"
                                                    v-bind:class="{'is-active': i.toLowerCase() === query.order_by}"
                                                >{{i}}
                                                </n-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6" v-for="(repo, i) in response.results" :key="i">
                                <div class="card repo">
                                    <div class="card-image">
                                        <media-display :value="repo.medias ? repo.medias : []"
                                                       image-size="thumb_325_150"/>
                                    </div>
                                    <div class="card-content">
                                        <div class="wrap">
                                            <div class="info">
                                                <h3 class="title is-4" style="margin-bottom: .5rem;">
                                                    <n-link :to="`/project/${repo.id}`">{{repo.name}}</n-link>
                                                </h3>
                                                <p>{{repo.description}}</p>
                                                <div>
                                                    <small>
                                                        <x-icon name="star"></x-icon>
                                                        <span class="value">{{getSD(repo.data_github, 'star')}}</span>
                                                        <span class="field">Stars</span>
                                                    </small>
                                                </div>
                                                <div>
                                                    <small>
                                                        <x-icon name="download"></x-icon>
                                                        <span class="value">{{getSD(repo.data_npm, 'star')}}</span>
                                                        <span class="field">Downloads</span>
                                                    </small>
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div
                                                    class="button is-fullwidth"
                                                    v-clipboard:copy="`npm install ${repo.name}`"
                                                    v-clipboard:success="onCopyDone"
                                                >
                                                    <x-icon name="copy"></x-icon>
                                                    <span>npm install {{repo.name}}</span>
                                                </div>
                                                <div
                                                    class="button is-fullwidth"
                                                    v-clipboard:copy="`yarn add ${repo.name}`"
                                                    v-clipboard:success="onCopyDone"
                                                >
                                                    <x-icon name="copy"></x-icon>
                                                    <span>yarn add {{repo.name}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <b-pagination
                            :total="response.count"
                            :current.sync="query.page"
                            :per-page="10">
                            <b-pagination-button
                                @click.native="changePage(props.page.number, false)"
                                slot-scope="props"
                                :page="props.page"
                                :id="`page-${props.page.number}`"
                                tag="nuxt-link"
                                :href="pathPage(props.page.number)"
                                :to="pathPage(props.page.number)">
                                {{ props.page.number}}
                            </b-pagination-button>
                            <b-pagination-button
                                @click.native="changePage(props.page.number, false)"
                                slot="previous"
                                slot-scope="props"
                                :page="props.page"
                                :tag="props.page.number > 0 ? 'nuxt-link' : 'a'"
                                :href="pathPage(props.page.number)"
                                :to="pathPage(props.page.number)">
                                Previous
                            </b-pagination-button>
                            <b-pagination-button
                                @click.native="changePage(props.page.number, true)"
                                slot="next"
                                slot-scope="props"
                                :page="props.page"
                                :tag="props.page.number < totalPage ? 'nuxt-link' : 'a'"
                                :href="pathPage(props.page.number)"
                                :to="pathPage(props.page.number)">
                                Next
                            </b-pagination-button>
                        </b-pagination>
                    </div>
                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div class="field">
                                    <input @input="searchTax" type="text" class="input" placeholder="Search">
                                </div>
                                <aside class="menu">
                                    <p class="menu-label">
                                        Browser
                                    </p>
                                    <ul class="menu-list">
                                        <li v-for="tax in taxonomyRES.results" :key="tax.id">
                                            <n-link :to="`/${tax.slug}`">{{tax.name}}</n-link>
                                        </li>
                                    </ul>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import debounce from "lodash/debounce"

    export default {
        name: 'Taxonomy',
        async asyncData({$axios, params, query}) {
            if (typeof query.page === "undefined") {
                query.page = 1
            } else {
                query.page = Number.parseInt(query.page)
            }
            query.order_by = query.order_by ? query.order_by : 'best'
            const taxonomy = await $axios.$get(`/repository/taxonomies/${params.tax ? params.tax : process.env.PRIMARY_SITE_ID}/`)
            return {
                taxonomy,
                response: await $axios.$get('/repository/repositories/', {
                    params: {
                        taxonomies: taxonomy.id,
                        ...query
                    }
                }),
                taxonomyRES: await $axios.$get('/repository/taxonomies/', {
                    params: {
                        parent: taxonomy.id,
                        // flag: 'function'
                    }
                }),
                query
            }
        },
        data() {
            return {
                isActive: false,
                orders: [
                    'Best', 'Newest', 'Downloads', 'Stars', 'Quality', 'Popularity', 'Maintenance'
                ]
            }
        },
        components: {},
        head() {
            return {
                title: this.title,
                meta: [
                    {hid: 'description', name: 'description', content: this.taxonomy.description}
                ]
            }
        },
        computed: {
            totalPage() {
                return Math.ceil(this.response.count / 10)
            },
            pathOder() {
                return `?page=1&order_by`
            },
            title() {
                let title = ''
                let main_flag = ''
                if (this.taxonomy.flags) {
                    if (this.taxonomy.flags.includes('repository')) {
                        main_flag = 'repositories'
                    } else if (this.taxonomy.flags.includes('component')) {
                        main_flag = 'component'
                    } else if (this.taxonomy.flags.includes('module')) {
                        main_flag = 'modules'
                    } else {
                        return `${this.taxonomy.name} | Tag`
                    }
                } else {
                    return `${this.taxonomy.name} | Tag`
                }
                if (['best', 'newest'].includes(this.query.order_by)) {
                    title = `${this.capitalizeFirst(this.query.order_by)} ${this.taxonomy.name} ${main_flag}`
                } else {
                    title = `Top ${this.taxonomy.name} ${main_flag} by ${this.capitalizeFirst(this.query.order_by)}`
                }

                if (this.query.page > 1) {
                    title = title + ' | Page ' + this.query.page
                }

                return title
            }
        },
        methods: {
            async fetch() {
                this.response = await this.$axios.$get('/repository/repositories/', {
                    params: {
                        taxonomies: this.taxonomy.id,
                        ...this.query
                    }
                }).then(res => {
                    const myDiv = document.getElementById('__layout');
                    myDiv.scrollTop = 0;
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    return res
                })
            },
            async changePage(p, flag) {
                if (typeof flag === 'boolean') {
                    if ((flag && p <= this.totalPage) || (!flag && p > 0)) {
                        this.query.page = p
                    }
                } else {
                    this.query.page = p
                }
            },
            selectOrder(order) {
                this.query.page = 1;
                this.query.order_by = order.toLowerCase()
            },
            searchTax: debounce(function (text) {
                this.$axios.$get('/repository/taxonomies/', {
                    params: {
                        parent: this.taxonomy.id,
                        search: text.data
                    }
                }).then(res => {
                    this.taxonomyRES = res
                })
            }, 500),
            pathPage(page) {
                return `?page=${page}&order_by=${this.query.order_by}`
            }
        },
        watch: {
            'query.page': {
                handler: function () {
                    this.fetch()
                }
            },
            'query.order_by': {
                handler: function () {
                    this.fetch()
                }
            }
        }
    }
</script>

<style lang="scss">
</style>

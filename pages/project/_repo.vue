<template>
    <div>
        <section class="hero is-small is-dark">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title is-spaced">{{repo.name}}</h1>
                    <div class="statistic">
                        <b-rate :value="repo.score.final * 10 / 2"></b-rate>
                        <p>{{repo.description}}</p>
                    </div>
                    <div class="buttons links">
                        <a class="button is-small" v-for="f in Object.keys(repo.data_meta.links)"
                           :key="f"
                           target="_blank"
                           rel="nofollow"
                           :href="repo.data_meta.links[f]"
                        >
                            <x-icon :name="f"></x-icon>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-8">
                        <div class="card">
                            <div class="card-content">
                                <media-display :value="repo.medias ? repo.medias : []"
                                               image-size="thumb_650_250"></media-display>
                            </div>
                        </div>
                        <div class="tabs is-boxed">
                            <ul>
                                <li v-bind:class="{'is-active': avlTab === 'overview'}">
                                    <a @click="avlTab = 'overview'">
                                        <span>Charts</span>
                                    </a>
                                </li>
                                <li v-bind:class="{'is-active': avlTab === 'readme'}">
                                    <a @click="avlTab = 'readme'">
                                        <span>Read Me</span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <span>Tutorial</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="overview" v-if="avlTab === 'overview'">
                            <div class="widget_title">Weekly Downloads</div>
                            <chart type="line" :label="repo.name" :data="downloads"/>
                            <div class="widget_title">Stars</div>
                            <chart type="line" :label="repo.name" :data="stars"/>
                        </div>
                        <div class="content" v-if="avlTab === 'readme'">
                            <div v-html="readme"></div>
                        </div>
                        <h4 class="widget_title">Tag</h4>
                        <div class="buttons" v-if="repo.taxonomies">
                            <n-link v-for="tax in repo.taxonomies" :key="tax.id" class="button" :to="`/${tax.slug}`">
                                {{tax.name}}
                            </n-link>
                        </div>
                    </div>
                    <div class="column">
                        <div class="card install">
                            <div class="card-content">
                                <div class="widget_title">Install</div>
                                <div class="button is-fullwidth"
                                     v-clipboard:copy="`npm install ${repo.name}`"
                                     v-clipboard:success="onCopyDone">
                                    <x-icon name="copy"></x-icon>
                                    <span>npm install {{repo.name}}</span>
                                </div>
                                <div class="button is-fullwidth"
                                     v-clipboard:copy="`yarn add ${repo.name}`"
                                     v-clipboard:success="onCopyDone">
                                    <x-icon name="copy"></x-icon>
                                    <span>yarn add {{repo.name}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-left">
                                        <div class="image is-48x48">
                                            <img :src="repo.author.avatar_url || '/avatar.png'" alt="">
                                        </div>
                                    </div>
                                    <div class="media-content">
                                        <div><b>{{repo.author.full_name || repo.author.username}}</b></div>
                                        <small>Author</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card statistic">
                            <div class="card-content">
                                <div class="widget_title">Information</div>
                                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                    <tbody>
                                    <tr>
                                        <th>Version</th>
                                        <td>{{repo.data_meta.version}}</td>
                                    </tr>
                                    <tr>
                                        <th>License</th>
                                        <td>{{repo.data_meta.license}}</td>
                                    </tr>
                                    <tr>
                                        <th>Unpacked Size</th>
                                        <td>{{repo.data_source.files.readmeSize}}</td>
                                    </tr>
                                    <tr>
                                        <th>Minimized Size</th>
                                        <td>
                                            <img
                                                :src="`https://flat.badgen.net/bundlephobia/minzip/${repo.name}`"
                                                alt="Minified + gzip package size for react in KB"
                                                class="badge--in-table">
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card statistic">
                            <div class="card-content">
                                <div class="widget_title">Statistic</div>
                                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                    <tbody>
                                    <tr>
                                        <th>Downloads</th>
                                        <td>{{getSD(repo.data_npm, 'download')}}</td>
                                    </tr>
                                    <tr>
                                        <th>Stars</th>
                                        <td>{{getSD(repo.data_npm, 'star')}}</td>
                                    </tr>
                                    <tr>
                                        <th>Forks</th>
                                        <td>{{repo.data_github.forksCount}}</td>
                                    </tr>
                                    <tr>
                                        <th>Issues</th>
                                        <td>{{repo.data_github.issues.count}}</td>
                                    </tr>
                                    <tr>
                                        <th>Updated</th>
                                        <td>_</td>
                                    </tr>
                                    <tr>
                                        <th>Created</th>
                                        <td>_</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    const showdown = require('showdown')
    import getStarHistory from '../../helper/getStarHistory';

    export default {
        name: "Repository",
        async asyncData({$axios, params}) {
            return {
                repo: await $axios.$get(`/repository/repositories/${params.repo}`)
            }
        },
        data() {
            return {
                readme: null,
                avlTab: 'overview',
                downloads: [],
                stars: []
            }
        },
        head() {
            return {
                title: this.repo.name + ': Docs, Tutorials and Example',
                meta: [
                    {hid: 'description', name: 'description', content: this.repo.description}
                ],
                script: [{type: 'application/ld+json', json: this.structuredData}]
            }
        },
        methods: {
            fetchDownload() {
                this.$axios.get(`https://api.npmjs.org/downloads/range/last-month/${this.repo.name}`).then(res => {
                    this.downloads = res.data.downloads.map(x => {
                        return {
                            label: x.day,
                            count: x.downloads
                        }
                    })
                })
            },
            async fetchStar() {
                const history = await getStarHistory(this.repo.full_name)
                    .catch(err => {
                    });
                if (history) {
                    let temp = history.map(x => {
                        return {
                            label: x.date,
                            count: x.starNum
                        }
                    })
                    this.stars = temp.splice(0, 30)
                }
            }
        },
        created() {
            this.$axios.$get(`https://raw.githubusercontent.com/${this.repo.full_name}/master/README.md`).then(res => {
                const converter = new showdown.Converter({emoji: true})
                this.readme = converter.makeHtml(res);
            })
            this.fetchStar()
            this.fetchDownload()
        },
        computed: {
            structuredData() {
                return {
                    "@context": "http://schema.org",
                    "@type": "Product",
                    "name": this.repo.name,
                    "description": this.repo.description,
                    "url": `${process.env.BASE_URL}/project/${this.repo.id}`,
                    "image": this.repo.author ? this.repo.author.avatar_url : undefined,
                    "brand": {
                        "@type": "Brand",
                        "name": this.repo.name,
                        "logo": this.repo.author ? this.repo.author.avatar_url : undefined
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": this.repo.score.final * 10 / 2,
                        "ratingCount": this.repo.data_github.starsCount
                    }
                }
            }
        }
    }
</script>

<style lang="scss">

</style>

<template>
    <div>
        <div class="widget" v-if="repo.data_meta">
            <div class="widget_title">Rate this package</div>
            <div class="columns">
                <div class="column">
                    <div class="card">
                        <div class="card-content">
                            <div class="level is-mobile">
                                <div class="level-left"><h4 class="widget_title">Maintenance</h4></div>
                                <div class="level-right">
                                    <div class="set-size charts-container">
                                        <div class="pie-wrapper style-2">
                                            <span class="label">{{repo.score.detail.maintenance.toFixed(2) * 100}}<span
                                                class="smaller">%</span></span>
                                            <div class="pie" v-bind:style="cc('maintenance').c">
                                                <div class="left-side half-circle" v-bind:style="cc('maintenance').l"></div>
                                                <div class="right-side half-circle" v-bind:style="cc('maintenance').r"></div>
                                            </div>
                                            <div class="shadow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="card">
                        <div class="card-content">
                            <div class="level is-mobile">
                                <div class="level-left"><h4 class="widget_title">Popularity</h4></div>
                                <div class="level-right">
                                    <div class="set-size charts-container">
                                        <div class="pie-wrapper progress-45 style-2">
                                            <span class="label">{{repo.score.detail.popularity.toFixed(2) * 100}}<span
                                                class="smaller">%</span></span>
                                            <div class="pie" v-bind:style="cc('popularity').c">
                                                <div class="left-side half-circle" v-bind:style="cc('popularity').l"></div>
                                                <div class="right-side half-circle" v-bind:style="cc('popularity').r"></div>
                                            </div>
                                            <div class="shadow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="card">
                        <div class="card-content">
                            <div class="level is-mobile">
                                <div class="level-left"><h4 class="widget_title">Quality</h4></div>
                                <div class="level-right">
                                    <div class="set-size charts-container">
                                        <div class="pie-wrapper progress-45 style-2">
                                            <span class="label">{{repo.score.detail.quality.toFixed(2) * 100}}<span
                                                class="smaller">%</span></span>
                                            <div class="pie" v-bind:style="cc('quality').c">
                                                <div class="left-side half-circle" v-bind:style="cc('quality').l"></div>
                                                <div class="right-side half-circle" v-bind:style="cc('quality').r"></div>
                                            </div>
                                            <div class="shadow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="widget">
            <div class="columns">
                <div class="column is-8">
                    <h2 class="widget_title">Weekly Downloads</h2>
                    <chart type="line" :label="repo.name" :data="downloads"/>
                </div>
                <div class="column">
                    <div class="statistic">
                        <div class="widget_title">Information</div>
                        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <tbody>
                            <tr v-if="repo['data_npm']">
                                <th>Downloads</th>
                                <td>{{getSD(repo['data_npm'], 'download')}}</td>
                            </tr>
                            <tr v-if="repo['data_npm']">
                                <th>Stars</th>
                                <td>{{getSD(repo['data_github'], 'star')}}</td>
                            </tr>
                            <tr v-if="repo['data_github'] && repo['data_github'].issues">
                                <th>Issues</th>
                                <td>{{repo['data_github'].issues.count}}</td>
                            </tr>
                            <tr v-if="repo.data_meta">
                                <th>Version</th>
                                <td>{{repo['data_meta'].version}}</td>
                            </tr>
                            <tr v-if="repo['data_meta']">
                                <th>License</th>
                                <td>{{repo['data_meta']['license']}}</td>
                            </tr>
                            <tr v-if="repo['data_github']">
                                <th>Updated</th>
                                <td>{{formatDate(repo['data_github']['updated_at'])}}</td>
                            </tr>
                            <tr v-if="repo['data_github']">
                                <th>Created</th>
                                <td>{{formatDate(repo['data_github']['created_at'])}}</td>
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
            </div>
        </div>
        <div class="widget" v-if="repo['data_meta'] && repo['data_meta']['dependencies']">
            <div class="widget_title">Dependencies</div>
            <div class="columns is-multiline">
                <div class="column is-4" v-for="(value, key) in repo['data_meta']['dependencies']" :key="key">
                    <div class="card">
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content is-bold">{{key}}</div>
                                <div class="media-right">
                                    <div class="tag">{{value}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import getStarHistory from '../../../helper/getStarHistory';

    export default {
        name: "index",
        props: {
            repo: {}
        },
        data() {
            return {
                downloads: [],
                stars: []
            }
        },
        methods: {
            cc(flag) {
                let process = this.repo.score.detail[flag].toFixed(2) * 100;
                let c = {}, r = {}, l = {
                    'transform': `rotate(${process * 3.6}deg)`
                };
                if (process <= 50) {
                    r['display'] = 'none';
                } else {
                    r['transform'] = 'rotate(180deg)';
                    c['clip'] = 'rect(auto, auto, auto, auto)';
                }
                return {
                    r, l, c
                }
            },
            fetchDownload() {
                this.$axios.get(`https://api.npmjs.org/downloads/range/last-month/${this.repo.name}`).then(res => {
                    let data = res.data.downloads.map(x => {
                        return {
                            label: x.day,
                            count: x.downloads
                        }
                    });
                    this.downloads = data.splice(15, 30);
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
                    });
                    this.stars = temp.splice(temp.length - 15, temp.length);
                }
            },
        },
        async created() {
            await this.fetchStar();
            await this.fetchDownload();
        }
    }
</script>

<style scoped>

</style>

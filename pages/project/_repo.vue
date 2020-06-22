<template>
    <div class="ws">
        <div class="sidebar">
            <aside class="menu">
                <div class="menu-child">
                    <ul class="menu-list">
                        <li>
                            <b-tooltip label="Overview" position="is-right">
                                <n-link :to="`/project/${repo.id}`">
                                    <x-icon name="chart-line"></x-icon>
                                </n-link>
                            </b-tooltip>
                        </li>
                        <li>
                            <b-tooltip label="Screenshots" position="is-right">
                                <n-link :to="`/project/${repo.id}/screenshots`">
                                    <x-icon name="image"></x-icon>
                                </n-link>
                            </b-tooltip>
                        </li>
                        <li>
                            <b-tooltip label="Document" position="is-right">
                                <n-link :to="`/project/${repo.id}/document`">
                                    <x-icon name="note"></x-icon>
                                </n-link>
                            </b-tooltip>
                        </li>
                        <li>
                            <b-tooltip label="Tutorials" position="is-right">
                                <n-link :to="`/project/${repo.id}/tutorials`">
                                    <x-icon name="board"></x-icon>
                                </n-link>
                            </b-tooltip>
                        </li>
                        <li>
                            <b-tooltip label="Contributors" position="is-right">
                                <n-link :to="`/project/${repo.id}/contributors`">
                                    <x-icon name="accounts"></x-icon>
                                </n-link>
                            </b-tooltip>
                        </li>
                        <li>
                            <b-tooltip label="Reviews" position="is-right">
                                <n-link :to="`/project/${repo.id}/review`">
                                    <x-icon name="review"></x-icon>
                                </n-link>
                            </b-tooltip>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
        <div class="main">
            <div class="hero is-small is-light">
                <div class="hero-body">
                    <div class="container">
                        <div class="media headline">
                            <div class="media-left" style="width: 160px">
                                <media-display class="is-rounded" :name="repo.name"
                                               :value="repo.medias ? repo.medias : []" image-size="thumb_200_200"/>
                            </div>
                            <div class="media-content">
                                <div>
                                    <h1 v-if="$route.name === 'project-repo'" class="title is-1 spaceless">
                                        {{repo.name}}</h1>
                                    <span v-else class="title is-1 spaceless">{{repo.name}}</span>
                                    <div class="statistic content">
                                        <b-rate disabled :value="repo.score.final * 10 / 2"></b-rate>
                                        <p>made by <b>{{repo.author.username}}</b></p>
                                        <p class="subtitle">{{repo.description}}</p>
                                    </div>
                                    <div class="buttons links" v-if="repo.data_meta">
                                        <a class="button is-text is-small"
                                           v-for="f in Object.keys(repo.data_meta.links)"
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

                        </div>
                    </div>
                </div>
            </div>
            <section class="hero is-small">
                <div class="hero-body">
                    <div class="container">
                        <NuxtChild :repo="repo"></NuxtChild>
                    </div>
                </div>
            </section>
            <div class="section">
                <div class="container">
                    <div class="widget">
                        <h2 class="has-text-centered title">Related</h2>
                        <div class="columns is-multiline">
                            <div class="column is-3" v-for="re in related" :key="re.id">
                                <div class="card">
                                    <div class="card-image">
                                        <media-display :name="re.name" :value="re.medias ? re.medias : []"
                                                       image-size="thumb_200_200"/>
                                    </div>
                                    <div class="card-content">
                                        <h4 class="widget_title has-text-centered">
                                            <nuxt-link :to="`/project/${re.id}`">{{re.name}}</nuxt-link>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tags">
                        <n-link v-for="tax in repo.taxonomies" :to="`/${tax.slug}`" class="tag"
                                :key="tax.id">{{tax.name}}
                        </n-link>
                    </div>
                </div>
            </div>
            <footer class="footer">
                <div class="container">
                    <p><strong>Made</strong> with ❤️</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Repository",
        async asyncData({$axios, params}) {
            return {
                repo: await $axios.$get(`/repository/repositories/${params.repo}`),
                related: await $axios.$get(`/repository/repositories/${params.repo}/related`)
            }
        },
        data() {
            return {
                readme: null,
                avlTab: 'overview'
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
        methods: {},
        created() {
        },
        computed: {
            structuredData() {
                if (this.repo['data_github']) {
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
                            "ratingCount": this.repo.data_github.starsCount > 0 ? this.repo.data_github.starsCount : 1
                        },
                        "sku": this.repo.full_name,
                        "mpn": this.repo.full_name
                    }
                } else {
                    return {}
                }
            }
        }
    }
</script>

<style lang="scss">
    .ws {
        height: calc(100vh - 3.75rem - 2px);
        position: relative;
        display: flex;
        flex-direction: row;

        .sidebar {
            width: 70px;
            border-right: 1px solid #EEE;

            .menu {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;

                .menu-child {
                    margin-bottom: 1rem;

                    &:first-child {
                        flex: 1;
                        border-bottom: 1px solid #EEE;
                    }
                }
            }

            .menu-list {
                span {
                    width: 100%;
                    color: rgb(114, 112, 106);
                }

                a {
                    width: 100%;
                    margin-left: 0;
                    margin-right: 0;
                    text-align: center;

                    &.is-active {
                        background-color: unset;

                        span {
                            color: #65d260;
                        }
                    }
                }
            }
        }

        .main {
            flex: 1;
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        .activities {
            .media + .media {
                border-top: 1px solid #EEEEEE;
                margin-top: .5rem;
                padding-top: 1rem;
            }
        }
    }

    .headline {
        .content p:not(:last-child) {
            margin-bottom: .5rem;
        }
    }

    @media screen and (max-width: 768px) {
        .media-content {
            overflow-x: unset;
        }

        .media-left {
            max-width: 64px;
        }

        .title.is-1 {
            font-size: 1.8rem;
        }

        .subtitle {
            font-size: 1rem;
        }
    }

    .nuxt-link-exact-active {
        background: #EEEEEE;
    }

    // -- vars
    $bg-color: #34495e;
    $default-size: 1em;
    $label-font-size: $default-size / 4;
    $label-font-size-redo: $default-size * 4;

    // -- mixins
    @mixin size($width, $height) {
        height: $height;
        width: $width;
    }

    @mixin draw-progress($color) {
        .pie {
            .half-circle {
                border-color: $color;
            }
        }
    }

    // -- selectors
    .set-size {
        font-size: 3em;
    }

    .charts-container {
        &:after {
            clear: both;
            content: '';
            display: table;
        }
    }

    .pie-wrapper {
        @include size($default-size, $default-size);
        float: left;
        position: relative;

        &:nth-child(3n + 1) {
            clear: both;
        }

        .pie {
            @include size(100%, 100%);
            clip: rect(0, $default-size, $default-size, $default-size / 2);
            left: 0;
            position: absolute;
            top: 0;

            .half-circle {
                @include size(100%, 100%);
                border: ($default-size / 10) solid #3498db;
                border-radius: 50%;
                clip: rect(0, $default-size / 2, $default-size, 0);
                left: 0;
                position: absolute;
                top: 0;
            }
        }

        .label {
            background: $bg-color;
            border-radius: 50%;
            bottom: $label-font-size-redo / 10;
            color: #ecf0f1;
            cursor: default;
            display: block;
            font-size: $label-font-size;
            left: $label-font-size-redo / 10;
            line-height: $label-font-size-redo * .70;
            position: absolute;
            right: $label-font-size-redo / 10;
            text-align: center;
            top: $label-font-size-redo / 10;

            .smaller {
                color: #bdc3c7;
                font-size: .45em;
                padding-bottom: 20px;
                vertical-align: super;
            }
        }

        .shadow {
            @include size(100%, 100%);
            border: $default-size / 10 solid #bdc3c7;
            border-radius: 50%;
        }

        &.style-2 {
            .label {
                background: none;
                color: #7f8c8d;

                .smaller {
                    color: #bdc3c7;
                }
            }
        }

        @include draw-progress(#e67e22);
    }
</style>

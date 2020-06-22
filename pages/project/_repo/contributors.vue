<template>
    <div class="container">
        <h1 class="title">{{repo.name}} contributors</h1>
        <div class="columns is-multiline">
            <div class="column is-3" v-for="c in contributors" :key="c.id">
                <div class="card">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <div class="image is-64x64" v-bind:class="{'is-empty': c.avatar_url === null}">
                                    <img v-if="c.avatar_url" :src="c.avatar_url" :alt="c.full_name">
                                </div>
                            </div>
                            <div class="media-content is-bold">{{c.full_name || c.username}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "contributors",
        props: {
            repo: {}
        },
        async asyncData({$axios, params}) {
            return {
                contributors: await $axios.$get(`/repository/repositories/${params.repo}/contributors`)
        }
        }
    }
</script>

<style scoped>

</style>

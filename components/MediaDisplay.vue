<template>
    <div class="thumbnails">
        <div class="image">
            <img :src="display" :alt="alt">
        </div>
        <div class="control next" v-if="hasNext" @click="index++">
            <x-icon class="is-medium" name="right"></x-icon>
        </div>
        <div class="control previous" v-if="hasPrevious" @click="index--">
            <x-icon class="is-medium" name="left"></x-icon>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MediaDisplay",
        props: {
            value: {
                default: () => {
                    return []
                },
                type: Array
            },
            imageSize: {
                default: null
            }
        },
        data() {
            return {
                index: 0
            }
        },
        computed: {
            display() {
                if (this.value.length) {
                    return this.getIMG(this.value[this.index], this.imageSize)
                } else {
                    return `/${this.imageSize}.jpg`
                }
            },
            alt() {
                if (this.value.length) {
                    return this.value[this.index].title
                } else {
                    return  `/${this.imageSize}.jpg`
                }
            },
            hasNext() {
                return this.index < this.value.length - 2
            },
            hasPrevious() {
                return this.index > 0
            }
        }
    }
</script>

<style lang="scss">
    .thumbnails {
        position: relative;

        .control {
            position: absolute;
            top: calc(50% - 25px);
            cursor: pointer;

            &.previous {
                left: .5rem;
            }

            &.next {
                right: .5rem;
            }
        }
    }
</style>

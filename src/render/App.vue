<template>
    <router-view></router-view>
</template>
<script lang='ts'>
import {useRouter} from 'vue-router'
export default {
    name: 'app',
    setup() {
        const router = useRouter();
        router.push('/');
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #00c13c;
    margin-top: 20px;
}
</style>

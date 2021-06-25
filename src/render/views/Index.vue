<template>
    <el-input
        type="text"
        class="input-site"
        v-model="inputValue" />
    <el-button
        class="setSelectorWindow success"
        type="success"
        @click="setSelectorWindow()">Set selector</el-button>
<!--    <button class="firstParse">Parse first time</button>-->
    <el-button
        class="checkIsChanged success"
        type="success"
        @click="createPage()">Parse again</el-button>

    <div class="invisibleContent" v-if="pageIsCreated">
<!--            preload="/@/assets/preload.js"-->
<!--        <webview-->
<!--            :src="inputValue"-->
<!--            preload="./qwe.js"-->
<!--        />-->
    </div>

    <!--    <Helo :msg="`Electron ${ state.version }`" />-->
    <!--    <Helo msg="Vue 3.0 + Vite" />-->
    <!--    <div>-->
    <!--        <el-button style="width: 60%;" @click="increment">Increase</el-button>-->
    <!--    </div>-->
    <!--    <p>count: {{state.count}}</p>-->
    <!--    <p>double: {{state.double}}</p>-->
    <!--    <router-link class="success" to="/create">Create</router-link>-->
</template>

<script>
import {ref} from 'vue';
import {saveData, getSavedData} from '../storage';
const {ipcRenderer} = require('electron');
const version = require('process').versions.electron

export default {
    name: 'Index',
    setup() {
        const inputValue = ref('https://aliexpress.ru/item/1005001316194495.html');
        const pageIsCreated = ref(false);

        ipcRenderer.on('selectorData', async (event, data) => {
            const [content, isFirstRender] = data;
            if (isFirstRender) {
                saveData('data.txt', content);
                await ipcRenderer.invoke('set-is-first-render', false);
                destroyPage();
                return;
            }

            if (content !== getSavedData()) {
                await ipcRenderer.invoke('show-notification', 'They are not equal!');
            }
            destroyPage();
        });

        function createPage() {
            pageIsCreated.value = true;
        }

        function interval() {
            setInterval(() => {
                createPage();
            }, 10000);
        }

        function destroyPage() {
            document.querySelector('.invisibleContent').innerHTML = null;
        }

        async function setSelectorWindow() {
            await ipcRenderer.invoke('create-window', inputValue.value);
        }

        return {
            inputValue,
            pageIsCreated,
            createPage,
            destroyPage,
            setSelectorWindow
        }
        // const state = reactive({
        //     count: 0,
        //     double: computed(() => state.count * 2),
        //     version: version
        // })
        //
        // function increment() {
        //     state.count++
        // }
        //
        // return {
        //     state,
        //     increment,
        // }
    },
}
</script>

<style lang="scss" scoped>
.logo-box {
    width: 20%;
    margin-left: 130px;
}
.input-site {
    width: 160px;
    margin-right: 12px;
}
.success {
    background: #00c13c;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    color: #fff;
    text-decoration: none;
}
</style>


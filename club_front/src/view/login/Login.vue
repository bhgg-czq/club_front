<template>
<div>
    <input type="text" v-model="number" placeholder="请输入账号">
    <input type="text" v-model="passward" placeholder="请输入密码">
    <button @click="login"></button>
</div>
</template>
<script>
export default {
    data(){
        return{
            number:"",
            passward:""
        }
    },
    methods:{
        login(){
  
        }
    }
}
</script>
<style scoped>

</style>
<template>
  <div class="login">
    <div class="lmain">
      <p class="theme">C L U B</p>
      <p class="theme2">Welcome to join us in the Syst</p>
      <div class="landi">
        <p>账号:</p>
        <el-input v-model='loginForm.sno' placeholder="请输入账号"></el-input>
      </div>
      <div class="landi">
        <p for="">密码:</p>
        <el-input placeholder="请输入密码" v-model='loginForm.password' show-password></el-input>
      </div>
      <div class="choice">
        <el-radio v-model="radio" label="1">社长</el-radio>
        <el-radio v-model="radio" label="2">管理员</el-radio>
      </div>

      <el-button @click="login" type="primary" round >登陆</el-button>
    </div>
  </div>

</template>

<script>
    export default {
      name: "Login2",
      data () {
        return {
          //选择项
          radio: '1',

          loginForm: {
            sno: '',
            password: ''
          },
          isLeader:true
        }
      },
      methods: {
        login () {
          // var input = document.getElementById("type")
          // if(input.checked){
          //   this.isLeader = false;
          // }

          console.log(this.radio)
          if(this.radio === '1'){
            console.log("in来了")
            this.axios
              .post('http://localhost:8181/api/leader/login', {
                id: this.loginForm.sno,
                password: this.loginForm.password
              })
              .then(res => {
                if (res.data.code === 200) {
                  localStorage.setItem("id",res.data.cId)
                  localStorage.setItem("state",1)
                  localStorage.setItem('role',1)
                  localStorage.setItem("token",res.data.token)
                  this.$router.replace({path: '/leader'})
                }
                if(res.data.code === 300){
                  console.log(300)
                  this.$message({
                    type: "info",
                    message: "还没有获得权限哦！"
                  });
                }
                if(res.data.code === 400){
                  this.$message({
                    type: "info",
                    message: "密码错误！"
                  });
                  this.loginForm.password="";
                }
              })
              .catch(failResponse => {

              })
          }
          else {
            this.axios
              .post('http://localhost:8181/api/admin/login', {
                id: this.loginForm.sno,
                password: this.loginForm.password
              })
              .then(successResponse => {
                console.log(successResponse.data.code)
                if (successResponse.data.code === 200) {
                  localStorage.setItem("id",this.loginForm.sno)
                  localStorage.setItem("token",successResponse.data.token)
                  localStorage.setItem("type",successResponse.data.adminType)
                  this.$router.replace({path: '/admin'})
                  localStorage.setItem('role',1)
                }
                else if(successResponse.data.code === 300){
                  this.$message({
                    type: "info",
                    message: "用户不存在！"
                  });
                }
                else if(successResponse.data.code === 400){
                  this.$message({
                    type: "info",
                    message: "密码错误！"
                  });
                  this.loginForm.password="";
                }
              })
              .catch(failResponse => {
              })
          }

        }
      }
    }
</script>

<style scoped>
  .login{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background:url(../../assets/backgroud.jpg);
    height: 700px;
    background-color: rosybrown;
    width: 100%;
  }
  .lmain{
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 10px 10px rgba(170, 170, 170,0.5);
    margin-top: 20px;
    background-color: rgba(255, 255,255,0.8);
  }
  .lmain>p{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .landi{
    display: flex;
    flex-direction: row;
    margin: 3px;
    padding-right: 40px;
  }
  .landi>p{
    width: 70px;
    display: flex;
    margin: 20px;
  }
  .el-input{
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .choice{
    width: 200px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
  }

  .lmain>button{
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 70px;
  }
  .theme{
    font-weight: bolder;
    font-size: 60px;
    text-shadow:-4px 4px 1px rgba(170, 170, 170, 0.795);
    color: #409EFF;
    font-family:Arial,sans-serif;
  }
  .theme2{
    position: relative;
    left: 40px;
    top: -60px;
    font-weight: normal;
    font-size: large;
    color:rgba(170, 170, 170, 0.795);
  }
</style>

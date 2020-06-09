<template>
  <div class="leader_warp" id="admin">
    <el-container>
      <el-header height="100px">
        <h1>社团后台管理系统</h1>
      </el-header>
      <el-container>
        <el-aside width="166px">
          <el-row class="tac">
            <el-col>
              <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
                <el-menu-item index="1" @click="getWaittoPassa()">
                  <i class="el-icon-menu"  ></i>
                  <span slot="title">待审核</span>
                </el-menu-item>
                <el-menu-item index="2"  @click="getAlreadyPassa()">
                  <i class="el-icon-document"></i>
                  <span slot="title">已审核</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-setting"></i>
                  <span slot="title">组织活动</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <div class="search" v-if="this.switch !== 3">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="社团">
                <el-input style="width: 150px" v-model="formInline.club" placeholder="请输入社团名称"></el-input>
              </el-form-item>
              <el-form-item label="活动">
                <el-input style="width: 150px" v-model="formInline.activity" placeholder="请输入活动名称"></el-input>
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker  type="date" v-model="formInline.date" placeholder="查询此日期之前的记录"></el-date-picker>
              </el-form-item>
             

              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" >导出数据</el-button>
              </el-form-item>
            </el-form>
          </div>

          <AdminWait v-if="this.switch === 1"></AdminWait>
          <AdminPass v-if = "this.switch === 2"></AdminPass>
          <AdminActivityDetail v-show="this.switch === 3"></AdminActivityDetail>



        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

  import AdminWait from "../../components/AdminWaitToPass";
  import AdminPass from "../../components/AdminPass";
  import AdminActivityDetail from "../../components/AdminActivityDetail";
  export default {
    el:'#admin',
    components:{
      AdminActivityDetail,
      AdminPass,
      AdminWait
    },
    data() {
      return {
        adminId:'',
        switch:1,
        type:''

      };
    },
    created() {
      this.adminId = localStorage.getItem("id")
      this.type = localStorage.getItem("type")
      this.$bus.$on('activitydetail',(data) =>{
          this.getDetail(data)
      })
      this.$bus.$on('towait',(data) =>{
        this.switch = 1
      })
      console.log(this.adminId)//疑问这里不会有异步问题吗
    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },
      //待审核列表
      getWaittoPassa() {
        this.switch = 1
        this.$bus.$emit('getwait',{"id":this.id,"type":this.type})
      },
      //已审核列表
      getAlreadyPassa() {
        this.switch = 2
        this.$bus.$emit('getalready',{"id":this.id,"type":this.type})
      },
      getDetail(row){
        this.switch = 3;
        this.$bus.$emit('getactivitydetail',row)
      },
      //搜索
       handleSearch() {
         let url
         if(this.switch===1){
              url="http://localhost:8181/api/admin/searchwaittopassa"           
         }
         else if(this.switch===2){
              url="http://localhost:8181/api/admin/searchpassa"   
         }
        this.axios({
          method: "post",
          url: url,
          data: {
            type:this.type,
            cid: this.id,
            username:this.formInline.user,
            joindate:this.formInline.date,
            collegename:this.formInline.college
          }
        }).then(res => {

          console.log(res.data)
          if(res.data.length!=0){
            this.memberList = res.data;
            this.currentPage=1;
            this.total=this.memberList.length;
          }
          else{
            this.$message({
              message: "查询到数据为0条，请重试"
            });
          }


        });
      },
      onSubmit() {}
    },
  };
</script>


<style scoped>
  .page{
    margin-top:50px;
    margin-left: 500px;
  }
  .el-header {
    background-color: #757e8a;
  }
  .el-aside{
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-col {
    border-radius: 4px;
    background-color: #D3DCE6;
  }
  .el-menu-item{
    background-color: #D3DCE6;
    text-align: left;

  }
  .el-main{
    background-color: #f2f2f2;
    min-height:615px;
  }
  img{
    margin: 30px 0;
  }
  h1{
    font-size: 40px;
    margin-top:20px;
    margin-left: 5px;
    color: #fff;
  }
</style>

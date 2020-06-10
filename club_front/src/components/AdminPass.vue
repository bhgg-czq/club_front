<template>
  <div class="card">
    <template>

          <div class="search">
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

      <el-table :data="aList" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="clubName" label="社团名称" width="180"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
        <el-table-column prop="collegeName" label="所属分院" width="180"></el-table-column>
        <el-table-column prop="className" label="申请地点" width="150"></el-table-column>
        <el-table-column prop="number" label="限定人数" width="80"></el-table-column>
        <el-table-column prop="startTime" label="活动开始时间" width="180"></el-table-column>
        <el-table-column prop="endTime" label="活动结束时间" width="180"></el-table-column>
        <el-table-column prop="isPass" label="审核结果" width="80"></el-table-column>
        <el-table-column prop="reason" label="审核原因" width="80"></el-table-column>

        <el-table-column fixed="right" label="操作" width="105" >
          <template slot-scope="scope">
            <el-button @click="rehandlePass(scope.row)" type="primary" size="mini">重新审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
    export default {
        name: "AdminPass",
        data() {
          return {
            adminId:'',//默认值为1
            activityId:'',
            aList:[],
            type:'',
               formInline: {
         club: "",
         activity: "",
         date: "" 
        },
          };
        },
        created() {
          this.$bus.$on('getalready',(data) =>{
            this.getAlreadyPassa()
          })
          this.adminId = localStorage.getItem("id")
          this.type = localStorage.getItem("type")
          console.log(this.adminId)//疑问这里不会有异步问题吗
          this.getAlreadyPassa()

        },
        methods: {
          //选中的当前菜单
          handleSelect() {
            console.log("选中");
          },
          //已审核列表
          getAlreadyPassa() {
            let data = new FormData();
            data.append('type',this.type)
            this.axios.post(`http://localhost:8181/api/admin/passa/${this.adminId}`,data).then(res => {
              // console.log(res);
              this.aList = res.data;
              if(this.type === 'class')
                for(var i = 0;i<this.aList.length;i++){
                  if(this.aList[i].state === 1)
                    this.aList[i].isPass = '通过'
                  else this.aList[i].isPass = '未通过'
                }
              else
                for(var i = 0;i<this.aList.length;i++){
                  if(this.aList[i].aPass === 1)
                    this.aList[i].isPass = '通过'
                  else this.aList[i].isPass = '未通过'
                }
              console.log(this.aList)
            });
          },
                //搜索
       handleSearch() {
          console.log(this.formInline)
          console.log(this.type)
          console.log(this.adminId)   
        this.axios({
          method: "post",
          url: "http://localhost:8181/api/admin/searchpassa",
          data: {
            type:this.type,
            aid: this.adminId,
            clubname:this.formInline.club,
            startdate:this.formInline.date,
            activityname:this.formInline.activity
          }
        }).then(res => {
          
          if(res.data.length!=0){
          console.log(res.data)
           this.aList=res.data
          }
          else{
            this.$message({
              message: "查询到数据为0条，请重试"
            });
          }


        });
      },
        }
    }
</script>

<style scoped>

</style>

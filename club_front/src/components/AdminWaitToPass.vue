<template>
  <div class="card">
    
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
    <template>
      <el-table :data="aList" border style="width: 100%"  >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="clubName" label="社团名称" width="180" ></el-table-column>
        <el-table-column prop="activityName" label="活动名称" width="180" ></el-table-column>
        <el-table-column prop="collegeName" label="所属分院" width="180" ></el-table-column>
        <el-table-column prop="className" label="申请地点" width="150"></el-table-column>
        <el-table-column prop="number" label="限定人数" width="80"></el-table-column>
        <el-table-column prop="startTime" label="活动开始时间" width="180"></el-table-column>
        <el-table-column prop="endTime" label="活动结束时间" width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280" >
          <template slot-scope="scope">
            <el-button @click="handlePass(scope.row)" type="primary" size="mini">通过</el-button>
            <el-button @click="writeReason(scope.row)" type="danger" size="mini">不通过</el-button>
            <el-button @click="detail(scope.row)" type="success" size="mini">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>

    export default {
        name: "AdminActivity",
      data() {
        return {
          adminId:'',//默认值为1
          activityId:'',
          tId:'',
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

        this.$bus.$on('getwait',(data) =>{
          this.getWaittoPassa()
        })
        this.adminId = localStorage.getItem("id")
        this.type = localStorage.getItem("type")
        console.log(this.adminId)//疑问这里不会有异步问题吗
        this.getWaittoPassa();

      },
      methods: {
        //选中的当前菜单
        handleSelect() {
          console.log("选中");
        },
        //待审核列表
        getWaittoPassa() {
          let data = new FormData();
          data.append('type',this.type)
          data.append('id',this.adminId)
          this.axios.post(`http://localhost:8181/api/admin/waittopass`,data,{
            headers:{
              'token':localStorage.getItem('token')
            }
          }).then(res => {
            // console.log(res);
            this.aList = res.data;
            console.log(this.aList)
          });
        },
        //通过活动
        handlePass(row) {
          this.$confirm('确定通过此活动申请？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.activityId = row.aId
            this.tId = row.tId
            let data = new FormData();
            data.append('type',this.type)
            data.append('aid',this.activityId)
            data.append('tid',this.tId)
            this.axios.post(`http://localhost:8181/api/admin/passactivity`,data,{
              headers:{
                'token':localStorage.getItem('token')
              }
            })
              .then(res => {
                // console.log(res)
                if(res.status === 200){
                  this.activityId = ''
                  this.getWaittoPassa()
                }
                else{
                  window.alert("审核失败")
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        //拒绝通过
        writeReason(row){
          this.$prompt('请输入拒绝通过原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.$message({
              type: 'success',
              message: '您的理由是: ' + value
            });
            console.log(value)
            this.handleUnPassrow(row,value)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        },
        handleUnPassrow(row,reason) {
          this.activityId = row.aId
          this.tId = row.tId
          let data = new FormData();
          data.append('type',this.type)
          data.append('aid',this.activityId)
          data.append('tid',this.tId)
          data.append('reason',reason)
          this.axios.post(`http://localhost:8181/api/admin/cancelactivity`,data,{
            headers:{
              'token':localStorage.getItem('token')
            }})
            .then(res => {
              // console.log(res)
              if(res.status === 200){
                this.getWaittoPassa()
              }
              else{
                window.alert("审核失败")
              }
            })
        },
        //查看活动详细内容
        detail(row){
          this.$bus.$emit('activitydetail',row)
        },
                        //搜索
       handleSearch() {
          console.log(this.formInline)
          console.log(this.type)
          console.log(this.adminId)   
        this.axios({
          method: "post",
          url: "http://localhost:8181/api/admin/searchwaittopassa",
          data: {
            type:this.type,
            aid: this.adminId,
            clubname:this.formInline.club,
            startdate:this.formInline.date,
            activityname:this.formInline.activity
          },headers:{
            'token':localStorage.getItem('token')
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

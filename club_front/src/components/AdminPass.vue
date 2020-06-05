<template>
  <div class="card">
    <template>
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
            adminId:'1',//默认值为1
            activityId:'',
            aList:[],
            type:'',
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
          }
        }
    }
</script>

<style scoped>

</style>

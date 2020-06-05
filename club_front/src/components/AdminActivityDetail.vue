<template>
  <el-form  id="d" ref="form" label-width="80px" >
    <el-form-item label="社团名称">
      <el-input v-model="form.clubName" readonly></el-input>
    </el-form-item>
    <el-form-item label="活动名称" >
      <el-input v-model="form.activityName"  readonly></el-input>
    </el-form-item>
    <el-form-item label="所属分院">
      <el-input v-model="form.collegeName" readonly></el-input>
    </el-form-item>
    <el-form-item label="申请地点">
      <el-input v-model="form.className" readonly></el-input>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-input v-model="form.startTime" readonly></el-input>
    </el-form-item>
    <el-form-item label="结束时间">
      <el-input v-model="form.endTime" readonly></el-input>
    </el-form-item>
    <el-form-item label="活动内容">
      <el-input v-model="form.detial" readonly></el-input>
    </el-form-item>
    <el-form-item label="限定人数">
      <el-input v-model="form.number" readonly></el-input>
    </el-form-item>
    <el-form-item label="活动范围">
      <el-input v-model="form.limitt" readonly></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handlePass()">通过</el-button>
      <el-button  type="danger"  @click="writeReason()">不通过</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
      name: "AdminActivityDetail",
      data(){
          return {
            form:{
              clubName:'',
              activityName:''
            }
          }
      },
      created() {
        this.$bus.$on('getactivitydetail',(data) =>{
          this.form = data
        })
      },
      methods:{
        //通过活动
        handlePass() {
          let data = new FormData();
          data.append('type',localStorage.getItem('type'))
          data.append('aid',this.form.aId)
          data.append('tid',this.form.tId)
          this.axios.post(`http://localhost:8181/api/admin/passactivity`,data)
            .then(res => {
              // console.log(res)
              if(res.status === 200){
                this.$bus.$emit('towait')
              }
              else{
                window.alert("审核失败")
              }
            })
        },
        //拒绝通过
        writeReason(){
          this.$prompt('请输入拒绝通过原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.$message({
              type: 'success',
              message: '您的理由是: ' + value
            });
            console.log(value)
            this.handleUnPassrow(value)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        },
        handleUnPassrow(reason) {
          if(reason === null){
            window.alert("理由不能为空")
            return
          }
          let data = new FormData();
          data.append('type',localStorage.getItem('type'))
          data.append('aid',this.form.aId)
          data.append('tid',this.form.tId)
          data.append('reason',reason)
          this.axios.post(`http://localhost:8181/api/admin/cancelactivity`,data)
            .then(res => {
              if(res.status === 200){
                this.$bus.$emit('towait')
              }
              else{
                window.alert("审核失败")
              }
            })
        },
      }
    }
</script>

<style scoped>

</style>

<template>
  <div class="leader_warp" id="admin">
    <el-container>
      <el-header height="80px">
        <div class="pic1">
          <!-- <img src="1.jpg" alt="">         -->
        </div>
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
          <div class="search">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="活动名称">
                <el-input style="width: 150px" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker  type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="分院">
                <el-select  placeholder="分院">
                  <el-option label="计算机与计算科学学院" value="计算机与计算科学学院"></el-option>
                  <el-option label="医学院" value="医学院"></el-option>
                  <el-option label="商学院" value="商学院"></el-option>
                  <el-option label="新西兰UW学院" value="新西兰UW学院"></el-option>
                  <el-option label="创意与艺术设计学院" value="创意与艺术设计学院"></el-option>
                  <el-option label="信息与电气工程学院" value="信息与电气工程学院"></el-option>
                  <el-option label="法学院" value="法学院"></el-option>
                  <el-option label="传媒与人文学院" value="传媒与人文学院"></el-option>
                  <el-option label="外国语学院" value="外国语学院"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="">查询</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="">导出数据</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="card">
            <template>
              <el-table :data="aList" border style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="applyDate" label="申请日期" width="120"></el-table-column>
                <el-table-column prop="clubName" label="社团名称" width="180"></el-table-column>
                <el-table-column prop="collegeName" label="所属分院" width="180"></el-table-column>
                <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
                <el-table-column prop="className" label="活动地点" width="150"></el-table-column>
                <el-table-column prop="number" label="限定人数" width="80"></el-table-column>
                <el-table-column prop="startTime" label="活动时间" width="180"></el-table-column>
                <el-table-column prop="isPass" label="审核结果" width="80"></el-table-column>


                <el-table-column fixed="right" label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button @click="handlePass(scope.row)" type="primary" size="mini">通过</el-button>
                    <el-button @click="handleUnPass(scope.row)" type="danger" size="mini">不通过</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>


        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    el:'#admin',
    data() {
      return {
        adminId:'1',//默认值为1
        activityId:'',
        aList:[],

      };
    },
    created() {
      this.adminId = localStorage.getItem("id")
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
        this.axios.get(`http://localhost:8181/api/admin/waittopassa/${this.adminId}`).then(res => {
          // console.log(res);
          this.aList = res.data;
          console.log(this.aList)
        });
      },
      //已审核列表
      getAlreadyPassa() {
        this.axios.get(`http://localhost:8181/api/admin/passa/${this.adminId}`).then(res => {
          // console.log(res);
          this.aList = res.data;
          for(var i = 0;i<this.aList.length;i++){
            if(this.aList[i].aPass === 1)
              this.aList[i].isPass = '通过'
            else this.aList[i].isPass = '未通过'
          }
          console.log(this.aList)
        });
      },
      //通过活动
      handlePass(row) {
        this.activityId = row.aId
        this.axios.post(`http://localhost:8181/api/admin/passactivity/${this.adminId}/${this.activityId}`)
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
      },

      //拒绝通过
      handleUnPassrow(row) {
        this.aid = row.aId
        this.axios.post(`http://localhost:8181/api/admin/cancelactivity/${this.activitId}`)
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
      //搜索
      handleSearch() {},
      onSubmit() {}
    },
  };
</script>


<style scoped>
</style>

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
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>活动审核</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1">待审核</el-menu-item>
                    <el-menu-item index="1-2">已审核</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">table</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title">form</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">editor</span>
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
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">导出数据</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="card">
            <template>
              <el-table :data="waitList" border style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="applyDate" label="申请时间" width="180"></el-table-column>
                <el-table-column prop="clubName" label="社团名称" width="180"></el-table-column>
                <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
                <el-table-column prop="collegeName" label="分院" width="180"></el-table-column>

                <el-table-column fixed="right" label="操作" width="250">
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
        waitList:[]
      };
    },
    created() {
      this.getWaittoPassa();
    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },
      //得到成员信息
      getWaittoPassa() {
        var id = this.id;
        this.axios.get("http://localhost:8181/api/admin/waittopassa").then(res => {
          console.log(res);
          this.waitList = res.data;
          condole.log(this.waitList)
        });
      },

      handleAdd() {
        this.addDialogFormVisible = true;
      },
      //增加成员
      addMember() {
        this.axios({
          method: "post",
          url: "http://localhost:8181/api/leader/addmember",
          data: {
            //参数还没修改
            cid: 2,
            number: this.student.number
          }
        }).then(res => {
          this.$message({
            message: res.data
          });
        });
      },
      //通过活动
      handlePass(row) {},

      //拒绝通过
      handleUnPassrow() {
        this.row=row;
        this.$confirm("是否不通过该活动", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.memberList.splice(row, 1);
            // console.log(row);
            this.axios({
              method: "post",
              url: "http://localhost:8181/api/leader/deletemember",
              //参数还没改
              data: {
                uid:6,
                cid:1
              }
            }).then(res => {
              this.$message({
                type: "info",
                message: res.data
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //搜索
      handleSearch() {},
      onSubmit(row) {}
    },
  };
</script>


<style scoped>
</style>

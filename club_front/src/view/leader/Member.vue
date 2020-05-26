<template>
  <div class="leader_warp">
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
                    <span>成员管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1" @click="getClubMember(1)">社团成员</el-menu-item>
                    <el-menu-item index="1-2" @click="getClubMember(0)">过往成员</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>

                <router-link to="/leader/passage">
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">推送发布</span>
                </el-menu-item>
                </router-link>

                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title">活动申请</span>
                </el-menu-item>

                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">往期概览</span>
                </el-menu-item>

              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main style="height: 642px">
          <div class="search">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="姓名">
                <el-input style="width: 150px" v-model="formInline.user" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker v-model="formInline.data" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="分院">
                <el-select v-model="formInline.college" placeholder="分院">
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
                <el-button type="primary" @click="handleAdd">添加成员</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">导出数据</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="card">
            <template>
              <el-table :data="memberList.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="学号" width="150"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                <el-table-column prop="college" label="分院" width="220"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
                <el-table-column prop="joinDate" label="入社时间" width="180"></el-table-column>

                <el-table-column fixed="right" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleRemove(scope.row)" type="danger" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>

          <!--分页器-->
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total=total
              @current-change="ChangePage"
              :current-page=currentPage

              @size-change="ChangeSize"
              :page-size=pageSize
            >
            </el-pagination>
          </div>

          <div class="dialogs">
            <el-dialog
              title="添加社团成员"
              :visible.sync="addDialogFormVisible"
              style="width:1000px; left:300px; top:100px"
            >
              <el-form :model="student">
                <!-- <el-form-item label="姓名：" :label-width="formLabelWidth">
                  <el-input
                    v-model="student.name"
                    autocomplete="off"
                    placeholder="请输入姓名"
                    style="width: 500px;"
                  ></el-input>
                </el-form-item>-->

                <el-form-item label="学号：" :label-width="formLabelWidth">
                  <el-input
                    v-model="student.number"
                    autocomplete="off"
                    placeholder="请输入学号"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>

                <!-- <el-form-item label="分院：" :label-width="formLabelWidth">
                  <el-select v-model="student.college" placeholder="请选择分院">
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

                <el-form-item label="手机号：" :label-width="formLabelWidth">
                  <el-input
                    v-model="student.phone"
                    autocomplete="off"
                    placeholder="请输入手机号"
                    style="width: 500px;"
                  ></el-input>
                </el-form-item>-->
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMember">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name:'Member',
    data() {
      return {
        row:0,
        student: {
          number: ""
        },
        formLabelWidth: "100px",
        addDialogFormVisible: false,
        id: 1,

        memberList: [], //成员列表
        memState: 1,  //默认初始时状态为在社成员
        currentPage: 1, //当前页
        pageSize: 7,    //默认每页信息的数量
        total:100,    //默认获得数量为100条

        formInline: {
          user: "",
          region: "",
          date: ""
        },
        newData: {
          name: "谢霞",
          date: "",
          address: "内蒙古自治区 锡林郭勒盟 阿巴嘎旗",
          city: "浙江",
          phone: "13555253362",
          province: "上海",
          zip: 200333
        }
      };
    },

    components: {},

    created() {
      this.getClubMember(1);
    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },
      //得到成员信息
      getClubMember(state) {
        var id = this.id;
        this.memState=state;

        this.axios.get("http://localhost:8181/api/leader/member/"+this.id+"/"+this.memState).then(res => {
          this.memberList = res.data;
          this.currentPage=1;
          this.total=this.memberList.length;
        });
      },

      //监听页面数量的改变
      ChangeSize:function(pageSize){
        this.pageSize=pageSize;
      },

      //当前页面切换
      ChangePage: function(currentPage){
        this.currentPage = currentPage;

        this.axios.get("http://localhost:8181/api/leader/member/"+this.id+"/"+this.memState).then(res => {
          this.memberList = res.data;
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
      //编辑成员信息
      handleClick(row) {},

      //删除成员
      handleRemove(row) {
        this.row=row;
        this.$confirm("此操作将永久删除该成员, 是否继续?", "提示", {
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
    }
  };
</script>


<style scoped>
  .page{
    margin-top: 20px;
    /*margin-left: 12%;*/
  }
</style>

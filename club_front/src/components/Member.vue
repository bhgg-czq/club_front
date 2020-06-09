<template>
  <div>
        <el-main style="height: 642px">
          <div class="search">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="姓名">
                <el-input style="width: 150px" v-model="formInline.user" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker v-model="formInline.date" type="date" placeholder="查询此日期之前的记录"></el-date-picker>
              </el-form-item>
              <el-form-item label="分院">
                <el-select v-model="formInline.college" placeholder="分院">
                  <el-option label="" value=""></el-option>
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
                <el-table-column prop="id" label="学号" width="150" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="150" align="center"></el-table-column>
                <el-table-column prop="college" label="分院" width="220" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="180" align="center"></el-table-column>
                <el-table-column prop="joinDate" label="入社时间" width="180" align="center"></el-table-column>

                <el-table-column fixed="right" label="操作" width="200" align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row.id,scope.row.phone)" type="primary" size="mini">编辑</el-button>
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

          <!--增加社员的弹出框-->
          <div class="addDialog">
            <el-dialog
              title="添加社团成员"
              :visible.sync="addDialogFormVisible"
              style="width:1000px; left:300px; top:100px"
            >
              <el-form :model="student">
                <el-form-item label="学号：" :label-width="formLabelWidth">
                  <el-input
                    v-model="student.number"
                    autocomplete="off"
                    placeholder="请输入学号"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMember">确 定</el-button>
              </div>
            </el-dialog>
          </div>

          <!--编辑社员的弹出框-->
          <div class="editDialog">
            <el-dialog
              title="编辑社团成员"
              :visible.sync="editDialogFormVisible"
              style="width:1000px; left:300px; top:100px"
            >
              <el-form :model="edit">
                <el-form-item label="学号：" :label-width="formLabelWidth">
                  <el-input
                    v-model="edit.id"
                    autocomplete="off"
                    placeholder="edit.id"
                    :disabled="true"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>

                <el-form-item label="联系方式：" :label-width="formLabelWidth">
                  <el-input
                    v-model="edit.phone"
                    autocomplete="off"
                    placeholder="edit.phone"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editMember">确 定</el-button>
              </div>
            </el-dialog>
          </div>

        </el-main>
  </div>
</template>

<script>
  import moment, { now } from 'moment';
  export default {
    name:'Member',
    data() {
      return {
        row:0,
        student: {
          number: ""
        },
        edit:{
          id:'',
          phone:''
        },

        formLabelWidth: "100px",
        addDialogFormVisible: false,
        editDialogFormVisible: false,

        id: 1,

        memberList: [], //成员列表
        memState: 1,  //默认初始时状态为在社成员
        currentPage: 1, //当前页
        pageSize: 7,    //默认每页信息的数量
        total:100,    //默认获得数量为100条

        formInline: {
          user: "",
          college: "",
          date: ""
        },
        index:0
        
      };
    },

    components: {},

    created() {
      this.id=localStorage.getItem('id')
      this.memState=localStorage.getItem('state')

      this.getClubMember(this.memState);
    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        this.index=0
        console.log("选中");
      },
      //得到成员信息
      getClubMember(state) {
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
        if(this.index===0)

          this.axios.get("http://localhost:8181/api/leader/member/"+this.id+"/"+this.memState).then(res => {
            this.memberList = res.data;
          });

        else{
           this.axios({
          method: "post",
          url: "http://localhost:8181/api/leader/searchmember",
          data: {
            cid: this.id,
            username:this.formInline.user,
            joindate:this.formInline.date,
            collegename:this.formInline.college
          }
        }).then(res => {
          console.log(res.data)
          if(res.data.length!=0){
            this.memberList = res.data;
            this.total=this.memberList.length;
          }
          });
        }
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
            cid: this.id,
            number: this.student.number
          }
        }).then(res => {
          if( res.data == '添加成功'){
            this.$message({
              message: res.data
            });

            this.addDialogFormVisible=false
            this.getClubMember(1)
          }
          this.$message({
            message: res.data
          });
        });
      },

      //编辑成员信息
      handleClick(id,phone) {
        this.editDialogFormVisible=true;
        this.edit.id=id;
        this.edit.phone=phone;
      },
      editMember(){
        this.axios({
          method:'post',
          url:"http://localhost:8181/api/leader/editMember",
          data:{
            id:this.edit.id,
            phone:this.edit.phone
          }
        }).then(res=>{
          if(res.data==1){
            this.$message({
              message:"信息修改成功！"
            })
            this.edit={}
            this.getClubMember(1)
            this.editDialogFormVisible=false;
          }
        })
      },

      //删除成员
      handleRemove(row) {
        this.row=row;
        this.$confirm("此操作将永久删除该成员, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            console.log(row);
            this.axios({
              method: "post",
              url: "http://localhost:8181/api/leader/deletemember",
              //参数还没改
              data: {
                uid:this.row.id,
                cid:this.id
              }
            }).then(res => {
              this.getClubMember(1)
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
      //搜索成员
      handleSearch() {

        // if(this.formInline.date==="")
        //   let a=""
        this.index=1
        // this.formInline.date=moment(d).format("YYYY-MM-DD");
     //   if(this.formInline.date){
          console.log(this.formInline.date)
        // var d = new Date(this.formInline.date);
        // d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        // console.log(d);
        //}

        this.axios({
          method: "post",
          url: "http://localhost:8181/api/leader/searchmember",
          data: {
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

      toPassage(){
        this.$router.replace('/leader/passage')
      },

      onSubmit(row) {}
    }
  };
</script>


<style scoped>
  .page{
    margin-top:50px;
    margin-left: 500px;
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
  }
  img{
    margin: 30px 0;
  }
</style>

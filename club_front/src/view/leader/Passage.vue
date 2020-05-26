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
                    <router-link to="/leader/member"><el-menu-item index="1-1" @click="getClubMember(1)">社团成员</el-menu-item></router-link>
                    <router-link to="/leader/member"><el-menu-item index="1-2" @click="getClubMember(0)">过往成员</el-menu-item></router-link>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <router-link to="/leader/passage" slot="title">推送发布</router-link>
                </el-menu-item>
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
              <el-form-item >
                <el-input style="width: 150px" v-model="formInline.keyStr" placeholder="搜索关键字" @input="keyup"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleAdd">发布推送</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="card">
            <template>
              <el-table :data="passageList.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%">
                <el-table-column prop="pid" label="ID" width="55" ></el-table-column>
                <el-table-column prop="name" label="标题" width="180"></el-table-column>
                <el-table-column prop="content" label="内容介绍" width="370"></el-table-column>
                <el-table-column prop="url" label="推送链接" width="240"></el-table-column>
                <el-table-column prop="time" label="发布时间" width="110"></el-table-column>

                <el-table-column fixed="right" label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row.ppid)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleRemove(scope.row.pid)" type="danger" size="mini">删除</el-button>
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

          <!--发布内容弹出框-->
          <div class="dialogs">
            <el-dialog
              title="发布推送"
              :visible.sync="addDialogFormVisible"
              style="width:1000px; left:300px; top:100px"
            >
              <el-form :model="passage">

                <el-form-item label="标题：" :label-width="formLabelWidth">
                  <el-input
                    v-model="passage.name"
                    autocomplete="off"
                    placeholder="请输入标题"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="内容介绍：" :label-width="formLabelWidth">
                  <el-input
                    v-model="passage.content"
                    autocomplete="off"
                    placeholder="请输入内容（50字内）"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>
                <el-form-item label="链接：" :label-width="formLabelWidth">
                  <el-input
                    v-model="passage.url"
                    autocomplete="off"
                    placeholder="请输入链接"
                    style="width: 300px;"
                  ></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPassage">确 定</el-button>
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
    name:"Passage",
    data() {
      return {
        row:0,


        passage: {
          name: "",
          content:"",
          url:""
        },

        formLabelWidth: "100px",
        addDialogFormVisible: false,

        id: 1,  //社团id
        passageList: [], //成员列表

        currentPage: 1, //当前页
        pageSize: 7,    //默认每页信息的数量
        total:100,    //默认获得数量为100条

        //搜索栏
        formInline: { keyStr:""},

      };
    },

    components: {},

    created() {
      this.getPassage();
    },

    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },

      keyup(){
        if (this.formInline.keyStr=="") {
          this.getPassage();
        }
      },

      //得到推送信息
      getPassage() {
        this.axios.get("http://localhost:8181/api/passage/show1/"+this.id+"/"+this.currentPage).then(res => {
          this.formInline.keyStr="";
          this.passageList = res.data;
          this.total=this.passageList.length;
        });
      },

      //当前页面切换
      ChangePage: function(currentPage){
        this.currentPage = currentPage;
        this.getPassage();
      },
      //监听页面数量的改变
      ChangeSize:function(pageSize){
        this.pageSize=pageSize;
      },

      //发布推送
      handleAdd() {
        this.addDialogFormVisible = true;
      },

      addPassage:function(){
        var _this=this;

        this.axios({
          method: "post",
          url: "http://localhost:8181/api/passage/putup",
          data: {
            cid: _this.id,
            name:_this.passage.name,
            content:_this.passage.content,
            url:_this.passage.url,
            img:null
          }
        }).then(res => {
          if(res.data==1){
            this.$message({
              message: '发布成功！'
            });
            _this.addDialogFormVisible = false;
            _this.getPassage();
            _this.passage={};
          }

          else{
            this.$message({
              message: '发布失败！'
            });
          }

        });
      },

      //删除推送
      handleRemove(pid) {
        this.$confirm("此操作将永久删除该条推送, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.axios.get("http://localhost:8181/api/passage/delete/"+pid).then(res=>{
              if(res.data==1){
                this.getPassage();
                this.$message({
                  type: "info",
                  message: "删除成功！"
                });
              }
              else
                this.$message({
                  type: "info",
                  message: "删除失败！"
                });
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
            });
          });
      },

      //根据用户输入关键次进行搜索
      handleSearch() {
        //console.log(this.formInline.keyStr);
        var keyword=this.formInline.keyStr;
        if(keyword=="")
          this.$message({
            type: "info",
            message: "搜索词不能为空!"
          });
        else{
          this.axios.get("http://localhost:8181/api/passage/show2/"+this.id+"/"+keyword).then(res=>{
            this.currentPage=1;
            this.passageList=res.data;
            this.total=this.passageList.length;
          })
        }
      },


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

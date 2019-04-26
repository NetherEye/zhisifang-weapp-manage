<template>
  <div class="herder">
    <card>
      <div class="herder_top">
        <Button type="primary" style="margin-left:10px" @click="addScar(1)">创建新账户</Button>
        <Button type="primary" style="margin-left:10px" @click="addScar(2)">用户组权限菜单</Button>
      </div>
      <div>
        <Table :columns="columns11" :data="tableData" border></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" :current.sync="pageNumber" show-total :pageSize="pageSize" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
      <Modal v-model="useCar_modal" title="新增账户" footer-hide width="500" @on-cancel="cancel" center>
        <Form ref="formCustom" :model="formCustom" :label-width="80">
          <Row>
            <FormItem label="登入账户" prop="city">
              <Input v-model.trim="formCustom.username" :maxlength="30" placeholder="请输入登入账户"></Input>
            </FormItem>
            <FormItem label="使用人" prop="city">
              <Input v-model.trim="formCustom.nickName" :maxlength="30" placeholder="请输入使用人"></Input>
            </FormItem>
            <FormItem label="绑定手机号" prop="city">
              <Input v-model.trim="formCustom.mobile" :maxlength="30" placeholder="请输入绑定手机号"></Input>
            </FormItem>
            <FormItem label="账号权限" prop="city">
              <Select v-model.trim="formCustom.role">
                <Option v-for="item in Permissionlist" :value="item.id" :key="item.roleName">{{ item.roleName }}</Option>
              </Select>
            </FormItem>
            <div class="Button_base">
              <Button type="primary" @click="Submit(1)">提交</Button>
            </div>

          </Row>
        </Form>
      </Modal>
      <Modal v-model="jurisdiction_modal" title="用户组权限菜单" @on-cancel="cancel2" footer-hide width="900" center>
        <Form label-position="top">
          <Row>
            <Col span="12">
            <FormItem label="用户组" prop="city">
              <card>
                <Table :columns="organize" :data="Permissionlist" border></Table>
              </card>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="设置菜单权限" prop="city">
              <card>
                <Tree :data="c_roleCurrentAcc" show-checkbox multiple></Tree>
              </card>
            </FormItem>
            </Col>
          </Row>
          <div class="Button_base">
            <Button type="primary" @click="Submit(2)">提交</Button>
          </div>

        </Form>
      </Modal>
    </card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      Allmenu: [], //全部菜单
      modal: false, //新增弹框
      useCar_modal: false,
      jurisdiction_modal: false,
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      tableData: [],
      roleCurrentAcc: [], // 当前角色的权限
      formCustom: {
        username: '',
        role: '',
        nickName: '',
        mobile: ''
      },
      activeUpdateRoleId: '', // 当前修改的roleid
      // 账号权限
      Permissionlist: [

      ],
      model1: '',
      data10: [],
      // 用户组
      organize: [{
        title: '用户组ID',
        key: 'id',
        align: 'center'
      },
      {
        title: '用户组名称',
        key: 'roleName',
        align: 'center'
      },
      {
        title: '操作',
        key: 'name',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              on: {
                click: () => {
                  this.activeUpdateRoleId = row.id
                  this.$http.rq({
                    url: this.$commonApi.getRolePower + '/' + this.activeUpdateRoleId
                  }).then(res => {
                    if (res.code === 200) {
                      this.roleCurrentAcc = res.data
                    } else {
                      this.roleCurrentAcc = []
                      this.$Message.error(res.messsage)
                    }
                  })
                }
              }
            },
            '修改'
          )
        }
      }
      ],
      //
      columns11: [{
        title: '账号名称',
        key: 'username',
        align: 'center'
      },
      {
        title: '绑定手机号',
        key: 'mobile',
        align: 'center'
      },
      {
        title: '使用人',
        key: 'nickName',
        align: 'center'
      },

      {
        title: '禁用/启用',
        key: 'status',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: row.status == '已启用' ? 'success' : 'default',
                size: 'small'
              },
              on: {
                click: () => {
                  this.$Modal.confirm({
                    title: '操作提示',
                    content: row.status == '已启用' ? '是否禁用？' : '是否启动？',
                    onOk: () => {
                      this.$http.rq({
                        url: row.status == '已启用' ? this.$commonApi.endAcc + '/' + row.id : this.$commonApi.startAcc + '/' + row.id,
                        method: 'put'
                      }).then(res => {
                        if (res.code === 200) {
                          this.$Message.success(res.message)
                          this.getData()
                        } else {
                          this.$Message.error(res.messsage)
                        }
                      })
                    },
                    onCancel: () => {

                    }
                  });
                }
              }
            },
            row.status
          )
        }
      }

      ]
    }
  },
  mounted () { },
  created () {
    this.getData()
  },
  methods: {
    //全部菜单
    allmenu () {
      this.$http.rq({
        url: '/proxy/menu',
      }).then(res => {
        if (res.code === 200) {
          this.Allmenu = res.data
        } else {

        }
      })
    },
    //获取账户列表
    jurisdiction () {
      this.$http.rq({
        url: '/proxy/role',
      }).then(res => {
        if (res.code === 200) {
          this.Permissionlist = res.data
        } else {

        }
      })
    },
    //
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      this.$http.rq({
        url: '/proxy/account',
        data: par
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    //删除操作
    rejuet (row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>是否删除</p>',
        onOk: () => {
          this.$Message.info('Clicked ok')
        },
        onCancel: () => {
         
        }
      })
    },

    //清空表单
    cancel () {
      this.$tools.reset(this.formCustom)
      this.Permissionlist = []
    },
    cancel2 () {
      this.roleCurrentAcc = []
      this.Allmenu = []
      this.activeUpdateRoleId = ''
    },
    addScar (value) {
      if (value == 1) {
        // 获取用户类型列表
        this.jurisdiction()

        this.useCar_modal = true
      } else if (value == 2) {
        // 获取or更新用户类型列表
        this.jurisdiction()
        this.allmenu()
        this.jurisdiction_modal = true
      }
    },
    //获取用户权限菜单
    permissionsmenu () {

    },
    //提交表单
    Submit (value) {

      if (value === 1) {
        var flag = false
        if (this.$tools.check(this.formCustom)) {

          flag = true

        } else {
          this.$Message.error('请填写完整！');
          flag = false
          return
        }

        if (!(/^1[34578]\d{9}$/.test(this.formCustom.mobile))) {
          this.$Message.error('手机号码有误,请重填');
          return false;
        }
        let par = {
          username: this.formCustom.username,
          role: this.formCustom.role,
          nickName: this.formCustom.nickName,
          mobile: this.formCustom.mobile
        }
        this.$http.rq({
          url: '/proxy/account',
          method: 'post',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message);
            this.useCar_modal = false
            this.getData();
            this.account()
          } else {
            this.$Message.info(res.message);
          }
        })
      } else {

        let str = '';
        this.c_roleCurrentAcc.forEach(a => {
          var f = false;
          a.children.forEach(b => {
            if (b.checked) {
              f = true
              str += b.id + ','
            }
          })
          if (f) {
            str += a.id + ','
          }
        })


        let par = {
          roleId: this.activeUpdateRoleId,
          menuIds: str.slice(0, -1)
        }
        this.$http.rq({
          url: this.$commonApi.updateRolePower,
          method: 'post',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message);
          } else {
            this.$Message.info(res.message);
          }
        })
      }
    },
    changePage () {
      this.getData()
    }
  },
  computed: {
    c_roleCurrentAcc () {
      let result = []
      this.Allmenu.forEach(p => {
        let obj = {
          id: p.id,
          title: p.menuName,
          checked: false,
          children: []
        }
        p.childMenus.forEach(c => {
          obj.children.push({
            id: c.id,
            title: c.menuName,
            checked: false,
          })
        })
        result.push(obj)
      })
      result.forEach(p => {
        for (let i = 0, len = this.roleCurrentAcc.length; i < len; i++) {
          if (this.roleCurrentAcc[i].id == p.id) {
            p.checked = true
            p.children.forEach(c => {
              for (let j = 0, len2 = this.roleCurrentAcc[i].childMenus.length; j < len2; j++) {
                if (c.id == this.roleCurrentAcc[i].childMenus[j].id) {
                  c.checked = true
                }
              }
            })
          }
        }
      })
      return result

    }
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;

  .herder_top {
    // height: 60px;
    padding: 20px;
    // display: flex;
    // justify-content: space-around;
  }
}
</style>

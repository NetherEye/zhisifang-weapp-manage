<template>
  <div class="herder">
    <card>
      <div class="top">
        <Button type="primary" style="margin-left:10px" @click="addScar">新增热门搜索</Button>
      </div>
      <div>
        <Table :columns="columns11" :data="tableData" border></Table>
      </div>
    </card>
    <Modal v-model="useCar_modal" title="创建热门搜索" footer-hide width="500" @on-cancel="cancel" center>
      <Form ref="formCustom" :model="formCustom" :label-width="100">
        <Row>
          <FormItem label="请输入热门搜索" prop="city">
            <Input v-model="formCustom.keyWords" :maxlength="30" placeholder="请输入热门搜索"></Input>
          </FormItem>
          <div class="Button_base">
            <Button type="primary" @click="Submit">提交</Button>
          </div>

        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import fetch from '../assets/tools/http'
import commonApi from '../assets/api/common.js'
export default {
  data () {
    return {
      formValidate: {
        beginTime: '',
        endTime: ''
      },
      useCar_modal: false,
      formCustom: {
        keyWords: ''
      },
      tableData: [],
      columns11: [
        {
          title: '关键词',
          key: 'keyWords',
          align: 'center'
        },
        {
          title: '创建人',
          key: 'creator',
          align: 'center'
        },
        {
          title: '增加日期',
          key: 'createTime',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let tiem = row.createTime.slice(0, 10)
            return h(
              'div',
              {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                  }
                }
              },
              row.shelfTime == '' ? row.createTime : tiem
            )
          }
        },
        {
          title: '启用/停用',
          key: 'status',
          align: 'center',
          render: (h, params) => {

            return h('div', [
              h('Button', {
                props: {
                  size: 'small'
                },
                style: {
                  marginRight: '10px',
                  display: (params.row.status == '1') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    this.showModal(params)
                  }
                }
              }, '已停用'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '10px',
                  display: (params.row.status == '0') ? "none" : "inline-block",
                },
                on: {
                  click: () => {
                    this.hideModal(params)
                  }
                }
              }, '已启用'),

            ])
          }
        },
        {
          title: '删除',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h(
              'Button',
              {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.listID = row.id
                    this.rejuet(params)
                  }
                }
              },
              '删除'
            )
          }
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    //不显示
    hideModal (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>停用该热门搜索词？</p>',
        onOk: () => {
          let par = {
            id: this.imgID,
            status: '0'
          }
          this.$http.rq({
            url: commonApi.search,
            method: 'put',
            data: par
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getData()
            } else {
              this.$Message.error(res.message);
            }

          })
        },
        onCancel: () => {
        }
      });
    },
    //显示
    showModal (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>启用该热门搜索词？</p>',
        onOk: () => {
          let par = {
            id: this.imgID,
            status: '1'
          }
          this.$http.rq({
            url: commonApi.search,
            method: 'put',
            data: par
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message);
              this.getData()
            } else {
              this.$Message.error(res.message);
            }

          })
        },
        onCancel: () => {
        }
      });
    },
    getData () {
      let par = {
        beginTime: this.formValidate.beginTime,
        endTime: this.formValidate.endTime,
      }
      this.$http.rq({
        url: commonApi.searchListNopage,
        data: par
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        } else {
          this.tableData = []
        }

      })
    },
    //新增
    Submit () {
      if (this.$tools.check(this.formCustom)) {
        let par = {
          keyWords: this.formCustom.keyWords,
        }
        this.$http.rq({
          url: commonApi.search,
          method: 'post',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message);
            this.getData()
            this.formCustom = {
              keyWords: ''
            }
            this.useCar_modal = false
          } else {
            this.$Message.error(res.message);
          }

        })
      } else {
        this.$Message.error('请填写完整！');
      }
    },
    //删除操作
    rejuet (row) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>是否删除?</p>',
        onOk: () => {
          this.$http.rq({
            url: commonApi.search,
            method: 'Delete',
            data: {
              id: this.listID
            }
          }).then(res => {
            if (res.code === 200) {

              this.$Message.success(res.message)
              this.getData()
            } else {
              this.$Message.error(res.message)
            }

          })
        },
        onCancel: () => {

        }
      })
    },
    //清空表单
    cancel () {
      this.formCustom = {
        keyWords: ''
      }
    },
    //搜索
    addScar () {
      this.useCar_modal = true
    },
    //日期变化
    changePage () { }
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;
  .top {
    height: 60px;
    display: flex;
    align-items: center;
  }
}
</style>


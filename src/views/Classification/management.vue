<template>
  <div class="herder">
    <div class="herd">
      <div class="card">
        <div class="left card_right">
          <Button type="primary" @click="addScar">新增标签</Button>
        </div>
        <div class="left">
          <Table border :columns="columns1" class='Table' :data="tableData"></Table>
        </div>
      </div>
    </div>
    <Modal v-model="useCar_modal" title="修改标签" footer-hide width="500" center @on-cancel="cancel">
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <Row>
          <Col span="20">
          <FormItem label="请输入标签" prop="city">
            <Input v-model="formCustom.tagName" :maxlength="20" placeholder="请输入标签"></Input>
          </FormItem>
          </Col>
          <Col span="4">
          <Button type="primary" style="margin-left:10px;" @click="Submit">提交</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal v-model="addmodal" title="新增标签" footer-hide width="500" center @on-cancel="cancel">
      <Form ref="formCustom" :model="formCustom" :label-width="80">
        <Row>
          <Col span="20">
          <FormItem label="请输入标签" prop="city">
            <Input v-model="formCustom.tagName" :maxlength="20" placeholder="请输入标签"></Input>
          </FormItem>
          </Col>
          <Col span="4">
          <Button type="primary" style="margin-left:10px;" @click="addSubmit">提交</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import fetch from '../../assets/tools/http'
import commonApi from '../../assets/api/common.js'
export default {
  data () {
    return {
      useCar_modal: false, //弹框
      addmodal: false,
      tableData: [], //列表
      formCustom: {
        tagName: ''
      },
      columns1: [
        {
          title: '标签数量名称',
          align: 'center',
          key: 'tagName'
        },
        {
          title: '标签相关景区',
          align: 'center',
          key: 'scenicCount'
        },
        {
          title: '更改标签名称',
          align: 'center',
          key: 'address',
          render: (h, params) => {
            let row = params.row
            return h(
              'Button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.imgSrc = row.id
                    this.formCustom.tagName = row.tagName
                    this.useCar_modal = true
                  }
                }
              },
              '更改'
            )
          }
        },
        {
          title: '操作',
          key: 'address',
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
                    this.imgSrc = row.id
                    this.rejuet(params)
                  }
                }
              },
              '删除'
            )
          }
        },
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    //删除操作
    rejuet (row) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>是否删除?</p>',
        onOk: () => {
          this.$http.rq({
            url: commonApi.addTag,
            method: 'Delete',
            data: {
              id: this.imgSrc
            }
          }).then(res => {
            if (res.code === 200) {
              this.getData()
              this.$Message.success(res.message)
            } else {
              this.$Message.error(res.message)
            }

          })
        },
        onCancel: () => {

        }
      })
    }, getData () {
      this.$http.rq({
        url: commonApi.addTag,
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.title = res.title
        } else {
          this.tableData = []
          this.title = 0
        }

      })
    },
    //清空表单
    cancel () {
      this.formCustom.tagName = ''
    },
    //增加标签
    addScar () {
      this.addmodal = true
    },
    addSubmit () {
      if (this.$tools.check(this.formCustom)) {
        let par = {
          tagName: this.formCustom.tagName,
        }
        this.$http.rq({
          url: commonApi.addTag,
          data: par,
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getData()
            this.formCustom = {
              tagName: ''
            },
              this.addmodal = false
          } else {
            this.$Message.error(res.message);
          }
        })
      } else {
        this.$Message.error('请填写完整')
      }

    },
    //提交分类
    Submit () {
      if (this.$tools.check(this.formCustom)) {
        let par = {
          id: this.imgSrc,
          tagName: this.formCustom.tagName
        }
        this.$http.rq({
          url: commonApi.addTag,
          data: par,
          method: 'put'
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getData()
            this.useCar_modal = false
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.error('请填写完整')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.herder {
  height: 100%;
  .herd {
    height: 100%;
    .card {
      .card_right {
        padding-bottom: 20px;
      }
    }
  }
}
.Table {
  max-height: 617px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>


<template>
  <div class="herder">
    <card>
      <div class="top">
        <div class="top-left">
          <Button type="primary" @click="addScar('add')">新增Bannner</Button>
        </div>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" :current="pageNumber" show-total :pageSize="pageSize" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
      <Modal v-model="modal" :title="Bannner" width="800" footer-hide @on-ok="ok" @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :label-width="80">
          <FormItem label="标题" prop="city">
            <Input v-model="formValidate.title" :maxlength="30" placeholder="标题"></Input>
          </FormItem>
          <FormItem label="上传图片">
            <div class="demo-upload-list" v-if="formItem.coverUrl">
              <template>
                <img :src="formItem.coverUrl" style="width: 100px;height: 100px;">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(formItem.coverUrl)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                </div>
              </template>
            </div>
            <Upload ref="upload" :before-upload="beforeUpload" :on-progress="uploadPro" :data="signData" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" :action="fileUrl" type="drag" style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
              <img :src="imgName" v-if="visible" style="width: 100%">
            </Modal>
          </FormItem>
          <FormItem label="链接" prop="city">
            <Input v-model="formValidate.url" :maxlength="30" placeholder="链接"></Input>
          </FormItem>
          <Row>
            <i-col span="12">
              <FormItem label="上架日期">
                <Date-picker @on-change="getStartTime" :editable="false" :options="options3" type="date" placeholder="选择日期" v-model="formValidate.shelfTime" format="yyyy-MM-dd" :value.sync="formValidate.date"></Date-picker>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="下架日期">
                <Date-picker @on-change="getEndTime" :editable="false" :options="options3" type="date" placeholder="选择日期" v-model="formValidate.obtainTime" format="yyyy-MM-dd" :value.sync="formValidate.date"></Date-picker>
              </FormItem>
            </i-col>
          </Row>
          <div class="Button_base">
            <template v-if="this.Bannner=='新增Bannner'">
              <Button type="primary" @click="Submin">提交</Button>
            </template>
            <template v-if="this.Bannner=='修改Bannner'">
              <Button type="primary" @click="subEdit">修改</Button>
            </template>

          </div>
        </Form>
      </Modal>
    </card>
  </div>
</template>
<script>
import fetch from '../assets/tools/http'
import commonApi from '../assets/api/common.js'
export default {
  data () {
    return {
      Bannner: '', //弹框
      imgName: '',
      uploadList: [],
      signData: {}, // 上传签名
      visible: false,
      pding: [],
      fileUrl: '',
      formItem: {
        coverUrl: ''
      },
      //弹框form
      formValidate: {
        title: '',
        url: '',
        shelfTime: '',
        obtainTime: '',
      },
      //日期格式
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      modal: false,
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      tableData: [

      ],
      columns1: [
        {
          title: '标题',
          key: 'title',
          align: 'center'
        },
        {
          title: '图片',
          key: 'photo',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {

              },
            }, [
                h('img', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  attrs: {
                    src: params.row.photo, style: 'width: 100px;height: 60px'
                  }
                })
              ]);
          }
        },
        {
          title: '链接',
          key: 'url',
          align: 'center'
        },
        {
          title: '添加时间',
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
          title: '预设上架时间',
          key: 'shelfTime',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let tiem = row.shelfTime.slice(0, 10)
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
              row.shelfTime == '' ? row.shelfTime : tiem
            )
          }
        },
        {
          title: '预设下架时间',
          key: 'obtainTime',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let tiem = row.obtainTime.slice(0, 10)
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
              row.shelfTime == '' ? row.obtainTime : tiem
            )
          }
        },

        {
          title: '编辑操作',
          key: 'address',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h(
              'Button',
              {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.imgSrc = row.id
                    this.addScar('edit')
                  }
                }
              },
              '编辑'
            )
          }
        },
        // {
        //   title: '上架/下架',
        //   key: 'address',
        //   align: 'center',
        //   render: (h, params) => {
        //     let row = params.row
        //     return h(
        //       'Button',
        //       {
        //         props: {
        //           type: 'error',
        //           size: 'small'
        //         },
        //         on: {
        //           click: () => {
        //             this.rejuet(params)
        //           }
        //         }
        //       },
        //       '下架'
        //     )
        //   }
        // }
      ]
    }
  },
  created () {
    this.getData()
    this.getFileSign()
  },
  methods: {
    //提交
    Submin () {
      var strRegex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      var flag = false
      if (this.$tools.check(this.formValidate)) {
        let par = {
          title: this.formValidate.title,
          url: this.formValidate.url,
          photo: this.formItem['coverUrl'],
          shelfTime: this.formValidate.shelfTime,
          obtainTime: this.formValidate.obtainTime,
        }
        if (this.formItem['coverUrl'] === '') {
          this.$Message.error('图片不能为空')
          flag = false
          return
        } else {
          flag = true
        }
        if (!strRegex.test(this.formValidate.url)) {
          this.$Message.error('链接地址不正确')
          flag = false
          return
        } else {
          flag = true
        }
        this.$http.rq({
          url: commonApi.banner,
          data: par,
          method: 'post',
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getData()
            this.formValidate = {
              title: '',
              url: '',
              shelfTime: '',
              obtainTime: '',
            },
              this.formItem = {
                coverUrl: ''
              }
            this.modal = false
          } else {
            this.$Message.error(res.message)
          }

        })
      } else {
        this.$Message.error('请填写完整！')
      }


    },
    //修改
    subEdit () {
      var strRegex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      var flag = false
      if (this.$tools.check(this.formValidate)) {
        let par = {
          id: this.imgSrc,
          title: this.formValidate.title,
          url: this.formValidate.url,
          photo: this.formItem['coverUrl'],
          shelfTime: this.formValidate.shelfTime,
          obtainTime: this.formValidate.obtainTime,
        }
        if (!strRegex.test(this.formValidate.url)) {
          this.$Message.error('链接地址不正确')
          flag = false
          return
        } else {
          flag = true
        }
        if (this.formItem['coverUrl'] === '') {
          this.$Message.error('图片不能为空')
          flag = false
          return
        } else {
          flag = true
        }
        this.$http.rq({
          url: commonApi.upBanner,
          data: par,
          method: 'put',
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.getData();
            this.formValidate = {
              title: '',
              url: '',
              shelfTime: '',
              obtainTime: '',
            },
              this.formItem = {
                coverUrl: ''
              }
            this.modal = false
          } else {
            this.$Message.error(res.message)
          }

        })
      } else {
        this.$Message.error('请填写完整！')
      }
    },
    //获取签名
    getFileSign () {
      this.$http.rq({
        url: commonApi.getFileSign
      }).then(res => {
        if (res.code === 200) {
          this.signData = {
            key: res.data.dir,
            policy: res.data.policy,
            OSSAccessKeyId: res.data.accessId,
            'success_action_status': '200',
            signature: res.data.signature
          }
          this.fileUrl = res.data.host
          this.photo_modal = true
        } else {
          this.$Message.error('获取上传签名失败')
        }
      })
    },
    beforeUpload (file) {
      this.signData['key'] = this.signData['key'] + '/' + this.$tools.getGUID() + '.' + file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
      return true
    },
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove () {
      this.formItem = {
        coverUrl: ''
      }
    },
    handleSuccess (res) {
      this.formItem.coverUrl = this.fileUrl + '/' + this.signData.key
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleSubmit () {
      if (tools.check(this.formValidate)) {
        let par = {
          ...this.formValidate
        }
        par['content'] = JSON.stringify(par['content'])
        this.$http.rq({
          url: articleApi.news,
          method: 'post',
          data: par
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.formValidate = {
              scenicName: '',
              lat: '',
              lon: '',
              coverUrl: '',
            };
          } else {
            this.$Message.error(res.message)
          }
        })

      } else {
        this.$Message.warning('请填写完整！')
      }

    },
    uploadPro (e, file) {
      if (this.pding.length === 0) {
        var percent = {
          val: e.percent,
          not: file.uid
        }
        if (e.percent >= 100) {
          return
        }
        this.pding.push(percent)
        this.$Notice.info({
          title: '上传进度（' + file.name + '）',
          duration: 0,
          name: percent.not,
          top: 100,
          render: h => {
            return h('Progress', {
              props: {
                percent: percent.val,
              }
            })
          }
        });


      } else {
        let f = false
        for (let i = 0, len = this.pding.length; i < len; i++) {
          if (this.pding[i].not == file.uid) {
            if (e.percent >= 100) {
              this.$Notice.close(this.pding[i].not)
              this.pding.splice(i, 1)
            } else {
              this.pding[i].val = e.percent
            }
            f = true
            break
          }
        }
        if (!f) {
          var percent = {
            val: e.percent,
            not: file.uid
          }
          if (e.percent >= 100) {
            return
          }
          this.pding.push(percent)
          this.$Notice.info({
            title: '上传进度',
            duration: 0,
            name: percent.not,
            top: 100,
            render: h => {
              return h('Progress', {
                props: {
                  percent: percent.val,
                }
              })
            }
          });

        }

      }
    },
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      this.$http.rq({
        url: commonApi.bannerList,
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
        title: '确认下架',
        content: '<p>是否下架</p>',
        onOk: () => {
          this.$Message.info('Clicked ok')
        },
        onCancel: () => {
        }
      })
    },
    //清空表单
    cancel () {
      this.formValidate.title = ''
      this.formValidate.url = ''
      this.formValidate.shelfTime = ''
      this.formValidate.obtainTime = ''
      this.formItem = {
        coverUrl: ''
      }
    },
    // 确认
    ok () {
    },
    //日期变化
    getEndTime (startTime) {
      this.formValidate.obtainTime = startTime
    },
    getStartTime (startTime) {
      this.formValidate.shelfTime = startTime
    },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    //新增
    addScar (val) {
      if (val === 'add') {
        this.Bannner = '新增Bannner'
        this.modal = true
      } else {
        this.Bannner = '修改Bannner'
        this.$http.rq({
          url: commonApi.banner + '/' + this.imgSrc,
        }).then(res => {
          if (res.code === 200) {
            this.formValidate.title = res.data.title,
              this.formValidate.url = res.data.url,
              this.formItem.coverUrl = res.data.photo
            this.formValidate.shelfTime = res.data.shelfTime.slice(0, 10),
              this.formValidate.obtainTime = res.data.obtainTime.slice(0, 10)
          } else {

          }
        })
        this.modal = true
      }
    },
    //图片格式
    handleFormatError () { },
    //图片大小
    handleMaxSize () { },
    //  限制图片张数
    handleBeforeUpload () { }
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;
  .top {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      // width: 20%;
      // display: flex;
      // justify-content: space-between;
    }
    .top_right {
      width: 80%;
    }
  }
}
</style>

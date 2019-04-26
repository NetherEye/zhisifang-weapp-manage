<template>
  <div class="herder">
    <card class="card">
      <div class="top">
        <div class="top-left">
          <Button type="primary" @click="newly('add')">新增景区</Button>
          <Input style="margin-left:10px;" v-model="formValidate.scenicName" clearable placeholder="请输入景区名称" />
          <Button type="primary" style="margin-left:20px" @click="seeabout">确定</Button>
        </div>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" :current="pageNumber" show-total @on-change="changePage"></Page>
          </div>
        </div>
      </div>
      <Modal v-model="modal" :title="scenicarea" width="800" scrollable footer-hide @on-cancel="cancel">
        <Form ref="formValidate" :model="formValidate" :label-width="100">
          <FormItem label="地图检索" v-show="scenicarea=='新增景区'">
            <Row>
              <Col span="8">
              <Select v-model="city" filterable style="width:200px">
                <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
              </Select>
              </Col>
              <Col span="8">
              <Input v-model.trim="adress" @on-search="seachSite" search placeholder="请输入" />
              </Col>
            </Row>
            <Row style="margin: 10px 0;" id="infoDiv">
            </Row>
            <Row style="margin-top: 10px;">
              <div id="map" style="width: 600px;height: 300px;"></div>
            </Row>
          </FormItem>
          <FormItem label="景区名称">
            <Input v-model.trim="formValidate.scenicName" :maxlength="30" @on-search="seachSite" search placeholder="景区名称" />
          </FormItem>
          <FormItem label="经纬度" v-show="scenicarea=='新增景区'">
            <Row>
              <Col span="12">
              <Input v-model.number="formValidate.lat" placeholder="点击地图标记获取" />
              </Col>
              <Col span="12">
              <Input v-model.number="formValidate.lon" placeholder="点击地图标记获取" />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="景区地址">
            <Input v-model="formValidate.address" placeholder="景区地址" />
          </FormItem>
          <FormItem label="景区分类">
            <Select v-model="formValidate.scenicTypeId" clearable>
              <Option v-for="item in Type" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="景区介绍">
            <Input v-model.trim="formValidate.introduction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="景区介绍"></Input>
          </FormItem>
          <FormItem label="一句话介绍">
            <Input v-model.trim="formValidate.summary" :maxlength="30" clearable placeholder="一句话介绍"></Input>
          </FormItem>
          <FormItem label="开放时间">
            <Col span="24">
            <TimePicker format="HH:mm" :editable='false' v-model.trim='formValidate.openTime' placeholder="开始时间"></TimePicker>
            <TimePicker format="HH:mm" :editable='false' v-model.trim='formValidate.endTime' placeholder="结束时间"></TimePicker>
            </Col>
          </FormItem>
          <FormItem label="门票售价">
            <Col span="">
            <InputNumber :min="0" :max="9999" style="width:187px" :formatter="value => `${value}${value === '' ? '' : '元'}`" :active-change="false" v-model="formValidate.ticketPrice"></InputNumber>
            </Col>
          </FormItem>
          <FormItem label="公交路线">
            <Col span="">
            <Input :active-change="false" v-model="formValidateone.busRoutes" placeholder="公交路线"></Input>
            </Col>
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
          <FormItem label="景区标签">
            <Select v-model="sceniclabel" clearable multiple @on-change='constRaint(sceniclabel)'>
              <Option v-for="item in Tag" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联景区管理员账户" :label-width="140">
            <Select v-model="formValidate.scenicAdminId" clearable>
              <Option v-for="item in jieShuoList" :value="item.id" :key="item.id">{{ item.nickName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="景区收入提成" :label-width="140">
            <Row>
              <Col span="">
              <InputNumber :min="0" :max="100" style="width:150px" :formatter="value => `${value}${value === '' ? '' : '%'}`" :active-change="false" v-model="formValidate.incomePercentage"></InputNumber>
              </Col>
            </Row>

          </FormItem>
          <div class="Button_base">
            <template v-if="scenicarea=='新增景区'">
              <Button type="primary" @click="Submin">保存</Button>
            </template>
            <template v-else>
              <Button type="primary" @click="Modify">修改</Button>
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
      city: '贵州',
      adress: '',
      cityList: [
        '四川',
        '云南',
        '贵州',
      ],
      jieShuoList: [],
      imgName: '',
      scenicarea: '',
      Tag: [], //标签
      Type: [], //景区类型
      sceniclabel: [],
      signData: {}, // 上传签名
      visible: false,
      pding: [],
      fileUrl: '',
      formItem: {
        coverUrl: ''
      },
      formValidateone: {
        busRoutes: '', //公交路线
      },
      //弹框form
      formValidate: {
        endTime: '',
        incomePercentage: 0,
        introduction: '',
        openTime: '',
        scenicAdminId: '',
        scenicName: '',
        scenicTypeId: '',
        summary: '',
        ticketPrice: 0,
        lon: '',
        lat: '',
        address: '',
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
      tableData: [],
      columns1: [{
        title: '景区名称',
        key: 'scenicName',
        align: 'center'
      },
      {
        key: 'typeName',
        align: 'center',
        width: '115px',
        renderHeader: (h, params) => {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-arrow-dropup',
              },
              style: {
                fontSize: '18px',
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.orderType = '1'
                  this.pageNumber = 1
                  this.getData()

                }
              }
            }),
            h('strong', '景区分类'),
          ])
        }

      },
      {
        title: '关联景区账户',
        key: 'scenicAdminId',
        align: 'center',
        width: '115px',

      },
      {
        title: '景区提成',
        width: '85px',
        key: 'incomePercentage',
        align: 'center'
      },
      {
        key: 'popularity',
        align: 'center',
        width: '115px',
        renderHeader: (h, params) => {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-arrow-dropup',
              },
              style: {
                fontSize: '18px',
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.orderType = '2'
                  this.pageNumber = 1
                  this.getData()
                }
              }
            }),
            h('strong', '实际人气'),
          ])
        }
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-arrow-dropup',
              },
              style: {
                fontSize: '18px',
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.orderType = '3'
                  this.pageNumber = 1
                  this.getData()
                }
              }
            }),
            h('strong', '增加人气'),
          ])
        },
        key: 'addPopularity',
        align: 'center',
        width: '115px',

        render: (h, params) => {
          let row = params.row
          let _this = this
          return h('div', [
            h(
              'InputNumber', {
                props: {
                  max: 1000000,
                  min: 0,
                  value: row.addPopularity,
                  step: 1,
                  formatter: value => `${value}`,
                  'active-change': false
                },
                on: {
                  'on-change' (v) {
                    row['alwaysPopular'] = _this.$tools.add(v, row.popularity)
                    params.row.addPopularity = v;
                  }
                }
              }
            )
          ])
        }
      },
      {
        title: '总人气',
        key: 'alwaysPopular',
        align: 'center',
      },
      {
        key: 'listen',
        align: 'center',
        width: '115px',

        renderHeader: (h, params) => {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-arrow-dropup',
              },
              style: {
                fontSize: '18px',
              },
              on: {
                click: () => {
                  this.orderType = '4'
                  this.pageNumber = 1
                  this.getData()
                }
              }
            }),
            h('strong', '实际收听量'),
          ])
        }
      },
      {
        // title: '增加收听量',
        renderHeader: (h, params) => {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-arrow-dropup',
              },
              style: {
                fontSize: '18px',
              },
              on: {
                click: () => {
                  this.orderType = '5'
                  this.pageNumber = 1
                  this.getData()
                }
              }
            }),
            h('strong', '增加收听量'),
          ])
        },
        align: 'center',
        width: '115px',

        render: (h, params) => {
          let row = params.row
          let _this = this
          return h('div', [
            h(
              'InputNumber', {
                props: {
                  max: 1000000,
                  min: 0,
                  value: row.addListen,
                  step: 1,
                  formatter: value => `${value}`,
                  'active-change': false
                },
                on: {
                  'on-change' (v) {
                    row['alwayslisten'] = _this.$tools.add(v, row.listen)
                    params.row.addListen = v;
                  }
                }
              }
            )
          ])
        }
      },
      {
        title: '总收听量',
        key: 'alwayslisten',
        align: 'center',

      },
      {
        title: '景点数量',
        key: 'spotCount',
        align: 'center'
      },
      {
        title: '是否推荐搜索',
        key: 'home',
        align: 'center',
        width: '110px',

        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '10px',
                display: (params.row.home == false) ? "none" : "inline-block",
              },
              on: {
                click: () => {
                  this.showPicModal(params)
                }
              }
            }, '是'),
            h('Button', {
              props: {
                size: 'small'
              },
              style: {
                marginRight: '10px',
                display: (params.row.home == true) ? "none" : "inline-block",
              },
              on: {
                click: () => {
                  this.Notrecommend(params)
                }
              }
            }, '否'),

          ])
        }
      },

      {
        title: '编辑操作',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.compile(params)
                }
              }
            },
            '编辑'
          )
        }
      },
      {
        title: '删除',
        align: 'center',
        render: (h, params) => {
          let row = params.row
          return h(
            'Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.rejuet(params)
                }
              }
            },
            '删除'
          )
        }
      },
      {
        title: '是否显示',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                size: 'small'
              },
              style: {
                marginRight: '10px',
                display: (params.row.display == true) ? "none" : "inline-block",
              },
              on: {
                click: () => {
                  this.showModal(params)
                }
              }
            }, '否'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              style: {
                marginRight: '10px',
                display: (params.row.display == false) ? "none" : "inline-block",
              },
              on: {
                click: () => {
                  this.hideModal(params)
                }
              }
            }, '是'),

          ])
        }
      },
      {
        title: '保存',
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
                  this.imgSrc = row.id
                  this.preserve(params)
                }
              }
            },
            '保存'
          )
        }
      }
      ],
      imgID: '',
      Map: null,
      searchService: null,
      markers: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    preserve (params) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>是否保存当前修改人气值、收听量操作</p>',
        onOk: () => {
          let par = {
            id: params.row.id,
            addListen: params.row.addListen,
            addPopularity: params.row.addPopularity,
            scenicName: params.row.scenicName,
          }
          this.$http.rq({
            url: commonApi.scenic,
            data: par,
            method: 'put'
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
      });
    },
    getAllJieShuo () {
      this.$http.rq({
        url: this.$commonApi.getPeople,
        data: {
          roleId: 4
        }
      }).then(res => {
        if (res.code === 200) {
          this.jieShuoList = res.data
        } else {
          this.$Message.error('获取所有解说员失败')
        }
      })
    },
    //限制输入空个数
    constRaint (sceniclabel) {
      if (sceniclabel.length == 3) {
        return
      }
    },
    //不显示
    hideModal (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>在景区页面上隐藏该景区？</p>',
        onOk: () => {
          let par = {
            id: this.imgID,
            isHide: 'false'
          }
          this.$http.rq({
            url: commonApi.scenicisHide,
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
        onCancel: () => { }
      });
    },
    //显示
    showModal (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>在景区页面上显示该景区？</p>',
        onOk: () => {
          let par = {
            id: this.imgID,
            isHide: 'true'
          }
          this.$http.rq({
            url: commonApi.scenicisHide,
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
        onCancel: () => { }
      });
    },
    //不推荐
    Notrecommend (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>设置为推荐搜索？</p>',
        onOk: () => {
          let par = {
            id: this.imgID,
            isHome: 'true'
          }
          this.$http.rq({
            url: commonApi.scenicisHome,
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
        onCancel: () => { }
      });
    },
    //推荐
    showPicModal (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>取消推荐搜索？</p>',
        onOk: () => {
          let par = {
            id: this.imgID,
            isHome: 'false'
          }
          this.$http.rq({
            url: commonApi.scenicisHome,
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
        onCancel: () => { }
      });
    },
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

    //清空表单
    cancel () {
      this.city = '',
        this.adress = '',
        this.formValidateone = {
          busRoutes: '', //公交路线
        }
      this.formValidate = {
        endTime: '',
        incomePercentage: 0,
        introduction: '',
        openTime: '',
        scenicAdminId: '',
        scenicName: '',
        scenicTypeId: '',
        summary: '',
        ticketPrice: 0,
        lon: '',
        lat: '',
        address: '',
      },
        this.sceniclabel = []
      this.formItem = {
        coverUrl: ''
      }
    },
    // 编辑景区
    compile (row) {
      this.imgID = row.row.id
      this.getAllJieShuo();
      this.getFileSign()
      this.accesstype()
      this.accesstag()
      this.scenicarea = '编辑景区'
      this.$http.rq({
        url: commonApi.scenic + '/' + this.imgID,
      }).then(res => {
        if (res.code === 200) {
          this.formValidate.scenicName = res.data.scenicName,
            this.formValidate.scenicTypeId = res.data.scenicTypeId,
            this.formValidate.introduction = res.data.introduction,
            this.formValidate.summary = res.data.summary,
            this.formValidate.ticketPrice = res.data.ticketPrice,
            this.formValidate.openTime = res.data.openTime,
            this.formItem.coverUrl = res.data.photo,
            this.formValidate.endTime = res.data.endTime,
            this.formValidate.lat = res.data.lat,
            this.formValidate.lon = res.data.lon,
            this.formValidate.address = res.data.address,
            this.formValidateone.busRoutes = res.data.busRoutes,
            this.formValidate.incomePercentage = res.data.incomePercentage,
            this.formValidate.scenicAdminId = res.data.scenicAdminId
          let result = res.data.scenicTagIds ? res.data.scenicTagIds.split(',') : [];
          this.sceniclabel = []
          result.forEach(a => {
            this.sceniclabel.push(Number(a))
          })

        } else {

        }
      })
      this.modal = true
    },
    //获取类型
    accesstype () {
      this.$http.rq({
        url: '/proxy/api/type',
        method: 'get',
      }).then(res => {
        if (res.code === 200) {
          this.Type = res.data
        } else {

        }
      })
    },
    //获取标签
    accesstag () {
      this.$http.rq({
        url: '/proxy/api/tag',
        method: 'get',
      }).then(res => {
        if (res.code === 200) {
          this.Tag = res.data
        } else {

        }
      })
    },
    //新增景区
    Submin () {
      var flag = false
      if (this.$tools.check(this.formValidate)) {
        let par = {
          busRoutes: this.formValidateone.busRoutes,
          endTime: this.formValidate.endTime,
          introduction: this.formValidate.introduction,
          scenicName: this.formValidate.scenicName,
          scenicTypeId: this.formValidate.scenicTypeId,
          introduction: this.formValidate.introduction,
          summary: this.formValidate.summary,
          address: this.formValidate.address,
          openTime: this.formValidate.openTime,
          ticketPrice: this.formValidate.ticketPrice,
          photo: this.formItem['coverUrl'],
          incomePercentage: this.formValidate.incomePercentage,
          scenicAdminId: this.formValidate.scenicAdminId,
          scenicTagIds: this.sceniclabel.join(','),
          lon: this.formValidate.lon,
          lat: this.formValidate.lat,
        }
        if (this.sceniclabel.length > 5) {
          this.$Message.warning('景区标签最多为5个')
          flag = false
          return
        } else {
          flag = true
        }
        if (this.formItem['coverUrl'] === '') {
          this.$Message.warning('图片不能为空')
          flag = false
          return
        } else {
          flag = true
        }
        if (this.formValidate.scenicTypeId == '' || this.formValidate.scenicTypeId == undefined) {
          this.$Message.warning('景区分类不能为空')
          flag = false
          return
        } else {
          flag = true

        }
        this.$http.rq({
          url: '/proxy/api/scenic',
          data: par,
          method: 'post',
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.formValidateone = {
              busRoutes: '', //公交路线
            }
            this.formValidate = {
              endTime: '',
              incomePercentage: 0,
              introduction: '',
              openTime: '',
              scenicAdminId: '',
              scenicName: '',
              scenicTypeId: '',
              summary: '',
              ticketPrice: 0,
            },
              this.getData()
            this.modal = false
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.warning('请填写完整！')
      }

    },
    // 修改
    Modify () {
      var flag = false
      if (this.$tools.check(this.formValidate)) {
        let par = {
          id: this.imgID,
          busRoutes: this.formValidateone.busRoutes,
          endTime: this.formValidate.endTime,
          introduction: this.formValidate.introduction,
          scenicName: this.formValidate.scenicName,
          scenicTypeId: this.formValidate.scenicTypeId,
          introduction: this.formValidate.introduction,
          summary: this.formValidate.summary,
          address: this.formValidate.address,
          openTime: this.formValidate.openTime,
          ticketPrice: this.formValidate.ticketPrice,
          photo: this.formItem['coverUrl'],
          incomePercentage: this.formValidate.incomePercentage,
          scenicAdminId: this.formValidate.scenicAdminId,
          scenicTagIds: this.sceniclabel.join(','),
        }
        if (this.formItem['coverUrl'] === '') {
          this.$Message.warning('图片不能为空')
          flag = false
          return
        } else {
          flag = true
        }
        if (this.sceniclabel.length > 5) {
          this.$Message.warning('景区标签最多为5个')
          flag = false
          return
        } else {
          flag = true
        }
        if (this.formValidate.scenicTypeId == '' || this.formValidate.scenicTypeId == undefined) {
          this.$Message.warning('景区分类不能为空')
          flag = false
          return
        } else {
          flag = true

        }
        this.$http.rq({
          url: '/proxy/api/scenic',
          data: par,
          method: 'put',
        }).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.message)
            this.modal = false
            this.formValidateone = {
              busRoutes: '', //公交路线
            }
            this.formValidate = {
              endTime: '',
              incomePercentage: 0,
              introduction: '',
              openTime: '',
              scenicAdminId: '',
              scenicName: '',
              scenicTypeId: '',
              summary: '',
              ticketPrice: 0,
            },
              this.getData()
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        this.$Message.warning('请填写完成！')
      }
    },

    //新增
    newly (val) {
      this.scenicarea = '新增景区'
      this.initMap()
      this.getAllJieShuo()
      this.getFileSign()
      this.accesstype()
      this.accesstag()
      this.modal = true
    },
    seachSite () {
      if (this.adress == '') {
        return
      }

      this.markers.forEach(a => {
        a.setMap(null)
      })
      this.markers = []
      this.searchService.clear()
      var poiText = this.city;
      var regionText = this.adress;
      this.searchService.setLocation(poiText);
      this.searchService.search(regionText);
    },
    initMap () {
      //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      //设置地图中心点
      var myLatlng = new qq.maps.LatLng(26.65, 106.63)
      //定义工厂模式函数
      var myOptions = {
        zoom: 8, //设置地图缩放级别
        center: myLatlng, //设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
      }


      //获取dom元素添加地图信息
      var th = this
      var map = new qq.maps.Map(document.getElementById('map'), myOptions);
      var latlngBounds = new qq.maps.LatLngBounds();
      //调用Poi检索类
      var searchService = new qq.maps.SearchService({
        // panel:document.getElementById('infoDiv'),
        // map: map,
        complete: function (results) {
          //设置回调函数参数
          if (results.type != 'POI_LIST') {
            th.$Message.error('请输入更详细关键词')
            return
          }

          var pois = results.detail.pois;
          for (var i = 0, l = pois.length; i < l; i++) {

            var poi = pois[i];
            //扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng);
            var marker = new qq.maps.Marker({
              map: map,
              position: poi.latLng,
            });
            var geocoder = null
            geocoder = new qq.maps.Geocoder({
              complete: function (result) {
                th.formValidate.address = result.detail.address;
              }
            });
            qq.maps.event.addListener(marker, 'click', function (event) {
              th.formValidate.lon = event.latLng.lng
              th.formValidate.lat = event.latLng.lat
              var latitude = event.latLng
              var coord = latitude;
              geocoder.getAddress(coord);
            });
            th.markers.push(marker);
          }
          //调整地图视野
          map.fitBounds(latlngBounds);
        },
      });
      this.searchService = searchService

      this.Map = map
    },
    // 编辑景区
    bluepencil (val) { },
    //删除操作
    rejuet (row) {
      this.imgID = row.row.id
      this.$Modal.confirm({
        title: '操作提示',
        content: '<p>是否在景区列表删除该景区？</p>',
        onOk: () => {
          let par = {
            id: this.imgID
          }
          this.$http.rq({
            url: '/proxy/api/scenic',
            data: par,
            method: 'delete',
          }).then(res => {
            if (res.code === 200) {
              this.$Message.success(res.message)
              this.getData()
            } else {

              this.$Message.error(res.message)
            }
          })
        },
        onCancel: () => { }
      })
    },

    //日期变化
    getStartTime () { },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    //新增
    addScar () {
      this.modal = true
    },
    seeabout () {
      this.pageNumber = 1
      this.getData();
    },
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        orderType: this.orderType,
        scenicName: this.formValidate.scenicName,
      }
      this.$http.rq({
        url: '/proxy/api/scenic',
        method: 'get',
        data: par
      }).then(res => {
        if (res.code === 200) {
          res.data.forEach(a => {
            a['alwaysPopular'] = this.$tools.add(a.addPopularity, a.popularity)
            a['alwayslisten'] = this.$tools.add(a.addListen, a.listen)
          })
          this.tableData = res.data
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
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
    // 图片跟换
    beforeUpload (file) {
      this.signData['key'] = this.signData['key'] + '/' + this.$tools.getGUID() + '.' + file.name.substring(file.name.lastIndexOf(
        '.') + 1, file.name.length);
      return true
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
  }
}

</script>

<style lang="less" scoped>
.herder {
  height: 100%;
  .card {
    min-width: 1653px;
    overflow-x: auto;
    .ivu-table-wrapper {
      min-width: 1553px;
      overflow-x: auto;
    }
  }

  .top {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      display: flex;
      justify-content: space-between;
    }

    .top_right {
      width: 80%;
    }
  }
}
</style>

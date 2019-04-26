<template>
  <div class="herder">
    <card>
      <div class="top">
        <Row>
          <Col span="10">
          <DatePicker type="daterange" :clearable="false" v-model="allData.date" :editable="false" split-panels placeholder="Select date"></DatePicker>
          </Col>
          <Col span="10">
          <Input style="margin-left:10px;" v-model="formValidate.scenicName" clearable placeholder="请输入景区名称" />
          </Col>
          <Col span="3">
          <Button type="primary" style="margin-left:20px" @click="seeabout">确定</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style=" display: flex; flex-direction: column;color:#464c5b,">
            <span style="font-weight:bold">共收入{{tableData2.sellMoney==''?'0':tableData2.sellMoney}}元</span>
            <span style="font-weight:bold">共销售{{tableData2.sellCount==''?'0':tableData2.sellCount}}个</span>
            <span style="font-weight:bold">共{{tableData2.scenicCount==''?'0':tableData2.scenicCount}}个景区{{tableData2.sellScenic==''?'0':tableData2.sellScenic}}个景区收益</span>
          </div>
        </div>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" :current="pageNumber" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </card>
    <Modal v-model="personage_modal" :title="scenicName1" footer-hide width="900" center>
      <Table border :columns="columns2" :data="tableData1"></Table>
      <div style="margin: 10px;overflow: hidden" v-if="total1!=0">
        <div style="float: right;">
          <Page :total="total1" :current="pageNumber1" @on-change="changePage1"></Page>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import fetch from '../assets/tools/http'
import commonApi from '../assets/api/common.js'
export default {
  data () {
    return {
      personage_modal: false,
      pageSize: 10,
      pageNumber: 1,
      scenicName1: '',
      total: 0,
      pageSize1: 10,
      pageNumber1: 1,
      total1: 0,
      allData: {
        date: [this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD')]
      },
      tableData: [],
      tableData1: [],
      tableData2: [],
      formValidate: {
        beginTime: '',
        endTime: '',
        scenicName: ''
      },
      //限制日期
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      value2: ['2016-01-01', '2016-02-15'],
      columns1: [
        {
          title: '景区名称',
          align: 'center',
          key: 'scenicName'
        },
        {
          title: '关联景区账户',
          align: 'center',
          key: 'scenicAdminId',
          // sortable: true,
          // sortMethod: function (a, b, type) {
          //   if (type == 'asc') {
          //     console.log('66')
          //   } else {
          //     console.log('7')
          //   }
          // }
        },
        {
          align: 'center',
          key: 'voiceCount',
          renderHeader: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-arrow-dropdown',
                },
                style: {
                  fontSize: '18px',
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.orderBy = '1'
                    this.pageNumber = 1
                    this.getData()

                  }
                }
              }),
              h('strong', '包含语音包'),
            ])
          }
        },

        {
          align: 'center',
          key: 'sellCount',
          renderHeader: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-arrow-dropdown',
                },
                style: {
                  fontSize: '18px',
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.orderBy = '2'
                    this.pageNumber = 1
                    this.getData()

                  }
                }
              }),
              h('strong', '总销量'),
            ])
          }
        },
        {
          align: 'center',
          key: 'sellMoney',
          renderHeader: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-arrow-dropdown',
                },
                style: {
                  fontSize: '18px',
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.orderBy = '3'
                    this.pageNumber = 1
                    this.getData()

                  }
                }
              }),
              h('strong', '销售总额'),
            ])
          }
        },
        {
          align: 'center',
          key: 'sellpercentageMoney',
          renderHeader: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-arrow-dropdown',
                },
                style: {
                  fontSize: '18px',
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.orderBy = '4'
                    this.pageNumber = 1
                    this.getData()

                  }
                }
              }),
              h('strong', '景区收益总额'),
            ])
          }
        },
        {
          title: '查看景区收益详情',
          align: 'center',
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
                    this.listID = row.id
                    this.scenicName1 = row.scenicName + '收益详情'
                    this.moredetails(params)
                    this.personage_modal = true
                  }
                }
              },
              '查看'
            )
          }
        },

      ],
      columns2: [
        {
          title: '解说员昵称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '解说员ID',
          align: 'center',
          key: 'narratorId',
        },
        {
          title: '语音解说数量',
          align: 'center',
          key: 'voiceCount'
        },
        {
          title: '设定折扣',
          align: 'center',
          key: 'rebate'
        },
        {
          title: '折扣',
          align: 'center',
          key: 'sellpercentageMoney'
        },
        {
          title: '实际售价',
          align: 'center',
          key: 'totalFee'
        },
        {
          title: '销量',
          align: 'center',
          key: 'sellCount'
        },
        {
          title: '收入',
          align: 'center',
          key: 'narratorIncome'
        },
      ]
    }
  },
  created () {
    this.getData()
    this.getSummaries()
  },
  methods: {
    // 获取总和
    getSummaries (param) {
      let par = {
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: commonApi.sellCount,
        data: par
      }).then(res => {
        if (res.code === 200) {
          this.tableData2 = res.data
        } else {
          this.tableData2 = []
        }

      })
    },
    changePage1 (val) {
      this.pageNumber1 = val
      this.moredetails()
    },

    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        orderBy: this.orderBy,
        scenicName: this.formValidate.scenicName,
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: commonApi.getscenicSellPage,
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
    moredetails (params) {
      let par = {
        scenicId: params.row.scenicId,
        pageNumber: this.pageNumber1,
        pageSize: this.pageSize1,
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: commonApi.getscenicDetailsSellPage,
        data: par
      }).then(res => {
        if (res.code === 200) {
          this.tableData1 = res.data
          this.total1 = res.total
        } else {
          this.tableData1 = []
          this.total1 = 0
        }

      })

    },
    // 分页
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    seeabout () {
      this.pageNumber = 1
      this.getData()
      this.getSummaries()
    },
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;
  .top {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    .top-left {
      display: flex;
      align-items: center;
    }
  }
}
</style>

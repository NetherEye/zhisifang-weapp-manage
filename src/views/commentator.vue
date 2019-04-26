<template>
  <div class="herder">
    <card>

      <div class="top">
        <Row>
          <Col span="10">
          <DatePicker type="daterange" :clearable="false" v-model="allData.date" :editable="false" split-panels placeholder="Select date"></DatePicker>
          </Col>
          <Col span="10">
          <Input style="margin-left:10px;" v-model="formValidate.narratorName" placeholder="请输入解说员名称" />
          </Col>
          <Col span="3">
          <Button type="primary" style="margin-left:20px" @click="seeabout">确定</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Table border :columns="columns1" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="total!=0">
          <div style="float: right;">
            <Page :total="total" show-total :current="pageNumber" @on-change="changePage"></Page>
          </div>
        </div>
        <div>

        </div>
      </div>
    </card>
    <Modal v-model="personage_modal" :title="nickName1" footer-hide width="900" center>
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
      nickName1: '',
      personage_modal: false,
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      pageSize1: 10,
      pageNumber1: 1,
      total1: 0,
      allData: {
        date: [this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD')]

      },
      tableData: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
      ],
      tableData1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
      ],
      formValidate: {
        beginTime: '',
        endTime: '',
        narratorName: '',
      },
      value2: ['2016-01-01', '2016-02-15'],
      columns1: [
        {
          title: '解说员名称',
          align: 'center',
          key: 'nickName'
        },
        {
          title: '解说员ID',
          align: 'center',
          key: 'narratorId',
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
              h('strong', '解说包数量'),
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
          key: 'narratorIncome',
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
              h('strong', '总收入'),
            ])
          }
        },
        {
          title: '查看个人收益详情',
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
                    this.nickName1 = row.nickName + '收益详情'
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
          title: '解说景区',
          align: 'center',
          key: 'scenicName'
        },
        {
          title: '实际售价',
          align: 'center',
          key: 'totalFee',
        },
        {
          title: '折扣',
          align: 'center',
          key: 'rebate'
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
  },
  methods: {
    //获取列表
    getData () {
      let par = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        orderBy: this.orderBy,
        narratorName: this.formValidate.narratorName,
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: commonApi.getscenicgetNarratorSellPageSellPage,
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
    //获取列表
    moredetails (params) {
      let par = {
        narratorId: params.row.narratorId,
        pageNumber: this.pageNumber1,
        pageSize: this.pageSize1,
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: commonApi.getNarratorDetailsSellPage,
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
    changePage1 (val) {
      this.pageNumber1 = val
      this.moredetails()
    },
    seeabout () {
      this.pageNumber = 1
      this.getData()
    },
    // 查询
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

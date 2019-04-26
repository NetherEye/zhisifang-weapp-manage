<template>
  <div class="herder">
    <card class="herd">
      <card>
        <row>
          <Divider style="font-size: 26px;">总数据</Divider>
          <Row style="margin: 10px 0;">
            <DatePicker type="daterange" :clearable="false" v-model="allData.date" :editable="false" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
            <Button type="primary" style="margin-left:10px" @click="search(1)">确定</Button>
          </Row>
        </row>
        <card>
          <div class="herd_center">
            <div class="center_top">
              <p>主营收入(元)</p>
              <p>{{topObj.sellSumMoney}}</p>
            </div>
            <div class="center_top">
              <p>销量(份)</p>
              <p>{{topObj.sellCount}}</p>
            </div>
            <div class="center_top">
              <p>浏览人数</p>
              <p>{{topObj.showCount}}</p>
            </div>
            <div class="center_top">
              <p>总用户量</p>
              <p>{{topObj.userCount}}</p>
            </div>
            <div class="center_top">
              <p>新增用户(人)</p>
              <p>{{topObj.addCount}}</p>
            </div>
          </div>
        </card>
      </card>
      <card style="margin-top: 10px;">
        <Divider style="font-size: 26px;">销量/收入数据</Divider>
        <Row>
          <DatePicker type="daterange" :clearable="false" v-model="icome.date" :editable="false" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
          <Button type="primary" style="margin-left:10px" @click="search(2)">确定</Button>
        </Row>
        <div class="surface">
          <div class="surface-left">
            <div id="echartContainer" style="width:800px; height:400px"></div>
          </div>
          <div class="surface-right">
            <div class="surface-right-top top">
              <span class="volume">{{day}}日销量总数(份)</span>
              <span>{{sellCount}}</span>
            </div>
            <div class="surface-right-bottom top">
              <span class="volume">{{day}}日收入(元)</span>
              <span>{{sellMoney}}</span>
            </div>
          </div>
        </div>
      </card>

    </card>
  </div>
</template>
<script>
var echarts = require('echarts')
import fetch from '../assets/tools/http'
import allApi from '../assets/api/user'
require('echarts/lib/component/tooltip')
require('echarts/lib/chart/pie')
export default {
  data () {
    return {
      icome: {
        date: [this.$moment(new Date()).subtract(7, 'd').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(1, 'd').format(
          'YYYY-MM-DD')]
      },
      allData: {
        date: [this.$moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'), this.$moment(new Date()).subtract(1, 'd').format(
          'YYYY-MM-DD')]

      },
      myChart: null,
      topObj: {
        sellSumMoney: '',
        userCount: '',
        sellCount: '',
        addCount: '',
      },
      sellCount: '',
      sellMoney: '',
      day: ''
    }
  },
  mounted () {
    this.initE()
  },
  created () {
    this.getDataTop()
    this.getDatabottom()
  },
  methods: {
    initE () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echartContainer'))

      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: {
          data: [],
        },
        // 表头
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',

          axisLabel: {
            formatter: '{value}'
          }
        }
        ],
        //形状图
        series: [{
          name: '销量',
          type: 'bar',
          data: [],
          dataon: [],
          itemStyle: {
            color: '#458CCB'
          }
        },
        {
          name: '收入',
          type: 'line',
          yAxisIndex: 1,
          data: [],
          itemStyle: {
            color: '#EC7E2F'
          }
        }
        ]
      })
      this.myChart = myChart;
    },
    getDataTop () {
      let par = {
        beginTime: this.$moment(this.allData.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.allData.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: this.$commonApi.workBench,
        data: par

      }).then(res => {
        if (res.code === 200) {
          this.topObj = res.data
        } else {
          this.topObj = {
            sellSumMoney: '',
            userCount: '',
            sellCount: '',
            addCount: '',
          }
          this.$Message.error(res.message)
        }
      })
    },
    getDatabottom () {
      let par = {
        beginTime: this.$moment(this.icome.date[0]).format('YYYY-MM-DD'),
        endTime: this.$moment(this.icome.date[1]).format('YYYY-MM-DD'),
      }
      this.$http.rq({
        url: this.$commonApi.workBenchShell,
        data: par

      }).then(res => {

        if (res.code === 200) {
          this.sellCount = res.data.sellCount
          this.sellMoney = res.data.sellMoney
          this.day = res.data.dateList.length
          this.myChart.setOption({
            xAxis: {
              data: res.data.dateList
            },
            series: [{
              name: '销量',
              type: 'bar',
              data: res.data.sellCountList,
              dataon: [],
              itemStyle: {
                color: '#458CCB'
              }
            },
            {
              name: '收入',
              type: 'line',
              yAxisIndex: 1,
              data: res.data.sellMoneyList,
              itemStyle: {
                color: '#EC7E2F'
              }
            }
            ]
          });
        } else {
          this.day = ''
          this.sellCount = ''
          this.sellMoney = ''
        }
      })
    },
    search (i) {
      if (i == 1) {
        this.getDataTop()
      } else {
        this.getDatabottom()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.herder {
  height: 100%;

  .herd {
    .herd-top {
      height: 90px;
      align-items: center;
    }

    .herd_center {
      height: 50px;
      display: flex;
      justify-content: space-around;

      .center_top {
        height: 50px;
      }
    }

    .surface {
      width: 100%;
      display: flex;

      .surface-left {
        height: 100%;
        width: 800px;
      }

      .surface-right {
        height: 100%;
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .top {
          width: 100%;
          height: 120px;
          border-radius: 5%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .volume {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>

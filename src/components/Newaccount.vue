<template>
  <div class="herder">
    <card>
      <div>
        <Table :columns="columns11"
               :data="data10"
               border></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total"
                  :current="pageNumber"
                  :pageSize="pageSize"
                  @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      tableData: [],
      data10: [],
      columns11: [
        {
          title: '账号名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '登入密码',
          key: 'name',
          align: 'center',
        },
        {
          title: '使用人',
          key: 'name',
          align: 'center',
        },
        {
          title: '账号类别',
          align: 'center',

        },
        {
          title: '账号类型变更',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              on: {
                click: () => {
                  this.imgSrc = row.id
                  this.useCar_modal = true
                }
              }
            }, '修改');
          }
        },

        {
          title: '禁用/启用',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              on: {
                click: () => {
                  this.imgSrc = row.id
                  this.useCar_modal = true
                }
              }
            }, '启用');
          }
        },
        {
          title: '删除',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.imgSrc = row.id
                  this.useCar_modal = true
                }
              }
            }, '删除');
          }
        },
      ],
    }
  },
  mounted () {
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        door: 2035,
        caddress: 'Lake Street 42',
        cname: 'SoftLake Co',
        gender: 'M',
      });
    }
    this.data10 = data;
  },
  methods: {

    changePage () {

    }
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


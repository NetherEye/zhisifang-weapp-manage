<template>
  <div class="herder">
    <card>

      <div style="min-height: 200px;">
        <!-- <div>
          <Button type="primary" @click="$router.go(-1)">返回</Button>
        </div> -->
        <Form ref="formValidate" :model="formValidate" :label-width="80">
          <FormItem label="景区名称" prop="city">
            <Input v-model="formValidate.scenic_name" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>
          <FormItem label="景区分类" prop="city">
            <RadioGroup v-model="formValidate.scenic_type" type="button">
              <Radio label="博物馆"></Radio>
              <Radio label="乡村旅游"></Radio>
              <Radio label="旅游景区"></Radio>
              <Radio label="红色旅游"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="景区介绍" prop="city">
            <Input v-model="formValidate.introduction" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>
          <FormItem label="一句话介绍" prop="city">
            <Input v-model="formValidate.ssummary" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>
          <FormItem label="开放时间" prop="city">
            <Col span="12">
            <TimePicker confirm type="timerange" v-model='formValidate.open_time' placement="bottom-end" placeholder="Select time" style="width: 168px"></TimePicker>
            </Col>
          </FormItem>
          <FormItem label="门票售价" prop="city">
            <Input v-model="formValidate.ticket_price" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>
          <FormItem label="公交路线" prop="city">
            <Input v-model="formValidate.bus_routes" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>

          <FormItem label="上传图片" prop="gender">
            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload ref="upload" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :action="imgUrl" style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="景区标签" prop="city">
            <RadioGroup v-model="formValidate.scenic_tags" type="button">
              <Radio label="宗教场所"></Radio>
              <Radio label="历史景观"></Radio>
              <Radio label="红色旅游"></Radio>
              <Radio label="自然景观"></Radio>
              <Radio label="人文景观"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联景区管理员账户" prop="city" :label-width="120">
            <Input v-model="formValidate.username" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>
          <FormItem label="景区收入提成" prop="city" :label-width="120">
            <Input v-model="formValidate.bus_routes" :maxlength="30" placeholder="返回地点"></Input>
          </FormItem>
          <div class="bottom">
            <Button type="primary">保存</Button>
          </div>
        </Form>
      </div>
    </card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrl: '', //图片
      imgName: '',
      uploadList: [],
      //弹框form
      formValidate: {
        scenic_name: '',
        scenic_type: '', //景区类型
        introduction: '',
        summary: '',
        open_time: '', //开放时间
        bus_routes: '', //公交路线
        ticket_price: '', //
        scenic_tags: '', //景区标签
        username: '' //账户
      },
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      tableData: [],
      data10: [],
      columns11: [
        {
          title: '账号名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '登入密码',
          key: 'name',
          align: 'center'
        },
        {
          title: '使用人',
          key: 'name',
          align: 'center'
        },
        {
          title: '账号类别',
          align: 'center'
        },
        {
          title: '账号类型变更',
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
                    this.useCar_modal = true
                  }
                }
              },
              '修改'
            )
          }
        },

        {
          title: '禁用/启用',
          key: 'name',
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
                    this.useCar_modal = true
                  }
                }
              },
              '启用'
            )
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
                    this.imgSrc = row.id
                    this.useCar_modal = true
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
  mounted() {
    const data = []
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
        gender: 'M'
      })
    }
    this.data10 = data
  },
  methods: {
    //图片格式
    handleFormatError() {},
    //图片大小
    handleMaxSize() {},
    //  限制图片张数
    handleBeforeUpload() {},
    changePage() {}
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
  .bottom {
    display: flex;
    justify-content: space-around;
  }
}
</style>


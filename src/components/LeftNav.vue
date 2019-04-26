<template>
  <div class="left">
    <div class="icon">
      <div class="icon-log">
        <img src="../assets/img/top.png" alt="">
      </div>
    </div>
    <Sider :style="{position: 'fixed', top:'64px', height: '100vh', left: 0, overflow: 'hidden'}">
      <Menu theme="dark" width="auto" :open-names="['1', '2', '3', '4', '5', '6', '7']" :active-name="$store.state.activePathName">
        <Submenu name="1" v-show="returnParentMenu('工作台')">
          <template slot="title">
            <Icon type="ios-cut"></Icon>
            工作台
          </template>
          <MenuItem name="工作台" v-show="returnChildMenu('工作台')" :to="{name: '工作台'}">工作台</MenuItem>
        </Submenu>
        <Submenu name="2" v-show="returnParentMenu('景区')">
          <template slot="title">
            <Icon type="md-document"></Icon>
            景区管理
          </template>
          <MenuItem name="景区" v-show="returnChildMenu('景区')" :to="{name: '景区'}">景区</MenuItem>
          <MenuItem name="景点" v-show="returnChildMenu('景点')" :to="{name: '景点'}">景点</MenuItem>
          <MenuItem name="解说内容管理" v-show="returnChildMenu('解说内容管理')" :to="{name: '解说内容管理'}">解说内容管理</MenuItem>
          <MenuItem name="景区分类标签管理" v-show="returnChildMenu('景区分类标签管理')" :to="{name: '景区分类标签管理'}">景区分类标签管理</MenuItem>
        </Submenu>
        <Submenu name="3" v-show="returnParentMenu('销售管理')">
          <template slot="title">
            <Icon type="md-chatbubbles"></Icon>
            销售管理
          </template>
          <MenuItem name="景区收益管理" v-show="returnChildMenu('景区收益管理')" :to="{name: '景区收益管理'}">景区收益管理</MenuItem>
          <MenuItem name="解说员收益管理" v-show="returnChildMenu('解说员收益管理')" :to="{name: '解说员收益管理'}">解说员收益管理</MenuItem>
        </Submenu>
        <Submenu name="4" v-show="returnParentMenu('用户管理')">
          <template slot="title">
            <Icon type="md-heart"></Icon>
            用户管理
          </template>
          <MenuItem name="用户管理" v-show="returnChildMenu('用户管理')" :to="{name: '用户管理'}">用户管理</MenuItem>
        </Submenu>
        <Submenu name="5" v-show="returnParentMenu('banner管理')">
          <template slot="title">
            <Icon type="md-leaf"></Icon>
            banner管理
          </template>
          <MenuItem name="banner管理" v-show="returnChildMenu('banner管理')" :to="{name: 'banner管理'}">banner管理</MenuItem>
        </Submenu>
        <Submenu name="6" v-show="returnParentMenu('搜索管理')">
          <template slot="title">
            <Icon type="md-search"></Icon>
            搜索管理
          </template>
          <MenuItem name="搜索管理" v-show="returnChildMenu('搜索管理')" :to="{name: '搜索管理'}">搜索管理</MenuItem>
        </Submenu>
        <Submenu name="7" v-show="returnParentMenu('账户管理')">
          <template slot="title">
            <Icon type="ios-bookmarks" />
            账户管理
          </template>
          <MenuItem name="账户管理" v-show="returnChildMenu('账户管理')" :to="{name: '账户管理'}">账户管理</MenuItem>
        </Submenu>
      </Menu>
    </Sider>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    returnParentMenu (name) {
      let f = false
      this.$store.getters.c_navigate.forEach(a => {
        if (a.menuName == name) {
          f = true
        }
      })
      return f
    },
    returnChildMenu (name) {
      let f = false
      this.$store.getters.c_navigate.forEach(a => {
        a.childMenus.forEach(b => {
          if (b.menuName == name) {
            f = true
          }
        })
      })
      return f

    },

  }

}
</script>

<style lang="less" scoped>
.left {
  position: absolute;
  width: 200px;
  top: 0;
  bottom: 0;
  left: 0;
  .icon {
    width: 200px;
    height: 64px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0px;
    .icon-log {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>

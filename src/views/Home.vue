<template>
	<div class="footer-bg">
		<div class="right">
			<my-header></my-header>
			<div style="overflow: auto;position: absolute;top: 64px;bottom: 0;left: 0;right: 0;">
				<Content :style="{padding: '16px 16px'}">
					<router-view />
				</Content>
			</div>
		</div>

		<div class="left">
			<left-nav></left-nav>
		</div>

	</div>
</template>

<script>
	import Header from '../components/Header'
	import LeftNav from '../components/LeftNav'

	export default {
		data() {
			return {

			}
		},
		components: {
			'my-header': Header,
			'left-nav': LeftNav
		},
		created() {

		}

	}
</script>

<style>
	/* #content {
  flex: 1;
  background-color: #edf0f5;
  overflow: hidden;
} */
	.right {
		position: absolute;
		left: 200px;
		bottom: 0;
		top: 0;
		right: 0;
	}
</style>

<script type="text/jsx">
  export default {
    name: 'Masterbar',
    data () {
      return {name: 'World'}
    },
    render () {
      return (<header id="header" class="c-masterbar">
        {this.$slots.default}
      </header>)
    }
  }
</script>


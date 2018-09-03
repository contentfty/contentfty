/* eslint-disable no-extra-parens */

export default {
  props: {
    className: String,
    isHeader: Boolean,
    href: String
  },
  computed: {
    rowClasses() {
      return [
        'table-row',
        this.className,
        {
          'is-header': this.isHeader
        }
      ]
    }
  },
  components: {
  },
  methods: {
    goToHref () {
      this.$router.push(this.href)
    }
  },
  render (h) {
    if (!this.href) {
      return (
        <tr class={this.rowClasses}>
          {this.$slots.default}
        </tr>
      )
    }
    return (
      <tr class={this.rowClasses} tabIndex="0" onClick={ this.goToHref }>
        {this.$slots.default}
      </tr>
    )
  }
}
